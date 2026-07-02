import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  const quota = await db.WorkspaceQuota.query().where("workspaceId", "=", wsId).first();
  const maxStorageGb = quota?.maxStorageGb ?? 5;

  const contactsCount = await db.Contact.count({ workspaceId: wsId });
  const dealsCount = await db.Deal.count({ workspaceId: wsId });
  const productsCount = await db.Product.count({ workspaceId: wsId });
  const projectsCount = await db.Project.count({ workspaceId: wsId });
  const documentsCount = await db.Document.count({ workspaceId: wsId });

  const usedGB = (contactsCount + dealsCount + productsCount + projectsCount + documentsCount) * 0.0001;
  const totalGB = maxStorageGb;

  return NextResponse.json({
    usedGB,
    totalGB,
    entities: {
      contacts: contactsCount,
      deals: dealsCount,
      products: productsCount,
      projects: projectsCount,
      documents: documentsCount,
    },
  });
}
