import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");
  const wsId = Number(session.user.workspaceId);

  const db = await initDb();
  let query = db.CLVCalculation.query().where("workspaceId", "=", wsId);

  if (contactId) {
    query = query.where("contactId", "=", Number(contactId));
  }

  const calculations = await query.orderBy("createdAt", "DESC").get();

  const allRecords = await db.CLVCalculation.query()
    .where("workspaceId", "=", wsId)
    .get();

  const avgClv = allRecords.length > 0
    ? allRecords.reduce((sum: number, r: any) => sum + r.clv, 0) / allRecords.length
    : 0;

  return NextResponse.json({ calculations, averageClv: Math.round(avgClv * 100) / 100 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { contactId, averageOrderValue, purchaseFrequency, customerLifespan } = body;
  const wsId = Number(session.user.workspaceId);

  const clv = Math.round(averageOrderValue * purchaseFrequency * customerLifespan * 100) / 100;

  const db = await initDb();
  const calculation = await db.CLVCalculation.insert({
    workspaceId: wsId,
    contactId: contactId ? Number(contactId) : null,
    averageOrderValue,
    purchaseFrequency,
    customerLifespan,
    clv,
    calculatedAt: new Date().toISOString(),
  });

  return NextResponse.json(calculation, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await initDb();
  await db.CLVCalculation.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
