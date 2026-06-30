"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bot, Plus, Trash2, Key, Copy, ExternalLink, RefreshCw, Check, X,
  Shield, Eye, EyeOff, Loader2, Terminal,
} from "lucide-react";

interface BotConnection {
  id: number;
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
  status: "active" | "suspended" | "revoked";
  allowedActions: string[];
  totalRequests: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CreateResponse {
  id: number;
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  status: string;
}

const ALL_ACTIONS = [
  "create_contact", "list_contacts", "create_deal", "update_deal_stage", "list_deals",
  "create_activity", "create_ticket", "list_tickets", "send_email", "create_notification",
  "get_forecast", "create_project", "list_projects",
];

const PROVIDERS = ["Claude Connector", "Perplexity", "OpenAI Assistant", "Make.com", "Zapier", "Custom"];

const providerColors: Record<string, string> = {
  "Claude Connector": "bg-violet-500",
  Perplexity: "bg-cyan-500",
  "OpenAI Assistant": "bg-emerald-500",
  "Make.com": "bg-blue-500",
  Zapier: "bg-orange-500",
  Custom: "bg-muted-foreground",
};

const statusVariants: Record<string, "success" | "secondary" | "destructive" | "warning"> = {
  active: "success",
  suspended: "warning",
  revoked: "destructive",
};

function formatDate(d: string | null) {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function maskKey(key: string) {
  if (key.length <= 12) return key;
  return `oryn_...${key.slice(-6)}`;
}

export default function BotConnectionsPage() {
  const [connections, setConnections] = useState<BotConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    provider: "Claude Connector",
    allowedActions: [] as string[],
    expiresAt: "",
  });

  const [showCreate, setShowCreate] = useState(false);
  const [createdData, setCreatedData] = useState<CreateResponse | null>(null);
  const [savedCredentials, setSavedCredentials] = useState(false);

  const [visibleSecrets, setVisibleSecrets] = useState<Record<number, boolean>>({});
  const [rotateId, setRotateId] = useState<number | null>(null);
  const [testId, setTestId] = useState<number | null>(null);

  useEffect(() => { loadConnections(); }, []);

  async function loadConnections() {
    setLoading(true);
    try {
      const res = await fetch("/api/bot-connections");
      if (res.ok) setConnections(await res.json());
    } catch {} finally { setLoading(false); }
  }

  function toggleAction(action: string) {
    setForm((prev) => ({
      ...prev,
      allowedActions: prev.allowedActions.includes(action)
        ? prev.allowedActions.filter((a) => a !== action)
        : [...prev.allowedActions, action],
    }));
  }

  async function createConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/bot-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          provider: form.provider,
          allowedActions: form.allowedActions,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create connection");
        return;
      }
      const data: CreateResponse = await res.json();
      setCreatedData(data);
      setSavedCredentials(false);
      setShowCreate(false);
      setForm({ name: "", provider: "Claude Connector", allowedActions: [], expiresAt: "" });
      toast.success("Connection created");
      loadConnections();
    } catch { toast.error("Failed to create connection"); }
    finally { setSaving(false); }
  }

  async function deleteConnection(id: number) {
    if (!confirm("Delete this connection? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/bot-connections?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Connection deleted");
        loadConnections();
      } else toast.error("Failed to delete");
    } catch {}
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch("/api/bot-connections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success(`Connection ${status === "active" ? "activated" : "suspended"}`);
        loadConnections();
      } else toast.error("Failed to update");
    } catch {}
  }

  async function rotateKey(id: number) {
    setRotateId(id);
    try {
      const res = await fetch("/api/bot-connections/rotate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Key rotated successfully");
        loadConnections();
      } else toast.error("Failed to rotate key");
    } catch {} finally { setRotateId(null); }
  }

  async function testConnection(id: number) {
    setTestId(id);
    try {
      const res = await fetch("/api/bot-actions");
      if (res.ok) toast.success("Connection test successful — endpoint is reachable");
      else toast.error("Test failed — endpoint returned an error");
    } catch { toast.error("Test failed — could not reach endpoint"); }
    finally { setTestId(null); }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bot Connections</h1>
            <p className="text-muted-foreground">
              Connect external AI bots (Claude connectors, Perplexity, Make.com, Zapier) to perform tasks on your behalf.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Connection
          </Button>
        </div>

        {showCreate && (
          <BentoCard>
            <form onSubmit={createConnection} className="space-y-4">
              <h3 className="text-lg font-semibold">New Connection</h3>

              <div>
                <label className="text-sm font-medium mb-1 block">Connection Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My Claude Connector"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Provider</label>
                <select
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Allowed Actions</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                  {ALL_ACTIONS.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => toggleAction(action)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.allowedActions.includes(action)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Expires At <span className="text-muted-foreground">(optional)</span></label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setForm({ name: "", provider: "Claude Connector", allowedActions: [], expiresAt: "" }); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Key className="mr-2 h-4 w-4" /> Create Connection
                </Button>
              </div>
            </form>
          </BentoCard>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : connections.length === 0 ? (
          <BentoCard>
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No bot connections yet</p>
              <p className="text-sm">
                Create a connection to let external AI assistants interact with your CRM, projects, and more.
              </p>
              <Button className="mt-4" size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create your first connection
              </Button>
            </div>
          </BentoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <BentoCard key={conn.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-10 w-10 rounded-lg ${providerColors[conn.provider] || "bg-muted"} flex items-center justify-center shrink-0`}>
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{conn.name}</p>
                        <Badge variant="secondary" className="text-xs mt-1">{conn.provider}</Badge>
                      </div>
                    </div>
                    <Badge variant={statusVariants[conn.status] || "secondary"} className="capitalize shrink-0">
                      {conn.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5" /> API Key
                      </span>
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{maskKey(conn.apiKey)}</code>
                        <button
                          onClick={() => { navigator.clipboard.writeText(conn.apiKey); toast.success("API key copied"); }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" /> API Secret
                      </span>
                      <div className="flex items-center gap-1">
                        {visibleSecrets[conn.id] ? (
                          <>
                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono max-w-[140px] truncate">
                              {conn.apiSecret}
                            </code>
                            <button
                              onClick={() => navigator.clipboard.writeText(conn.apiSecret)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setVisibleSecrets((prev) => ({ ...prev, [conn.id]: false }))}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <EyeOff className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => setVisibleSecrets((prev) => ({ ...prev, [conn.id]: true }))}
                          >
                            <Eye className="h-3.5 w-3.5" /> Show
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" /> Webhook
                      </span>
                      <div className="flex items-center gap-1 min-w-0">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[160px]">
                          {baseUrl}/api/bot-actions
                        </code>
                        <button
                          onClick={() => { navigator.clipboard.writeText(`${baseUrl}/api/bot-actions`); toast.success("Webhook URL copied"); }}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {conn.allowedActions.map((action) => (
                      <span key={action} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {action}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{conn.totalRequests || 0} requests</span>
                    <span>Last used: {formatDate(conn.lastUsedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => testConnection(conn.id)}
                        disabled={testId === conn.id}
                      >
                        {testId === conn.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Terminal className="h-3.5 w-3.5" />
                        )}
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => rotateKey(conn.id)}
                        disabled={rotateId === conn.id}
                      >
                        {rotateId === conn.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Rotate
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {conn.status === "active" ? (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => updateStatus(conn.id, "suspended")}>
                          <X className="h-3.5 w-3.5 mr-1" /> Suspend
                        </Button>
                      ) : conn.status === "suspended" ? (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => updateStatus(conn.id, "active")}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Activate
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive" onClick={() => deleteConnection(conn.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        )}

        {createdData && !savedCredentials && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-100" />
                </div>
                <h2 className="text-xl font-bold">Connection Created!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Save these credentials — the secret will not be shown again.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded flex-1 truncate">
                      {createdData.apiKey}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(createdData.apiKey); toast.success("API key copied"); }}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">API Secret</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded flex-1 truncate">
                      {createdData.apiSecret}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(createdData.apiSecret); toast.success("API secret copied"); }}
                      className="text-amber-600 hover:text-amber-800 shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    This is the only time you will see the secret. Store it securely.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Webhook URL</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded flex-1 truncate">
                      {createdData.webhookUrl || `${baseUrl}/api/bot-actions`}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(createdData.webhookUrl || `${baseUrl}/api/bot-actions`); toast.success("Webhook URL copied"); }}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setSavedCredentials(true)}>
                <Check className="mr-2 h-4 w-4" /> I&apos;ve saved these credentials
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
