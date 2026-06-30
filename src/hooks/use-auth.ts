import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    role: session?.user?.role as string | undefined,
    workspaceId: session?.user?.workspaceId as number | undefined,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}

export function useRequiredAuth() {
  const auth = useAuth();

  if (auth.isLoading) {
    throw new Promise(() => {});
  }

  if (!auth.isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return auth;
}
