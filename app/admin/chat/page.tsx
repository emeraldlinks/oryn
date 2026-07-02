"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MessageSquare, Send, User, Clock, CheckCheck, Settings,
  Palette, Code, Plus, X, Search, Loader2, BookOpen,
  Copy, Check, ChevronDown, ExternalLink, Eye,
} from "lucide-react";

interface VisitorChat {
  visitorId: string;
  visitorName: string;
  visitorEmail: string | null;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

interface ChatMsg {
  id: number;
  body: string;
  sender: string;
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  createdAt: string;
}

interface CannedResponse {
  id: number;
  title: string;
  bodyHtml: string;
  shortcuts?: string[];
  category?: string;
}

export default function ChatAdminPage() {
  const [activeTab, setActiveTab] = useState("conversations");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Conversations
  const [chats, setChats] = useState<VisitorChat[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [selectedChat, setSelectedChat] = useState<VisitorChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [searchChat, setSearchChat] = useState("");

  // Settings
  const [settings, setSettings] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState({
    enabled: true, primaryColor: "#6366f1", welcomeMessage: "",
    awayMessage: "", collectEmail: false, showAgentNames: true,
    enableBots: false, position: "right", allowedDomains: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Canned Responses
  const [canned, setCanned] = useState<CannedResponse[]>([]);
  const [showCannedForm, setShowCannedForm] = useState(false);
  const [cannedForm, setCannedForm] = useState({ title: "", bodyHtml: "", category: "", shortcuts: "" });
  const [cannedSearch, setCannedSearch] = useState("");
  const [showCannedPicker, setShowCannedPicker] = useState(false);

  // Embed Code
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    loadChats();
    loadSettings();
    loadCanned();
  }, []);

  useEffect(() => {
    if (selectedChat && activeTab === "conversations") loadMessages(selectedChat.visitorId);
  }, [selectedChat, activeTab]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadChats() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat");
      if (res.ok) setChats(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function loadMessages(visitorId: string) {
    try {
      const res = await fetch(`/api/chat?visitorId=${visitorId}`);
      if (res.ok) setMessages(await res.json());
    } catch {}
  }

  async function sendReply() {
    if (!reply.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedChat.visitorId,
          body: reply,
          sender: "agent",
        }),
      });
      if (res.ok) {
        setReply("");
        await loadMessages(selectedChat.visitorId);
        await loadChats();
      }
    } catch {} finally { setSending(false); }
  }

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/widget/embed/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSettingsForm({
          enabled: data.enabled ?? true,
          primaryColor: data.primaryColor || "#6366f1",
          welcomeMessage: data.welcomeMessage || "",
          awayMessage: data.awayMessage || "",
          collectEmail: data.collectEmail ?? false,
          showAgentNames: data.showAgentNames ?? true,
          enableBots: data.enableBots ?? false,
          position: data.position || "right",
          allowedDomains: (data.allowedDomains || []).join(", "),
        });
      }
    } catch {}
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/widget/embed/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settingsForm,
          allowedDomains: settingsForm.allowedDomains ? settingsForm.allowedDomains.split(",").map((d: string) => d.trim()) : [],
        }),
      });
      if (res.ok) {
        toast.success("Settings saved");
        await loadSettings();
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally { setSavingSettings(false); }
  }

  async function loadCanned() {
    try {
      const res = await fetch("/api/admin/canned-responses");
      if (res.ok) setCanned(await res.json());
    } catch {}
  }

  async function saveCanned(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/canned-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cannedForm.title,
          bodyHtml: cannedForm.bodyHtml,
          category: cannedForm.category,
          shortcuts: cannedForm.shortcuts ? cannedForm.shortcuts.split(",").map((s: string) => s.trim()) : [],
        }),
      });
      if (res.ok) {
        setShowCannedForm(false);
        setCannedForm({ title: "", bodyHtml: "", category: "", shortcuts: "" });
        await loadCanned();
        toast.success("Canned response created");
      }
    } catch {}
  }

  async function deleteCanned(id: number) {
    try {
      await fetch(`/api/admin/canned-responses?id=${id}`, { method: "DELETE" });
      await loadCanned();
      toast.success("Canned response deleted");
    } catch {}
  }

  function insertCanned(body: string) {
    setReply((prev) => prev + body);
    setShowCannedPicker(false);
  }

  function copyEmbedCode() {
    const wsId = settings?.workspaceId || "YOUR_WORKSPACE_ID";
    const code = `<script src="${window.location.origin}/api/widget/embed?format=js&workspaceId=${wsId}"></script>`;
    navigator.clipboard.writeText(code);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
    toast.success("Embed code copied!");
  }

  const filteredChats = chats.filter((c) =>
    !searchChat || c.visitorName.toLowerCase().includes(searchChat.toLowerCase()) || (c.visitorEmail || "").toLowerCase().includes(searchChat.toLowerCase())
  );

  const filteredCanned = canned.filter((c) =>
    !cannedSearch || c.title.toLowerCase().includes(cannedSearch.toLowerCase()) || c.bodyHtml.toLowerCase().includes(cannedSearch.toLowerCase())
  );

  const tabs = [
    { id: "conversations", label: "Conversations", icon: MessageSquare },
    { id: "settings", label: "Widget Settings", icon: Palette },
    { id: "canned", label: "Canned Responses", icon: BookOpen },
    { id: "embed", label: "Embed Code", icon: Code },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">Widget settings, conversations, and quick replies</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "conversations" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">
            <div className="lg:col-span-1 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium">Conversations</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search visitors..." className="pl-9 h-9 text-sm" value={searchChat} onChange={(e) => setSearchChat(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">No conversations yet</div>
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.visitorId}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left p-3 border-b hover:bg-muted/30 transition-colors ${
                        selectedChat?.visitorId === chat.visitorId ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{chat.visitorName}</p>
                        <div className="flex items-center gap-2">
                          {chat.unread > 0 && <Badge className="text-xs h-5 min-w-5 px-1.5">{chat.unread}</Badge>}
                          <span className="text-xs text-muted-foreground">
                            {chat.lastTime ? new Date(chat.lastTime).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage || "No messages"}</p>
                      {chat.visitorEmail && <p className="text-xs text-muted-foreground mt-0.5">{chat.visitorEmail}</p>}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 border rounded-lg flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedChat.visitorName}</p>
                        <p className="text-xs text-muted-foreground">{selectedChat.visitorEmail || "No email"}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadChats}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Refresh
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                          msg.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          <p className="text-sm">{msg.body}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === "agent" ? "justify-end" : ""}`}>
                            <Clock className="h-3 w-3" />
                            <span className="text-xs opacity-70">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {msg.sender === "agent" && <CheckCheck className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  <div className="p-3 border-t space-y-2">
                    <div className="relative">
                      {showCannedPicker && (
                        <div className="absolute bottom-full mb-2 left-0 w-full bg-card border rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                          <p className="text-xs font-medium text-muted-foreground px-3 py-2 border-b">Quick Replies</p>
                          {canned.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-3">No canned responses. Add some in the Canned Responses tab.</p>
                          ) : (
                            canned.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => insertCanned(c.bodyHtml)}
                                className="w-full text-left px-3 py-2 hover:bg-muted/50 border-b last:border-0 text-sm"
                              >
                                <span className="font-medium">{c.title}</span>
                                {c.category && <Badge variant="outline" className="ml-2 text-xs">{c.category}</Badge>}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setShowCannedPicker(!showCannedPicker)} title="Quick replies">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type your reply... (Tab for quick reply)"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }
                            if (e.key === "Tab") { e.preventDefault(); setShowCannedPicker(!showCannedPicker); }
                          }}
                        />
                        <Button onClick={sendReply} disabled={!reply.trim() || sending}>
                          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <form onSubmit={saveSettings} className="max-w-2xl space-y-6">
            <BentoGrid>
              <StatCard title="Active Chats" value={chats.length} icon={MessageSquare} />
              <StatCard title="Widget Status" value={settings?.enabled ? "Live" : "Off"} icon={settings?.enabled ? Palette : X} />
              <StatCard title="Canned Responses" value={canned.length} icon={BookOpen} />
            </BentoGrid>

            <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
              <h3 className="font-semibold">Widget Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enabled</label>
                  <button type="button" onClick={() => setSettingsForm({ ...settingsForm, enabled: !settingsForm.enabled })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settingsForm.enabled ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settingsForm.enabled ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={settingsForm.position} onChange={(e) => setSettingsForm({ ...settingsForm, position: e.target.value })}>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" className="h-10 w-10 rounded border cursor-pointer" value={settingsForm.primaryColor}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })} />
                    <Input value={settingsForm.primaryColor} onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Collect Email</label>
                  <button type="button" onClick={() => setSettingsForm({ ...settingsForm, collectEmail: !settingsForm.collectEmail })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settingsForm.collectEmail ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settingsForm.collectEmail ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Show Agent Names</label>
                  <button type="button" onClick={() => setSettingsForm({ ...settingsForm, showAgentNames: !settingsForm.showAgentNames })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settingsForm.showAgentNames ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settingsForm.showAgentNames ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enable Bots</label>
                  <button type="button" onClick={() => setSettingsForm({ ...settingsForm, enableBots: !settingsForm.enableBots })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settingsForm.enableBots ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settingsForm.enableBots ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Welcome Message</label>
                  <Input value={settingsForm.welcomeMessage} onChange={(e) => setSettingsForm({ ...settingsForm, welcomeMessage: e.target.value })}
                    placeholder="Hi! How can we help?" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Away Message</label>
                  <Input value={settingsForm.awayMessage} onChange={(e) => setSettingsForm({ ...settingsForm, awayMessage: e.target.value })}
                    placeholder="We're away right now but will get back to you soon!" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Allowed Domains (comma-separated)</label>
                  <Input value={settingsForm.allowedDomains} onChange={(e) => setSettingsForm({ ...settingsForm, allowedDomains: e.target.value })}
                    placeholder="example.com, myapp.com" />
                  <p className="text-xs text-muted-foreground">Only allow the widget to load on these domains. Leave empty to allow all.</p>
                </div>
              </div>
              <Button type="submit" disabled={savingSettings}>
                {savingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </div>
          </form>
        )}

        {activeTab === "canned" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{canned.length} saved responses</p>
              <Button onClick={() => setShowCannedForm(!showCannedForm)}>
                <Plus className="mr-2 h-4 w-4" /> New Response
              </Button>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search responses..." className="pl-9" value={cannedSearch} onChange={(e) => setCannedSearch(e.target.value)} />
            </div>

            {showCannedForm && (
              <form onSubmit={saveCanned} className="p-4 rounded-lg border bg-muted/20 space-y-3">
                <Input placeholder="Title (e.g. Greeting)" value={cannedForm.title} onChange={(e) => setCannedForm({ ...cannedForm, title: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Response Text</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    value={cannedForm.bodyHtml} onChange={(e) => setCannedForm({ ...cannedForm, bodyHtml: e.target.value })} required />
                </div>
                <Input placeholder="Category (e.g. Sales, Support)" value={cannedForm.category} onChange={(e) => setCannedForm({ ...cannedForm, category: e.target.value })} />
                <Input placeholder="Shortcuts (comma-separated, e.g. /greet, /hello)" value={cannedForm.shortcuts} onChange={(e) => setCannedForm({ ...cannedForm, shortcuts: e.target.value })} />
                <div className="flex gap-2">
                  <Button type="submit">Save Response</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCannedForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {filteredCanned.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No canned responses yet. Create one to speed up your replies.</p>
              ) : (
                filteredCanned.map((c) => (
                  <div key={c.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{c.title}</p>
                        {c.category && <Badge variant="outline" className="text-xs">{c.category}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.bodyHtml}</p>
                      {c.shortcuts && c.shortcuts.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {c.shortcuts.map((s, i) => (
                            <code key={i} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</code>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 ml-2" onClick={() => deleteCanned(c.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "embed" && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
              <h3 className="font-semibold">Install Widget</h3>
              <p className="text-sm text-muted-foreground">
                Add this script to your website's <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;head&gt;</code> or just before the closing <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag.
              </p>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 text-sm overflow-x-auto">
                  <code>{`<script src="${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/widget/embed?format=js&workspaceId=${settings?.workspaceId || "YOUR_WORKSPACE_ID"}"></script>`}</code>
                </pre>
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyEmbedCode}>
                  {embedCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
              <h3 className="font-semibold">Widget Preview</h3>
              <div className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 rounded-lg relative h-64">
                <div className="absolute" style={{ bottom: 20, right: 20 }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: settingsForm.primaryColor }}>
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">The chat bubble will appear in the bottom-{settingsForm.position} corner of your website.</p>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-muted/20 space-y-3">
              <h3 className="font-semibold">Requirements</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  The widget loads asynchronously and won't affect your page speed
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  Messages appear in this dashboard in real-time
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  Visitors are identified by a unique ID stored in their browser
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  Configure the widget appearance in the Settings tab
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
