import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  if (body.type === "contacts" && Array.isArray(body.data)) {
    let imported = 0;
    let skipped = 0;

    for (const row of body.data) {
      if (!row.firstName || !row.lastName) {
        skipped++;
        continue;
      }

      const email = row.email || `${row.firstName.toLowerCase()}.${row.lastName.toLowerCase()}@imported.local`;
      const existing = await db.Contact.get({ email, workspaceId: wsId });
      if (existing) {
        skipped++;
        continue;
      }

      await db.Contact.insert({
        workspaceId: wsId,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email || undefined,
        phone: row.phone || undefined,
        company: row.company || undefined,
        title: row.title || undefined,
        source: row.source || "imported",
        status: row.status || "lead",
        tags: row.tags ? (typeof row.tags === "string" ? row.tags.split(";") : row.tags) : [],
      });
      imported++;
    }

    return NextResponse.json({ imported, skipped });
  }

  if (body.type === "deals" && Array.isArray(body.data)) {
    let imported = 0;
    let skipped = 0;

    for (const row of body.data) {
      if (!row.title) {
        skipped++;
        continue;
      }

      await db.Deal.insert({
        workspaceId: wsId,
        title: row.title,
        value: Number(row.value) || 0,
        currency: row.currency || "USD",
        stage: row.stage || "lead",
        probability: Number(row.probability) || 10,
        contactId: row.contactId ? Number(row.contactId) : undefined,
        expectedCloseDate: row.expectedCloseDate || undefined,
      });
      imported++;
    }

    return NextResponse.json({ imported, skipped });
  }

  return NextResponse.json({ error: "Invalid type or data" }, { status: 400 });
}
