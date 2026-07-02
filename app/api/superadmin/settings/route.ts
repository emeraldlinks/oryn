import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth(["superadmin"]);
  if (error) return error;

  const workspace = await db.Workspace.query().where("id", "=", Number(user.workspaceId)).first();
  const settings = await db.BrandingConfig.query().where("workspaceId", "=", Number(user.workspaceId)).first();

  return NextResponse.json({
    platformName: workspace?.name || "Oryn",
    supportEmail: "support@oryn.com",
    defaultLocale: "en",
    timezone: "UTC",
    smtpHost: settings?.smtpHost || "smtp.sendgrid.net",
    smtpPort: settings?.smtpPort || "587",
    fromName: settings?.fromName || "Oryn CRM",
    fromEmail: settings?.fromEmail || "noreply@oryn.com",
    passwordPolicy: "standard",
    sessionTimeout: "60",
    rateLimit: "100",
    maxLoginAttempts: "5",
  });
}

export async function POST(req: Request) {
  const { user, error } = await requireAuth(["superadmin"]);
  if (error) return error;
  const body = await req.json();

  const wsId = Number(user.workspaceId);
  const existing = await db.BrandingConfig.query().where("workspaceId", "=", wsId).first();

  if (existing) {
    await db.BrandingConfig.update({ id: existing.id, workspaceId: wsId }, {
      ...(body.smtpHost !== undefined && { smtpHost: body.smtpHost }),
      ...(body.smtpPort !== undefined && { smtpPort: body.smtpPort }),
      ...(body.fromName !== undefined && { fromName: body.fromName }),
      ...(body.fromEmail !== undefined && { fromEmail: body.fromEmail }),
    });
  }

  if (body.platformName) {
    await db.Workspace.update({ id: wsId }, { name: body.platformName });
  }

  return NextResponse.json({ success: true });
}
