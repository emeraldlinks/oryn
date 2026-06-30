import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const contactId = searchParams.get("contactId");

  if (campaignId && contactId) {
    try {
      const db = await initDb();
      const campaign = await db.EmailCampaign.get({ id: Number(campaignId) });
      if (campaign) {
        await db.EmailCampaign.update(
          { id: Number(campaignId) },
          { openCount: ((campaign as any).openCount || 0) + 1 }
        );
      }

      await db.Activity.insert({
        workspaceId: (campaign as any).workspaceId,
        type: "email",
        subject: `Email opened from campaign #${campaignId}`,
        contactId: Number(contactId),
        userId: 0,
      });
    } catch {}
  }

  return new NextResponse(
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}
