import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to, message, contactId } = body;
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (body.channel === "whatsapp" && twilioSid && twilioToken && twilioFrom) {
    try {
      const twilio = require("twilio");
      const client = twilio(twilioSid, twilioToken);
      const result = await client.messages.create({
        from: `whatsapp:${twilioFrom}`,
        to: `whatsapp:${to}`,
        body: message,
      });

      await db.Message.insert({
        workspaceId: wsId,
        channel: "whatsapp",
        direction: "outbound",
        contactId: contactId ? Number(contactId) : undefined,
        fromAddress: twilioFrom,
        toAddress: to,
        body: message,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, sid: result.sid });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const twilio = require("twilio");
      const client = twilio(twilioSid, twilioToken);
      const result = await client.messages.create({
        from: twilioFrom,
        to,
        body: message,
      });

      await db.Message.insert({
        workspaceId: wsId,
        channel: "sms",
        direction: "outbound",
        contactId: Number(contactId) || undefined,
        fromAddress: twilioFrom,
        toAddress: to,
        body: message,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, sid: result.sid });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "SMS not configured" }, { status: 500 });
}
