import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "contacts";

  if (type === "contacts") {
    const contacts = await db.Contact.query()
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .get();

    const header = "firstName,lastName,email,phone,company,title,source,status,tags\n";
    const rows = (contacts as any[])
      .map(
        (c) =>
          `"${c.firstName}","${c.lastName}","${c.email || ""}","${c.phone || ""}","${c.company || ""}","${c.title || ""}","${c.source || ""}","${c.status}","${(c.tags || []).join(";")}"`
      )
      .join("\n");

    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="contacts-${Date.now()}.csv"`,
      },
    });
  }

  if (type === "deals") {
    const deals = await db.Deal.query()
      .preload("contact")
      .where("workspaceId", "=", wsId)
      .orderBy("createdAt", "DESC")
      .get();

    const header = "title,value,currency,stage,probability,contact,expectedCloseDate,assignedTo\n";
    const rows = (deals as any[])
      .map(
        (d) =>
          `"${d.title}",${d.value},"${d.currency}","${d.stage}",${d.probability},"${d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : ""}","${d.expectedCloseDate || ""}","${d.assignedTo || ""}"`
      )
      .join("\n");

    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="deals-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
