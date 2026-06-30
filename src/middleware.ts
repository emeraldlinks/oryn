import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
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

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) return NextResponse.next();

    const isPublic = publicPaths.some((p) => path.startsWith(p));
    if (isPublic) return NextResponse.next();

    const isApi = path.startsWith("/api/");
    if (isApi) return NextResponse.next();

    const targetDashboard = roleRoutes[token.role as string];
    if (!targetDashboard) return NextResponse.next();

    const isOnCorrectDashboard = path.startsWith(targetDashboard);
    if (isOnCorrectDashboard) return NextResponse.next();

    const allowedPrefixes: Record<string, string[]> = {
      superadmin: ["/superadmin"],
      admin: ["/admin", "/manager", "/employee"],
      manager: ["/manager", "/employee"],
      employee: ["/employee"],
      client: ["/client"],
    };

    const allowed = allowedPrefixes[token.role as string] || [];
    const isAllowed = allowed.some((p) => path.startsWith(p));

    if (!isAllowed) {
      return NextResponse.redirect(new URL(targetDashboard, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const path = req.nextUrl.pathname;
        if (publicPaths.some((p) => path.startsWith(p))) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
