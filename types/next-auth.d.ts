import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      workspaceId: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    workspaceId: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    workspaceId: number;
  }
}
