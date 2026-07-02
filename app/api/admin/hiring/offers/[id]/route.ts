import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const id = Number(params.id);
  const body = await req.json();

  const existing = await db.OfferLetter.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, any> = {};
  const fields = ["status", "offeredSalary", "currency", "startDate", "terms", "benefits", "notes", "signedDocumentUrl"];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.status === "sent" && existing.status === "draft") {
    data.sentAt = new Date().toISOString();
  }
  if ((body.status === "accepted" || body.status === "declined") && existing.status !== body.status) {
    data.respondedAt = new Date().toISOString();
  }

  await db.OfferLetter.update({ id, workspaceId: wsId }, data);

  if (body.status === "accepted" || existing.status === "accepted") {
    const app = await db.JobApplication.query().where("id", "=", existing.applicationId).first();
    if (app) {
      await db.JobApplication.update({ id: app.id!, workspaceId: wsId }, { stage: "hired" });
    }
  }

  const updated = await db.OfferLetter.query().where("id", "=", id).where("workspaceId", "=", wsId).first();
  return NextResponse.json(updated);
}
