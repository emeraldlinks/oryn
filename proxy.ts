import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
  "/pay/",
  "/_next",
  "/favicon.ico",
];

const roleRoutes: Record<string, string> = {
  superadmin: "/superadmin",
  admin: "/admin",
  manager: "/manager",
  employee: "/employee",
  client: "/client",
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic = publicPaths.some((p) => path.startsWith(p));
  if (isPublic) return NextResponse.next();

  const isStaffPath = path.startsWith("/admin/staff") || path.startsWith("/api/admin/staff");
  const isInventoryPath = path.startsWith("/admin/inventory") || path.startsWith("/api/admin/inventory");
  const isFeaturePath = isStaffPath || isInventoryPath;

  const isApi = path.startsWith("/api/");
  if (isApi && !isFeaturePath) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const wsId = token.workspaceId as number;

  async function checkFeature(feature: "canUseStaffManagement" | "canUseInventory"): Promise<boolean> {
    const val = token[feature];
    if (val !== undefined) return val;
    try {
      const quota = await db.WorkspaceQuota.get({ workspaceId: wsId });
      return quota ? quota[feature] : false;
    } catch { return false; }
  }

  if (isStaffPath) {
    const enabled = await checkFeature("canUseStaffManagement");
    if (!enabled) return NextResponse.json({ error: "Staff Management is disabled" }, { status: 403 });
  }

  if (isInventoryPath) {
    const enabled = await checkFeature("canUseInventory");
    if (!enabled) return NextResponse.json({ error: "Inventory is disabled" }, { status: 403 });
  }

  if (isApi) return NextResponse.next();

  const role = token.role as string;
  const targetDashboard = roleRoutes[role];
  if (!targetDashboard) return NextResponse.next();

  const isOnCorrectDashboard = path.startsWith(targetDashboard);
  if (isOnCorrectDashboard) return NextResponse.next();

  const allowedPrefixes: Record<string, string[]> = {
    superadmin: ["/superadmin", "/admin"],
    admin: ["/admin", "/manager", "/employee"],
    manager: ["/manager", "/employee"],
    employee: ["/employee"],
    client: ["/client"],
  };

  const allowed = allowedPrefixes[role] || [];
  const isAllowed = allowed.some((p) => path.startsWith(p));

  if (!isAllowed) {
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
