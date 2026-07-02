import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await db.User.get({ email: credentials.email });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          workspaceId: user.workspaceId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
  if (user) {
    token.id = user.id;
    token.role = (user as any).role;
    token.workspaceId = (user as any).workspaceId;
  }

  const wsId = token.workspaceId as number | undefined;

  if (wsId && token.canUseStaffManagement === undefined) {
    try {
      const quota = await db.WorkspaceQuota.get({ workspaceId: wsId });
      if (quota) {
        token.canUseStaffManagement = quota.canUseStaffManagement;
        token.canUseInventory = quota.canUseInventory;
      } else {
        token.canUseStaffManagement = false;
        token.canUseInventory = false;
      }
    } catch {
      token.canUseStaffManagement = false;
      token.canUseInventory = false;
    }
  }

  if (account?.provider === "google" || account?.provider === "facebook") {
    const existing = await db.User.get({ email: token.email! });

    let finalUser: typeof existing;

    if (!existing) {
      const workspace = await db.Workspace.insert({
        name: (token.name || "My Workspace") as string,
        slug: (token.name || "my-workspace").toLowerCase().replace(/\s+/g, "-"),
        plan: "starter",
        active: true,
      } as any);

      finalUser = await db.User.insert({
        workspaceId: workspace?.id,
        name: token.name || "User",
        email: token.email || "",
        role: "superadmin",
        lastLoginAt: new Date().toISOString(),
      } as any);
    } else {
      await db.User.update({ id: existing.id }, {
        lastLoginAt: new Date().toISOString(),
      });
      finalUser = existing;
    }

    token.id = String(finalUser?.id);
    token.role = finalUser?.role!;
    token.workspaceId = finalUser?.workspaceId!;
  }

  return token;
},
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).workspaceId = token.workspaceId;
        (session.user as any).canUseStaffManagement = token.canUseStaffManagement;
        (session.user as any).canUseInventory = token.canUseInventory;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
