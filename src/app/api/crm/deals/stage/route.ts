import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, stage, probability } = body;
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const deal = await db.Deal.get({ id: Number(id), workspaceId: wsId });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const oldStage = (deal as any).stage;
  const now = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    stage,
    updatedAt: now,
  };
  if (probability !== undefined) updateData.probability = probability;
  if (stage === "closed-won") updateData.wonAt = now;
  if (stage === "closed-lost") updateData.lostAt = now;

  await db.Deal.update({ id: Number(id), workspaceId: wsId }, updateData);

  await db.Activity.insert({
    workspaceId: wsId,
    type: "deal-status-change",
    subject: `Deal moved from ${oldStage} to ${stage}`,
    body: `"${(deal as any).title}" moved from "${oldStage}" to "${stage}"`,
    dealId: Number(id),
    contactId: (deal as any).contactId,
    userId: Number(session.user.id),
  });

  const assigneeId = (deal as any).assignedTo;
  if (assigneeId && assigneeId !== Number(session.user.id)) {
    await db.Notification.insert({
      workspaceId: wsId,
      userId: assigneeId,
      type: "deal",
      title: `Deal stage changed: ${(deal as any).title}`,
      body: `Moved from "${oldStage}" to "${stage}"`,
    });
  }

  const updated = await db.Deal.query()
    .preload("contact")
    .preload("assignee")
    .where("id", "=", Number(id))
    .first();

  return NextResponse.json(updated);
}
