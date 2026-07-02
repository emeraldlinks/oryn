import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wsId = Number(session.user.workspaceId);
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");
    const status = searchParams.get("status");

    const result = await withDb(async (db) => {
      const query = db.Refund.query()
        .where({ workspaceId: wsId })
        .preload("invoice")
        .order("createdAt", "desc");

      if (invoiceId) query.where({ invoiceId: Number(invoiceId) });
      if (status) query.where({ status });

      return query.run();
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const wsId = Number(session.user.workspaceId);

    const refund = await withDb(async (db) => {
      return db.Refund.insert({
        workspaceId: wsId,
        invoiceId: Number(body.invoiceId),
        amount: body.amount,
        currency: body.currency || "USD",
        reason: body.reason,
        status: "pending",
      });
    });

    return NextResponse.json(refund, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;
    const wsId = Number(session.user.workspaceId);

    const updateData: any = { ...data };
    if (data.status === "processed") {
      updateData.processedAt = new Date().toISOString();
    }

    await withDb(async (db) => {
      return db.Refund.update({ id: Number(id), workspaceId: wsId }, updateData);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const wsId = Number(session.user.workspaceId);

    await withDb(async (db) => {
      return db.Refund.delete({ id: Number(id), workspaceId: wsId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
