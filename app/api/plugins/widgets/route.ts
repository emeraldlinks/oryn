import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAvailableWidgets } from "@/lib/plugin-system/widget-helper";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wsId = Number(session.user.workspaceId);
  const widgets = await getAvailableWidgets(wsId);
  return NextResponse.json(widgets);
}
