"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield, Save, Loader2, Search, RefreshCw, Clock,
  User, LogIn, LogOut, Plus, Edit3, Trash2, Download,
  Settings, ShieldOff,
} from "lucide-react";

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId: number | string;
  userId: number;
  userName: string;
  ip: string;
  metadata: string | null;
  createdAt: string;
}

const ALL_EVENTS = ["login", "logout", "create", "update", "delete", "export", "settings_change", "permission_change"];

const ACTION_ICONS: Record<string, any> = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Edit3,
  delete: Trash2,
  export: Download,
  settings_change: Settings,
  permission_change: ShieldOff,
};

const ACTION_COLORS: Record<string, string> = {
  login: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  logout: "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400",
  create: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  update: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  export: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  settings_change: "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400",
  permission_change: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
};

export default function AuditPage() {
  const [enabled, setEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);
  const [trackedEvents, setTrackedEvents] = useState<string[]>(ALL_EVENTS);
  const [excludedUsers, setExcludedUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");
  const [logSearch, setLogSearch] = useState("");

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/audit-settings");
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled ?? true);
        setRetentionDays(data.retentionDays ?? 90);
        setTrackedEvents(data.trackedEvents || ALL_EVENTS);
        setExcludedUsers((data.excludedUsers || []).join(", "));
      }
    } catch {} finally { setLoading(false); }
  }

  async function loadLogs() {
    setLogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (logSearch) params.set("search", logSearch);
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (res.ok) setLogs(await res.json());
    } catch {} finally { setLogsLoading(false); }
  }

  useEffect(() => { loadLogs(); }, [actionFilter, logSearch]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/audit-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          retentionDays,
          trackedEvents,
          excludedUsers: excludedUsers.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) toast.success("Audit settings saved");
      else toast.error("Failed to save");
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  function toggleEvent(event: string) {
    setTrackedEvents((prev) => prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]);
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit & Compliance</h1>
            <p className="text-muted-foreground">Configure audit logging and view activity trail</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadLogs}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Audit Logs" value={logs.length} icon={Shield} />
          <StatCard title="Retention" value={`${retentionDays} days`} icon={Clock} />
          <StatCard title="Tracked Events" value={trackedEvents.length} icon={Settings} />
        </BentoGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Audit Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Audit Logging</label>
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Retention Days</label>
                  <Input type="number" value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value) || 0)} className="w-40" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tracked Events</label>
                  <div className="flex flex-wrap gap-3">
                    {ALL_EVENTS.map((event) => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={trackedEvents.includes(event)} onChange={() => toggleEvent(event)} className="h-4 w-4 rounded border-gray-300" />
                        <span className="text-sm capitalize">{event.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Excluded Users (comma-separated IDs)</label>
                  <textarea
                    className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                    value={excludedUsers}
                    onChange={(e) => setExcludedUsers(e.target.value)}
                    placeholder="user_1, user_2, user_3"
                  />
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity Timeline</h3>
                <div className="flex items-center gap-2">
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  >
                    <option value="all">All Actions</option>
                    {ALL_EVENTS.map((a) => (
                      <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <div className="relative w-36">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)} className="pl-7 h-8 text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {logsLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-12">No audit logs found.</p>
                ) : logs.slice(0, 30).map((log) => {
                  const Icon = ACTION_ICONS[log.action] || Shield;
                  return (
                    <div key={log.id} className="flex gap-3 py-2.5 border-b last:border-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${ACTION_COLORS[log.action] || "bg-muted"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{log.action.replace(/_/g, " ")}</span>
                          <span className="text-xs text-muted-foreground">— {log.entity}.{log.entityId}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          by <span className="font-medium">{log.userName}</span>
                          {log.ip && <> from <span className="font-mono">{log.ip}</span></>}
                        </p>
                        {log.metadata && (
                          <pre className="text-xs text-muted-foreground bg-muted/50 p-1.5 rounded mt-1 overflow-x-auto max-h-20">
                            {log.metadata}
                          </pre>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  );
                })}
                {logs.length > 30 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">Showing 30 of {logs.length} entries</p>
                )}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </DashboardShell>
  );
}
