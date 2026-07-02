import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  let config = await db.BrandingConfig.query().where("workspaceId", "=", wsId).first();
  if (!config) {
    config = await db.BrandingConfig.insert({ workspaceId: wsId });
  }
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();

  let config = await db.BrandingConfig.query().where("workspaceId", "=", wsId).first();
  if (config) {
    await db.BrandingConfig.update({ id: config.id, workspaceId: wsId }, {
      ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      ...(body.primaryColor !== undefined && { primaryColor: body.primaryColor }),
      ...(body.secondaryColor !== undefined && { secondaryColor: body.secondaryColor }),
      ...(body.faviconUrl !== undefined && { faviconUrl: body.faviconUrl }),
      ...(body.customCss !== undefined && { customCss: body.customCss }),
      ...(body.customJs !== undefined && { customJs: body.customJs }),
      ...(body.companyName !== undefined && { companyName: body.companyName }),
    });
  } else {
    config = await db.BrandingConfig.insert({
      workspaceId: wsId,
      logoUrl: body.logoUrl || null,
      primaryColor: body.primaryColor || null,
      secondaryColor: body.secondaryColor || null,
      faviconUrl: body.faviconUrl || null,
      customCss: body.customCss || null,
      customJs: body.customJs || null,
      companyName: body.companyName || null,
    });
  }

  config = await db.BrandingConfig.query().where("workspaceId", "=", wsId).first();
  return NextResponse.json(config);
}
