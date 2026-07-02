import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const setting = await db.TwoFactorSetting.get({ userId: Number((session.user as any).id) });

  return NextResponse.json({
    enabled: setting?.enabled || false,
    verifiedAt: setting?.verifiedAt || null,
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);

  const secret = crypto.randomBytes(20).toString("hex");
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(6).toString("hex")
  );


  const existing = await db.TwoFactorSetting.get({ userId });
  if (existing) {
    await db.TwoFactorSetting.update(
      { id: existing.id },
      { secret, backupCodes, enabled: false, verifiedAt: null }
    );
  } else {
    await db.TwoFactorSetting.insert({
      userId,
      secret,
      backupCodes,
      enabled: false,
    });
  }

  return NextResponse.json({
    secret,
    qrCodeUrl: `otpauth://totp/Oryn:${session.user.email}?secret=${secret}&issuer=Oryn`,
    backupCodes,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { token } = body;
  const userId = Number((session.user as any).id);

  const setting = await db.TwoFactorSetting.get({ userId });

  if (!setting || !setting.secret) {
    return NextResponse.json({ error: "2FA not initialized" }, { status: 400 });
  }

  await db.TwoFactorSetting.update(
    { id: setting.id },
    { verifiedAt: new Date().toISOString(), enabled: true }
  );

  return NextResponse.json({ success: true, enabled: true, verifiedAt: new Date().toISOString() });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);

  const setting = await db.TwoFactorSetting.get({ userId });

  if (setting) {
    await db.TwoFactorSetting.delete({ id: setting.id });
  }

  return NextResponse.json({ success: true });
}
