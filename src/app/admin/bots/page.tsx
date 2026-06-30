"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bot, MessageSquare, Mail, Slack, MessageCircle, Plus, Trash2, Play, Loader2,
  Pencil,
} from "lucide-react";

interface BotData {
  id: number;
  name: string;
  channel: string;
  triggerKeywords: string;
  responseTemplate: string;
  aiModel: string;
  active: boolean;
  totalConversations: number;
}

const channelIcons: Record<string, typeof MessageSquare> = {
  Chat: MessageSquare,
  Email: Mail,
  Social: MessageCircle,
  Slack: Slack,
  WhatsApp: MessageCircle,
};

const channelColors: Record<string, string> = {
  Chat: "bg-blue-500",
  Email: "bg-red-500",
  Social: "bg-purple-500",
  Slack: "bg-green-500",
  WhatsApp: "bg-emerald-500",
};

const aiModels = ["Keyword", "OpenAI", "Gemini", "DeepSeek", "Claude", "Qwen", "Kimi"];

export default function BotsPage() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);
  const [form, setForm] = useState({
    name: "", channel: "Chat", triggerKeywords: "", responseTemplate: "", aiModel: "Keyword", active: true,
  });
  const [saving, setSaving] = useState(false);
  const [testBotId, setTestBotId] = useState<number | null>(null);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => { loadBots(); }, []);

  async function loadBots() {
    setLoading(true);
    try {
      const res = await fetch("/api/bots");
      if (res.ok) setBots(await res.json());
    } catch {} finally { setLoading(false); }
  }

  function resetForm() {
    setForm({ name: "", channel: "Chat", triggerKeywords: "", responseTemplate: "", aiModel: "Keyword", active: true });
    setEditingBot(null);
  }

  async function saveBot(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingBot ? `/api/bots` : `/api/bots`;
      const method = editingBot ? "PUT" : "POST";
      const body = editingBot ? { id: editingBot.id, ...form } : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editingBot ? "Bot updated" : "Bot created");
        setShowModal(false);
        resetForm();
        loadBots();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save bot");
      }
    } catch {} finally { setSaving(false); }
  }

  async function deleteBot(id: number) {
    if (!confirm("Delete this bot?")) return;
    try {
      const res = await fetch(`/api/bots?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Bot deleted");
        loadBots();
      }
    } catch {}
  }

  async function runTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testBotId) return;
    setTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch("/api/bots?test=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMessage, botId: testBotId }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestResponse(data.response);
      } else {
        const bot = bots.find((b) => b.id === testBotId);
        if (bot) {
          const keywords = bot.triggerKeywords.split(",").map((k: string) => k.trim().toLowerCase());
          const matches = keywords.filter((k: string) => testMessage.toLowerCase().includes(k));
          if (matches.length > 0) {
            setTestResponse(bot.responseTemplate);
          } else {
            setTestResponse("No keywords matched in your message.");
          }
        }
      }
    } catch {} finally { setTesting(false); }
  }

  function openEdit(bot: BotData) {
    setForm({
      name: bot.name, channel: bot.channel, triggerKeywords: bot.triggerKeywords,
      responseTemplate: bot.responseTemplate, aiModel: bot.aiModel, active: bot.active,
    });
    setEditingBot(bot);
    setShowModal(true);
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bot Automation</h1>
            <p className="text-muted-foreground">Manage your AI-powered chat bots</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Create Bot
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : bots.length === 0 ? (
          <BentoCard>
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No bots yet</p>
              <p className="text-sm">Create your first automation bot to get started.</p>
            </div>
          </BentoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bots.map((bot) => {
              const ChIcon = channelIcons[bot.channel] || Bot;
              const chColor = channelColors[bot.channel] || "bg-muted";
              return (
                <BentoCard key={bot.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${chColor} flex items-center justify-center`}>
                          <ChIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{bot.name}</p>
                          <div className="flex gap-1.5 mt-1">
                            <Badge variant="secondary" className="text-xs">{bot.channel}</Badge>
                            <Badge variant="outline" className="text-xs">{bot.aiModel}</Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant={bot.active ? "success" : "secondary"}>{bot.active ? "Active" : "Inactive"}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {bot.triggerKeywords.split(",").map((kw, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{bot.responseTemplate}</p>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">{bot.totalConversations || 0} conversations</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(bot)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteBot(bot.id)}><Trash2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setTestBotId(bot.id); setTestMessage(""); setTestResponse(null); }}><Play className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-background rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold">{editingBot ? "Edit Bot" : "Create Bot"}</h2>
              <form onSubmit={saveBot} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Bot Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sales Assistant" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Channel</label>
                    <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                      {Object.keys(channelIcons).map((ch) => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">AI Model</label>
                    <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.aiModel} onChange={(e) => setForm({ ...form, aiModel: e.target.value })}>
                      {aiModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Trigger Keywords <span className="text-muted-foreground">(comma separated)</span></label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]" value={form.triggerKeywords} onChange={(e) => setForm({ ...form, triggerKeywords: e.target.value })} placeholder="help, support, pricing" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Response Template</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={form.responseTemplate} onChange={(e) => setForm({ ...form, responseTemplate: e.target.value })} placeholder="Hi! I can help you with..." required />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingBot ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {testBotId && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setTestBotId(null)}>
            <div className="bg-background rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold">Test Bot</h2>
              <form onSubmit={runTest} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Simulate a message</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={testMessage} onChange={(e) => setTestMessage(e.target.value)} placeholder="Type a message to test..." required />
                </div>
                <Button type="submit" disabled={testing}>
                  {testing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...</> : <><Play className="mr-2 h-4 w-4" /> Run Test</>}
                </Button>
              </form>
              {testResponse !== null && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Bot Response:</p>
                  <p className="text-sm">{testResponse}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setTestBotId(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
