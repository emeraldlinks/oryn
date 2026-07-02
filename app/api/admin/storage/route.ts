import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const quota = await db.WorkspaceQuota.query().where("workspaceId", "=", wsId).first();
  const maxStorageGb = quota?.maxStorageGb ?? 5;
  const limitBytes = maxStorageGb * 1024 * 1024 * 1024;

  const contactsCount = await db.Contact.query().where("workspaceId", "=", wsId).count();
  const dealsCount = await db.Deal.query().where("workspaceId", "=", wsId).count();
  const productsCount = await db.Product.query().where("workspaceId", "=", wsId).count();
  const projectsCount = await db.Project.query().where("workspaceId", "=", wsId).count();
  const documentsCount = await db.Document.query().where("workspaceId", "=", wsId).count();

  const used = 0;
  const percentage = limitBytes > 0 ? 0 : 0;

  return NextResponse.json({
    storage: { used, limit: limitBytes, percentage },
    entities: {
      contacts: contactsCount,
      deals: dealsCount,
      products: productsCount,
      projects: projectsCount,
      documents: documentsCount,
    },
  });
}
