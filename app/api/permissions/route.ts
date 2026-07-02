import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = session.user.role as string;

  const rolePermissions: Record<string, Record<string, string[]>> = {
    superadmin: {
      contacts: ["create", "read", "update", "delete", "export", "import"],
      deals: ["create", "read", "update", "delete", "export"],
      products: ["create", "read", "update", "delete"],
      orders: ["create", "read", "update", "delete"],
      employees: ["create", "read", "update", "delete"],
      marketing: ["create", "read", "update", "delete", "send"],
      settings: ["read", "update"],
      billing: ["read", "update"],
      reports: ["read", "export"],
      automation: ["create", "read", "update", "delete"],
    },
    admin: {
      contacts: ["create", "read", "update", "delete", "export", "import"],
      deals: ["create", "read", "update", "delete", "export"],
      products: ["create", "read", "update", "delete"],
      orders: ["create", "read", "update", "delete"],
      employees: ["create", "read", "update"],
      marketing: ["create", "read", "update", "send"],
      settings: ["read", "update"],
      billing: ["read"],
      reports: ["read", "export"],
      automation: ["create", "read", "update", "delete"],
    },
    manager: {
      contacts: ["create", "read", "update", "export"],
      deals: ["create", "read", "update"],
      products: ["read"],
      orders: ["create", "read"],
      employees: ["read"],
      marketing: ["read", "update"],
      settings: ["read"],
      reports: ["read"],
      automation: ["read"],
    },
    employee: {
      contacts: ["create", "read", "update"],
      deals: ["create", "read", "update"],
      products: ["read"],
      orders: ["create", "read"],
      marketing: ["read"],
      reports: ["read"],
    },
    client: {
      contacts: ["read"],
      orders: ["read"],
      invoices: ["read"],
      tickets: ["create", "read"],
      documents: ["read"],
    },
  };

  return NextResponse.json({
    role: userRole,
    permissions: rolePermissions[userRole] || {},
  });
}
