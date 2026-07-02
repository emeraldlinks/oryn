"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Loader2, Users, Database, Globe, Bot, Key, Cpu, RefreshCw } from "lucide-react";

interface Quota {
  maxUsers: number;
  maxStorageGB: number;
  maxContacts: number;
  maxDeals: number;
  maxProjects: number;
  canUseAi: boolean;
  canUseApi: boolean;
  canUseAutomation: boolean;
}

interface UsageRecord {
  id: number;
  entityType: string;
  count: number;
  period: string;
  recordedAt: string;
}

export default function MultiTenancyPage() {
  const [quota, setQuota] = useState<Quota>({ maxUsers: 10, maxStorageGB: 50, maxContacts: 1000, maxDeals: 500, maxProjects: 50, canUseAi: true, canUseApi: true, canUseAutomation: true });
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [quotaRes, usageRes] = await Promise.all([
        fetch("/api/admin/quotas"),
        fetch("/api/admin/usage"),
      ]);
      if (quotaRes.ok) setQuota(await quotaRes.json());
      if (usageRes.ok) setUsage(await usageRes.json());
    } catch {} finally { setLoading(false); }
  }

  async function saveQuota() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/quotas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quota),
      });
      if (res.ok) toast.success("Quotas saved");
      else toast.error("Failed to save quotas");
    } catch { toast.error("Failed to save quotas"); } finally { setSaving(false); }
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
            <h1 className="text-3xl font-bold">Multi-Tenancy / Quotas</h1>
            <p className="text-muted-foreground">Manage tenant quotas and resource limits</p>
          </div>
          <Button onClick={saveQuota} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Resource Limits</h3>
            <p className="text-sm text-muted-foreground">Set maximum limits for this tenant.</p>
          </div>
          <div className="lg:col-span-2">
            <BentoCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Users className="h-4 w-4" /> Max Users</label>
                  <Input type="number" value={quota.maxUsers} onChange={(e) => setQuota({ ...quota, maxUsers: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-2"><HardDrive className="h-4 w-4" /> Max Storage (GB)</label>
                  <Input type="number" value={quota.maxStorageGB} onChange={(e) => setQuota({ ...quota, maxStorageGB: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Users className="h-4 w-4" /> Max Contacts</label>
                  <Input type="number" value={quota.maxContacts} onChange={(e) => setQuota({ ...quota, maxContacts: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Database className="h-4 w-4" /> Max Deals</label>
                  <Input type="number" value={quota.maxDeals} onChange={(e) => setQuota({ ...quota, maxDeals: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Max Projects</label>
                  <Input type="number" value={quota.maxProjects} onChange={(e) => setQuota({ ...quota, maxProjects: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Feature Toggles</h3>
            <p className="text-sm text-muted-foreground">Enable or disable features for this tenant.</p>
          </div>
          <div className="lg:col-span-2">
            <BentoCard>
              <div className="space-y-4">
                {[
                  { key: "canUseAi", label: "AI Features", icon: Bot },
                  { key: "canUseApi", label: "API Access", icon: Key },
                  { key: "canUseAutomation", label: "Automation", icon: Cpu },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <button
                      onClick={() => setQuota({ ...quota, [key]: !(quota as any)[key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${(quota as any)[key] ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${(quota as any)[key] ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Usage Records</h3>
            <p className="text-sm text-muted-foreground">Current resource consumption.</p>
          </div>
          <div className="lg:col-span-2">
            <BentoCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">Entity Type</th>
                      <th className="text-right py-2 px-2 font-medium">Count</th>
                      <th className="text-left py-2 px-2 font-medium">Period</th>
                      <th className="text-left py-2 pl-4 font-medium">Recorded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-sm text-muted-foreground">No usage records found.</td></tr>
                    ) : usage.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium capitalize">{u.entityType}</td>
                        <td className="py-3 px-2 text-right">{u.count}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{u.period}</td>
                        <td className="py-3 pl-4 text-xs text-muted-foreground">{new Date(u.recordedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
