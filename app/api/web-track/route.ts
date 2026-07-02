import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { wsId, page, referrer, visitorId } = body;

  try {
    const { initDb } = await import("@/lib/db");
    const db = await initDb();

    await db.Activity.insert({
      workspaceId: Number(wsId) || 1,
      type: "web-visit",
      subject: `Page visit: ${page || "/"}`,
      body: JSON.stringify({ page, referrer, visitorId, timestamp: new Date().toISOString() }),
      userId: 0,
    });
  } catch {}

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wsId = searchParams.get("wsId");
  if (!wsId) return NextResponse.json({ error: "wsId required" }, { status: 400 });

  return new NextResponse(
    `(function() {
      if (window.__orynTracked) return;
      window.__orynTracked = true;
      var ws = "${wsId}";
      var vid = "v_" + Math.random().toString(36).slice(2, 10);
      if (localStorage) {
        var stored = localStorage.getItem("oryn_visitor");
        if (stored) vid = stored;
        else localStorage.setItem("oryn_visitor", vid);
      }
      var data = { wsId: ws, page: window.location.pathname, referrer: document.referrer, visitorId: vid };
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/web-track", JSON.stringify(data));
      } else {
        fetch("/api/web-track", { method: "POST", body: JSON.stringify(data), keepalive: true });
      }
    })();`,
    {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
