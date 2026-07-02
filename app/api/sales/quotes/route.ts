import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const contactId = searchParams.get("contactId");

  return withDb(async (db) => {
    let query = db.Quote.query()
      .where("workspaceId", "=", wsId)
      .preload("contact")
      .preload("lineItems.product");

    if (status) query = query.where("status", "=", status);
    if (contactId) query = query.where("contactId", "=", Number(contactId));

    const quotes = await query.orderBy("createdAt", "DESC").get();
    return NextResponse.json(quotes);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  return withDb(async (db) => {
    const year = new Date().getFullYear();
    const lastQuote = await db.Quote.query()
      .where("workspaceId", "=", wsId)
      .where("quoteNumber", "LIKE", `QTE-${year}-%`)
      .orderBy("createdAt", "DESC")
      .first();

    let seq = 1;
    if (lastQuote) {
      const parts = lastQuote.quoteNumber.split("-");
      seq = parseInt(parts[parts.length - 1], 10) + 1;
    }
    const quoteNumber = `QTE-${year}-${String(seq).padStart(4, "0")}`;

    const lineItems = (body.lineItems || []).map((item: any) => {
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || 0;
      const discountPercent = item.discountPercent || 0;
      const discountAmount = item.discountAmount || 0;
      const lineTotal = qty * unitPrice - discountAmount;
      return {
        productId: Number(item.productId),
        quantity: qty,
        unitPrice,
        discountPercent,
        discountAmount,
        total: lineTotal,
        description: item.description,
      };
    });

    const subtotal = lineItems.reduce((sum: number, li: any) => sum + li.total, 0);
    const taxRate = body.taxRate ?? 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = body.discountAmount ?? 0;
    const total = subtotal + taxAmount - discountAmount;

    const quote = await db.Quote.insert({
      workspaceId: wsId,
      contactId: Number(body.contactId),
      quoteNumber,
      status: "draft",
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      total,
      validUntil: body.validUntil,
      notes: body.notes,
      terms: body.terms ? JSON.stringify(body.terms) : undefined,
    });

    for (const li of lineItems) {
      await db.QuoteLineItem.insert({
        quoteId: quote.id,
        productId: li.productId,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        discountPercent: li.discountPercent,
        discountAmount: li.discountAmount,
        total: li.total,
        description: li.description,
      });
    }

    const created = await db.Quote.query()
      .where("id", "=", quote.id)
      .preload("contact")
      .preload("lineItems.product")
      .first();

    return NextResponse.json(created, { status: 201 });
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const { id, ...data } = body;

  return withDb(async (db) => {
    const updateData: any = { ...data };
    if (data.status === "sent") {
      updateData.sentAt = new Date().toISOString();
    }
    if (data.status === "accepted") {
      updateData.acceptedAt = new Date().toISOString();
    }
    await db.Quote.update({ id: Number(id), workspaceId: wsId }, updateData);
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const wsId = Number(session.user.workspaceId);
  return withDb(async (db) => {
    await db.Quote.delete({ id: Number(id), workspaceId: wsId });
    return NextResponse.json({ success: true });
  });
}
