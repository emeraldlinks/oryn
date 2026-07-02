import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to, subject, html, campaignId, contactId } = body;
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email-track?campaignId=${campaignId || 0}&contactId=${contactId || 0}&token=${Date.now()}" width="1" height="1" />`;
  const htmlWithTracking = html + trackingPixel;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: htmlWithTracking,
    });

    await db.Message.insert({
      workspaceId: wsId,
      channel: "email",
      direction: "outbound",
      contactId: contactId ? Number(contactId) : undefined,
      fromAddress: process.env.SMTP_FROM || process.env.SMTP_USER,
      toAddress: to,
      subject,
      body: html,
      status: "sent",
      sentAt: new Date().toISOString(),
    });

    if (campaignId) {
      await db.EmailCampaign.update(
        { id: Number(campaignId), workspaceId: wsId },
        {
          sentAt: new Date().toISOString(),
          status: "sent",
          recipientCount: (await db.EmailCampaign.get({ id: Number(campaignId), workspaceId: wsId }))?.recipientCount || 0 + 1,
        }
      );
    }

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
