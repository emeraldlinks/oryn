"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Webhook, Key, FileJson, Plus, X, Loader2, ToggleLeft, ToggleRight,
  Copy, Check, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface WebhookEndpoint {
  id: number;
  name: string;
  url: string;
  events: string;
  active: boolean;
  successCount: number;
  failureCount: number;
  headers?: string;
}

interface OAuthApp {
  id: number;
  name: string;
  clientId: string;
  clientSecret?: string;
  redirectUris: string;
  scopes: string;
  active: boolean;
}

interface ApiLog {
  id: number;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string;
  user?: { name: string };
  timestamp: string;
}

const events = ["user.created", "user.updated", "user.deleted", "deal.created", "deal.updated", "deal.deleted", "invoice.paid", "ticket.created", "ticket.updated"];

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState("webhooks");
  const [submitting, setSubmitting] = useState(false);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [webhookForm, setWebhookForm] = useState({ name: "", url: "", events: [] as string[], headers: "{}" });
  const [showNewWebhook, setShowNewWebhook] = useState(false);

  const [oauthApps, setOauthApps] = useState<OAuthApp[]>([]);
  const [oauthForm, setOauthForm] = useState({ name: "", redirectUris: "", scopes: "" });
  const [showNewOauth, setShowNewOauth] = useState(false);
  const [createdApp, setCreatedApp] = useState<OAuthApp | null>(null);

  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [logPage, setLogPage] = useState(1);
  const [logTotal, setLogTotal] = useState(0);
  const [logFilter, setLogFilter] = useState({ method: "", status: "" });
  const perPage = 20;

  useEffect(() => {
    loadWebhooks();
    loadOAuth();
    loadLogs();
  }, [logPage, logFilter]);

  async function loadWebhooks() { try { const r = await fetch("/api/developer/webhooks"); if (r.ok) setWebhooks(await r.json()); } catch {} }
  async function loadOAuth() { try { const r = await fetch("/api/developer/oauth"); if (r.ok) setOauthApps(await r.json()); } catch {} }

  async function loadLogs() {
    try {
      const params = new URLSearchParams({ page: String(logPage), perPage: String(perPage) });
      if (logFilter.method) params.set("method", logFilter.method);
      if (logFilter.status) params.set("status", logFilter.status);
      const r = await fetch(`/api/developer/api-logs?${params}`);
      if (r.ok) {
        const data = await r.json();
        setApiLogs(data.logs || data);
        setLogTotal(data.total || data.length || 0);
      }
    } catch {}
  }

  async function createWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/developer/webhooks", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(webhookForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewWebhook(false);
      setWebhookForm({ name: "", url: "", events: [], headers: "{}" });
      await loadWebhooks();
      toast.success("Webhook created");
    }
  }

  async function toggleWebhook(w: WebhookEndpoint) {
    await fetch(`/api/developer/webhooks?id=${w.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...w, active: !w.active }),
    });
    await loadWebhooks();
    toast.success(w.active ? "Webhook deactivated" : "Webhook activated");
  }

  async function testWebhook(id: number) {
    toast.loading("Testing webhook...");
    try {
      const r = await fetch(`/api/developer/webhooks?id=${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "test" }) });
      if (r.ok) toast.success("Test sent successfully");
      else toast.error("Test failed");
    } catch { toast.error("Test request failed"); }
  }

  function toggleWebhookEvent(event: string) {
    setWebhookForm((prev) => ({
      ...prev,
      events: prev.events.includes(event) ? prev.events.filter((e) => e !== event) : [...prev.events, event],
    }));
  }

  async function createOauth(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/developer/oauth", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...oauthForm,
        redirectUris: oauthForm.redirectUris.split("\n").map((s) => s.trim()).filter(Boolean),
        scopes: oauthForm.scopes.split(",").map((s) => s.trim()),
      }),
    });
    setSubmitting(false);
    if (r.ok) {
      const app = await r.json();
      setCreatedApp(app);
      setShowNewOauth(false);
      setOauthForm({ name: "", redirectUris: "", scopes: "" });
      await loadOAuth();
      toast.success("OAuth app created");
    }
  }

  async function rotateSecret(id: number) {
    const r = await fetch(`/api/developer/oauth?id=${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "rotate-secret" }),
    });
    if (r.ok) {
      const data = await r.json();
      setCreatedApp(data);
      toast.success("Secret rotated");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  }

  const tabs = [
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "oauth", label: "OAuth Apps", icon: Key },
    { id: "api-logs", label: "API Logs", icon: FileJson },
  ];

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Developer</h1>
          <p className="text-muted-foreground">Webhooks, OAuth apps, and API logs</p>
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

        {activeTab === "webhooks" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewWebhook(true)}><Plus className="mr-2 h-4 w-4" /> New Webhook</Button>
            </div>
            {webhooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No webhooks yet.</p>
            ) : (
              <div className="space-y-3">
                {webhooks.map((w) => {
                  const evts = typeof w.events === "string" ? w.events.split(",") : w.events;
                  return (
                    <BentoCard key={w.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{w.name}</h4>
                            {w.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{w.url}</p>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {(Array.isArray(evts) ? evts : []).map((e: string) => (
                              <Badge key={e} variant="outline" className="text-xs">{e.trim()}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-green-600">{w.successCount} success</span>
                            {w.failureCount > 0 && <span className="text-red-600 ml-2">{w.failureCount} failures</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => testWebhook(w.id)}>Test</Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleWebhook(w)}>
                            {w.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                          </Button>
                        </div>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>
            )}
            <Modal open={showNewWebhook} onClose={() => setShowNewWebhook(false)} title="New Webhook">
              <form onSubmit={createWebhook} className="space-y-3">
                <Input placeholder="Webhook Name" value={webhookForm.name} onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })} required />
                <Input placeholder="Endpoint URL" value={webhookForm.url} onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Events</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {events.map((event) => (
                      <label key={event} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={webhookForm.events.includes(event)} onChange={() => toggleWebhookEvent(event)} />
                        {event}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Headers JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px] font-mono" value={webhookForm.headers} onChange={(e) => setWebhookForm({ ...webhookForm, headers: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Webhook
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "oauth" && (
          <div className="space-y-4">
            {createdApp && (
              <BentoCard className="border-green-200 bg-green-50">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">App Created — One-Time Credentials</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-green-100 px-2 py-1 rounded">Client ID: {createdApp.clientId}</code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(createdApp.clientId)}><Copy className="h-3 w-3" /></Button>
                  </div>
                  {createdApp.clientSecret && (
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-green-100 px-2 py-1 rounded">Client Secret: {createdApp.clientSecret}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(createdApp.clientSecret!)}><Copy className="h-3 w-3" /></Button>
                    </div>
                  )}
                  <p className="text-xs text-green-600">Save these — secret won't be shown again.</p>
                </div>
              </BentoCard>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setShowNewOauth(true)}><Plus className="mr-2 h-4 w-4" /> New OAuth App</Button>
            </div>
            {oauthApps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No OAuth apps yet.</p>
            ) : (
              <div className="space-y-3">
                {oauthApps.map((a) => {
                  const uris = typeof a.redirectUris === "string" ? a.redirectUris.split(",") : a.redirectUris;
                  const scopes = typeof a.scopes === "string" ? a.scopes.split(",") : a.scopes;
                  return (
                    <BentoCard key={a.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{a.name}</h4>
                            {a.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">Client ID: {a.clientId.slice(0, 8)}...{a.clientId.slice(-4)}</p>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {(Array.isArray(scopes) ? scopes : []).map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s.trim()}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            URIs: {(Array.isArray(uris) ? uris : []).join(", ")}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => rotateSecret(a.id)}>
                          <Key className="h-3 w-3 mr-1" /> Rotate Secret
                        </Button>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>
            )}
            <Modal open={showNewOauth} onClose={() => setShowNewOauth(false)} title="New OAuth App">
              <form onSubmit={createOauth} className="space-y-3">
                <Input placeholder="App Name" value={oauthForm.name} onChange={(e) => setOauthForm({ ...oauthForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Redirect URIs (one per line)</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={oauthForm.redirectUris} onChange={(e) => setOauthForm({ ...oauthForm, redirectUris: e.target.value })} required />
                </div>
                <Input placeholder="Scopes (comma separated, e.g. read,write)" value={oauthForm.scopes} onChange={(e) => setOauthForm({ ...oauthForm, scopes: e.target.value })} required />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create OAuth App
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "api-logs" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <div>
                <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={logFilter.method} onChange={(e) => { setLogFilter({ ...logFilter, method: e.target.value }); setLogPage(1); }}>
                  <option value="">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={logFilter.status} onChange={(e) => { setLogFilter({ ...logFilter, status: e.target.value }); setLogPage(1); }}>
                  <option value="">All Status</option>
                  <option value="2xx">2xx</option>
                  <option value="4xx">4xx</option>
                  <option value="5xx">5xx</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-2 font-medium">Method</th>
                    <th className="text-left py-2 px-2 font-medium">Path</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-right py-2 px-2 font-medium">Duration</th>
                    <th className="text-left py-2 px-2 font-medium">IP</th>
                    <th className="text-left py-2 px-2 font-medium">User</th>
                    <th className="text-left py-2 pl-2 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {apiLogs.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No logs found.</td></tr>
                  ) : apiLogs.map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">
                        <Badge variant={l.method === "GET" ? "default" : l.method === "POST" ? "success" : l.method === "PUT" ? "warning" : "destructive"}>{l.method}</Badge>
                      </td>
                      <td className="py-2 px-2 font-mono text-xs max-w-[200px] truncate">{l.path}</td>
                      <td className="py-2 px-2">
                        <Badge variant={l.statusCode < 300 ? "success" : l.statusCode < 500 ? "warning" : "destructive"}>{l.statusCode}</Badge>
                      </td>
                      <td className="py-2 px-2 text-right">{l.duration}ms</td>
                      <td className="py-2 px-2 font-mono text-xs">{l.ip}</td>
                      <td className="py-2 px-2">{l.user?.name || "-"}</td>
                      <td className="py-2 pl-2 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {logPage} ({(logTotal || apiLogs.length)} total)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={logPage <= 1} onClick={() => setLogPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={apiLogs.length < perPage} onClick={() => setLogPage((p) => p + 1)}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
