import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "json";
  const publicWsId = searchParams.get("workspaceId");

  if (format === "js") {
    return withDb(async (db) => {
      let wsId: number;

      if (publicWsId) {
        wsId = Number(publicWsId);
      } else {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        wsId = Number(session.user.workspaceId);
      }

      const settings = await db.WidgetSettings.get({ workspaceId: wsId });
      if (!settings) return NextResponse.json({ error: "Widget not configured" }, { status: 404 });

      const color = settings.primaryColor || "#6366f1";
      const welcomeMsg = (settings.welcomeMessage || "Hi! How can we help?").replace(/`/g, "\\`");

      const js = `(function(){
  var c = document.currentScript;
  var wsId = c ? Number(c.getAttribute("data-workspace-id") || ${wsId}) : ${wsId};
  var primaryColor = c ? (c.getAttribute("data-primary-color") || "${color}") : "${color}";
  var welcomeMessage = c ? (c.getAttribute("data-welcome-message") || "${welcomeMsg}") : "${welcomeMsg}";

  var visitorId = localStorage.getItem("oryn_visitor_id");
  if (!visitorId) {
    visitorId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(m){
      var r = Math.random() * 16 | 0;
      return (m === "x" ? r : (r & 3 | 8)).toString(16);
    });
    localStorage.setItem("oryn_visitor_id", visitorId);
  }

  var container = document.createElement("div");
  container.id = "oryn-widget-container";
  container.innerHTML =
    "<style>" +
    "#oryn-b{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:" + primaryColor + ";color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.25);z-index:999999;display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .25s,box-shadow .25s}" +
    "#oryn-b:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,0,0,0.3)}" +
    "#oryn-p{position:fixed;bottom:90px;right:20px;width:380px;max-height:600px;height:520px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.2);z-index:999998;display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:oryn-slide .3s ease}" +
    "@keyframes oryn-slide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}" +
    "#oryn-h{background:" + primaryColor + ";color:#fff;padding:16px 18px;font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}" +
    "#oryn-x{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0;line-height:1;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s}" +
    "#oryn-x:hover{background:rgba(255,255,255,0.2)}" +
    "#oryn-m{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;background:#f0f2f5}" +
    "#oryn-m::-webkit-scrollbar{width:5px}#oryn-m::-webkit-scrollbar-thumb{background:#c1c7cd;border-radius:3px}" +
    "#oryn-ag{background:#e4e8ee;color:#1a1a2e;padding:10px 14px;border-radius:14px 14px 14px 4px;max-width:80%;align-self:flex-start;font-size:14px;line-height:1.45;word-wrap:break-word}" +
    "#oryn-us{background:" + primaryColor + ";color:#fff;padding:10px 14px;border-radius:14px 14px 4px 14px;max-width:80%;align-self:flex-end;font-size:14px;line-height:1.45;word-wrap:break-word}" +
    "#oryn-i{border:none;border-top:1px solid #e2e8f0;padding:8px 12px 8px 16px;background:#fff;flex-shrink:0}" +
    "#oryn-i form{display:flex;gap:8px}" +
    "#oryn-t{flex:1;border:1px solid #d1d5db;border-radius:20px;padding:9px 14px;font-size:14px;outline:none;transition:border-color .2s}" +
    "#oryn-t:focus{border-color:" + primaryColor + "}" +
    "#oryn-s{background:" + primaryColor + ";color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s}" +
    "#oryn-s:hover{opacity:.85}" +
    "@media(max-width:480px){#oryn-p{right:0;bottom:0;width:100%;height:100%;max-height:none;border-radius:0}#oryn-b{bottom:12px;right:12px}}" +
    "</style>" +
    "<button id=\"oryn-b\" aria-label=\"Open chat\">&#x1F4AC;</button>" +
    "<div id=\"oryn-p\">" +
    "<div id=\"oryn-h\"><span>Chat</span><button id=\"oryn-x\" aria-label=\"Close\">&times;</button></div>" +
    "<div id=\"oryn-m\"></div>" +
    "<div id=\"oryn-i\"><form><input id=\"oryn-t\" placeholder=\"Type a message...\" autocomplete=\"off\"/><button id=\"oryn-s\" type=\"submit\">&#x27A4;</button></form></div>" +
    "</div>";

  document.body.appendChild(container);

  var msgEl = document.getElementById("oryn-m");
  var input = document.getElementById("oryn-t");
  var open = false;
  var lastTs = 0;

  function addMsg(text, isUser) {
    var d = document.createElement("div");
    d.id = isUser ? "oryn-us" : "oryn-ag";
    d.textContent = text;
    msgEl.appendChild(d);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function send(){
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMsg(text, true);
    fetch(window.location.origin + "/api/chat/widget", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({workspaceId:wsId,visitorId:visitorId,body:text})
    }).catch(function(){});
    setTimeout(poll, 500);
  }

  function poll(){
    var url = window.location.origin + "/api/chat/widget?workspaceId=" + wsId + "&visitorId=" + visitorId;
    if (lastTs) url += "&since=" + lastTs;
    fetch(url).then(function(r){return r.json()}).then(function(data){
      var msgs = data.messages || data;
      if (msgs.length) msgs.forEach(function(m){
        if (m.sender !== "visitor") addMsg(m.body, false);
        var t = new Date(m.createdAt).getTime();
        if (t > lastTs) lastTs = t;
      });
    }).catch(function(){});
  }

  document.getElementById("oryn-b").onclick = function(){
    open = !open;
    document.getElementById("oryn-p").style.display = open ? "flex" : "none";
    if (open) poll();
  };

  document.getElementById("oryn-x").onclick = function(){
    open = false;
    document.getElementById("oryn-p").style.display = "none";
  };

  document.querySelector("#oryn-i form").onsubmit = function(e){
    e.preventDefault();
    send();
  };

  if (welcomeMessage) addMsg(welcomeMessage, false);
  setInterval(poll, 3000);
})();`;

      return new NextResponse(js, {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
        },
      });
    });
  }

  return withDb(async (db) => {
    const wsId = publicWsId ? Number(publicWsId) : null;
    let settings;

    if (wsId) {
      settings = await db.WidgetSettings.get({ workspaceId: wsId });
      if (!settings) return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      settings = await db.WidgetSettings.get({ workspaceId: Number(session.user.workspaceId) });
      if (!settings) return NextResponse.json({ error: "Widget not configured" }, { status: 404 });
    }

    return NextResponse.json({
      enabled: settings.enabled,
      primaryColor: settings.primaryColor,
      welcomeMessage: settings.welcomeMessage,
      collectEmail: settings.collectEmail,
      position: settings.position,
      workspaceId: settings.workspaceId,
    });
  });
}
