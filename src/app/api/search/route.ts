import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const db = await initDb();
  const wsId = Number(session.user.workspaceId);
  const query = `%${q}%`;

  const results: Array<{
    type: string;
    id: number;
    label: string;
    url: string;
    match: string;
  }> = [];

  const contacts = await db.Contact.query()
    .preload("assignee")
    .where("workspaceId", "=", wsId)
    .whereRaw(
      '(LOWER("firstName" || \' \' || "lastName") LIKE LOWER(?) OR LOWER("email") LIKE LOWER(?) OR LOWER("company") LIKE LOWER(?))',
      [query, query, query]
    )
    .limit(5)
    .get();

  for (const c of contacts as any[]) {
    results.push({
      type: "Contact",
      id: c.id,
      label: `${c.firstName} ${c.lastName}`,
      url: `/admin/crm?contactId=${c.id}`,
      match: c.email || c.company || "",
    });
  }

  const deals = await db.Deal.query()
    .preload("contact")
    .where("workspaceId", "=", wsId)
    .where("title", "ILIKE", query)
    .limit(5)
    .get();

  for (const d of deals as any[]) {
    results.push({
      type: "Deal",
      id: d.id,
      label: d.title,
      url: `/admin/crm/pipeline`,
      match: d.contact
        ? `${d.contact.firstName} ${d.contact.lastName}`
        : "",
    });
  }

  const products = await db.Product.query()
    .where("workspaceId", "=", wsId)
    .whereRaw(
      '(LOWER("name") LIKE LOWER(?) OR LOWER("sku") LIKE LOWER(?))',
      [query, query]
    )
    .limit(5)
    .get();

  for (const p of products as any[]) {
    results.push({
      type: "Product",
      id: p.id,
      label: p.name,
      url: `/admin/products`,
      match: p.sku || `$${p.price}`,
    });
  }

  const tickets = await db.Ticket.query()
    .preload("contact")
    .where("workspaceId", "=", wsId)
    .where("subject", "ILIKE", query)
    .limit(5)
    .get();

  for (const t of tickets as any[]) {
    results.push({
      type: "Ticket",
      id: t.id,
      label: t.subject,
      url: `/admin/support`,
      match: t.status,
    });
  }

  return NextResponse.json({ results });
}
