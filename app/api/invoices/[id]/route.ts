import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  const invoice = await db.Invoice.query().where("id", "=", id).first();
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contact = await db.Contact.query().where("id", "=", invoice.contactId).first();
  const workspace = await db.Workspace.query().where("id", "=", invoice.workspaceId).first();

  return NextResponse.json({
    ...invoice,
    contact,
    workspaceName: workspace?.name,
  });
}
