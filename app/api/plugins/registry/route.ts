import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadWorkspacePlugins, getPlugins } from "@/lib/plugin-system";
import type { PluginInstance } from "@/lib/plugin-system";

function serializePluginInstance(instance: PluginInstance): Record<string, unknown> {
  return JSON.parse(JSON.stringify(instance, (key, value) => {
    if (key.endsWith("At") && typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString();
    return value;
  }));
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);

  await loadWorkspacePlugins(wsId);
  const plugins = getPlugins(wsId);
  const serialized = plugins.map(serializePluginInstance);

  return NextResponse.json(serialized);
}
