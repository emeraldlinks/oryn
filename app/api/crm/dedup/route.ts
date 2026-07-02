import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const contacts = await db.Contact.query()
    .where("workspaceId", "=", wsId)
    .get() as any[];

  const duplicates: Array<{ field: string; value: string; ids: number[]; names: string[] }> = [];
  const seen = new Map<string, number[]>();

  for (const c of contacts) {
    if (c.email) {
      const key = c.email.toLowerCase().trim();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(c.id);
    }
  }
  for (const [email, ids] of seen) {
    if (ids.length > 1) {
      duplicates.push({
        field: "email",
        value: email,
        ids,
        names: ids.map((id) => {
          const c = contacts.find((x) => x.id === id);
          return c ? `${c.firstName} ${c.lastName}` : "";
        }),
      });
    }
  }

  seen.clear();
  for (const c of contacts) {
    const key = `${c.firstName?.toLowerCase().trim()}|${c.lastName?.toLowerCase().trim()}|${c.company?.toLowerCase().trim() || ""}`;
    if (key === "|") continue;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(c.id);
  }
  for (const [nameKey, ids] of seen) {
    if (ids.length > 1) {
      const [fn, ln] = nameKey.split("|");
      duplicates.push({
        field: "name+company",
        value: `${fn} ${ln}`,
        ids,
        names: ids.map((id) => {
          const c = contacts.find((x) => x.id === id);
          return c ? `${c.firstName} ${c.lastName}` : "";
        }),
      });
    }
  }

  return NextResponse.json(duplicates);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { keepId, mergeIds } = body;
  const db = await initDb();
  const wsId = Number(session.user.workspaceId);

  const primary = await db.Contact.get({ id: Number(keepId), workspaceId: wsId });
  if (!primary) return NextResponse.json({ error: "Primary contact not found" }, { status: 404 });

  for (const id of mergeIds) {
    if (Number(id) === Number(keepId)) continue;

    const tables = ["Deal", "Activity", "Ticket", "Message", "Call", "Meeting", "Invoice", "Document", "Order"];
    for (const table of tables) {
      const model = (db as any)[table];
      if (model?.updateMany) {
        await model.updateMany(
          { contactId: Number(id), workspaceId: wsId },
          { contactId: Number(keepId) }
        );
      }
    }

    await db.Contact.delete({ id: Number(id), workspaceId: wsId });
  }

  return NextResponse.json({ success: true, keptId: Number(keepId), merged: mergeIds.length - 1 });
}
