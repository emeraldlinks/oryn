import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dispatchToPluginWebhooks } from "@/lib/plugin-system/webhook-dispatcher";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { workspaceId, event, payload } = body as {
    workspaceId?: number;
    event?: string;
    payload?: Record<string, unknown>;
  };

  if (!workspaceId || !event || !payload) {
    return NextResponse.json(
      { error: "workspaceId, event, and payload are required" },
      { status: 400 }
    );
  }

  try {
    await dispatchToPluginWebhooks(workspaceId, event, payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
