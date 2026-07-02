"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Target, DollarSign, BarChart3, FileText, Globe, RefreshCw,
  Plus, Trash2, Loader2, Check, X, Percent, Calendar,
} from "lucide-react";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("pipelines");

  const tabs = [
    { id: "pipelines", label: "Pipelines", icon: Target },
    { id: "goals", label: "Goals", icon: BarChart3 },
    { id: "commissions", label: "Commissions", icon: DollarSign },
    { id: "quotes", label: "Quotes", icon: FileText },
    { id: "territories", label: "Territories", icon: Globe },
    { id: "subscriptions", label: "Subscriptions", icon: RefreshCw },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage pipelines, goals, commissions, quotes, territories, and subscriptions</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "pipelines" && <PipelinesTab />}
        {activeTab === "goals" && <GoalsTab />}
        {activeTab === "commissions" && <CommissionsTab />}
        {activeTab === "quotes" && <QuotesTab />}
        {activeTab === "territories" && <TerritoriesTab />}
        {activeTab === "subscriptions" && <SubscriptionsTab />}
      </div>
    </DashboardShell>
  );
}

function PipelinesTab() {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", stages: "[{\"name\":\"Lead\",\"color\":\"#94a3b8\"}]", isDefault: false });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/pipelines");
      if (res.ok) setPipelines(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.name) return;
    setCreating(true);
    try {
      let stages;
      try { stages = JSON.parse(form.stages); } catch { toast.error("Invalid stages JSON"); setCreating(false); return; }
      const res = await fetch("/api/sales/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stages }),
      });
      if (res.ok) {
        toast.success("Pipeline created");
        setForm({ name: "", stages: "[{\"name\":\"Lead\",\"color\":\"#94a3b8\"}]", isDefault: false });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create pipeline");
      }
    } catch {} finally { setCreating(false); }
  }

  async function toggleActive(id: number, active: boolean) {
    try {
      const res = await fetch("/api/sales/pipelines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (res.ok) { toast.success(active ? "Pipeline activated" : "Pipeline deactivated"); load(); }
    } catch {}
  }

  async function remove(id: number) {
    try {
      const res = await fetch(`/api/sales/pipelines?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Pipeline deleted"); load(); }
    } catch {}
  }

  const stageColors: Record<string, string> = {
    lead: "bg-slate-100 text-slate-700",
    qualified: "bg-blue-100 text-blue-700",
    proposal: "bg-purple-100 text-purple-700",
    negotiation: "bg-amber-100 text-amber-700",
    closed: "bg-green-100 text-green-700",
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Pipelines</h3>
          <p className="text-sm text-muted-foreground">Manage your sales pipelines and stages.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : pipelines.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No pipelines yet.</p>
            ) : (
              <div className="space-y-3">
                {pipelines.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {p.stages?.map((s: any, i: number) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${stageColors[s.name?.toLowerCase()] || "bg-muted text-muted-foreground"}`}
                            style={stageColors[s.name?.toLowerCase()] ? undefined : { backgroundColor: s.color + "20", color: s.color }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => toggleActive(p.id, !p.active)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${p.active ? "bg-primary" : "bg-muted"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.active ? "translate-x-4" : ""}`} />
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Create Pipeline</h3>
          <p className="text-sm text-muted-foreground">Add a new sales pipeline.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input placeholder="e.g. Sales Pipeline" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
                    Set as Default
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Stages (JSON array)</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={form.stages}
                  onChange={(e) => setForm({ ...form, stages: e.target.value })}
                />
              </div>
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Plus className="mr-2 h-4 w-4" /> Create Pipeline
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}

function GoalsTab() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ userId: 1, userLabel: "Current User", target: "", achieved: 0, periodName: "", periodType: "monthly", startDate: "", endDate: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/goals");
      if (res.ok) setGoals(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.target || !form.periodName || !form.startDate || !form.endDate) return;
    setCreating(true);
    try {
      const res = await fetch("/api/sales/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, target: parseFloat(form.target) }),
      });
      if (res.ok) {
        toast.success("Goal created");
        setForm({ userId: 1, userLabel: "Current User", target: "", achieved: 0, periodName: "", periodType: "monthly", startDate: "", endDate: "" });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create goal");
      }
    } catch {} finally { setCreating(false); }
  }

  async function remove(id: number) {
    try {
      const res = await fetch(`/api/sales/goals?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Goal deleted"); load(); }
    } catch {}
  }

  const totalTarget = goals.reduce((s, g) => s + (g.target || 0), 0);
  const totalAchieved = goals.reduce((s, g) => s + (g.achieved || 0), 0);
  const avgProgress = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
  const onTrack = goals.filter((g) => (g.achieved || 0) >= (g.target || 0)).length;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <BentoCard>
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">Total Target</p>
            <p className="text-2xl font-bold">${totalTarget.toLocaleString()}</p>
          </div>
        </BentoCard>
        <BentoCard>
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">Total Achieved</p>
            <p className="text-2xl font-bold">${totalAchieved.toLocaleString()}</p>
          </div>
        </BentoCard>
        <BentoCard>
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="text-2xl font-bold">{avgProgress}%</p>
          </div>
        </BentoCard>
        <BentoCard>
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">On Track</p>
            <p className="text-2xl font-bold">{onTrack}/{goals.length}</p>
          </div>
        </BentoCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Goals</h3>
          <p className="text-sm text-muted-foreground">Track sales goals and progress.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : goals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No goals yet.</p>
            ) : (
              <div className="space-y-3">
                {goals.map((g: any) => {
                  const progress = g.target > 0 ? Math.min(100, Math.round((g.achieved / g.target) * 100)) : 0;
                  return (
                    <div key={g.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{g.userLabel || `User #${g.userId}`}</p>
                          <p className="text-xs text-muted-foreground">{g.periodName} ({g.periodType})</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <span className="font-medium">${(g.achieved || 0).toLocaleString()}</span>
                            <span className="text-muted-foreground"> / ${(g.target || 0).toLocaleString()}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => remove(g.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{g.startDate} - {g.endDate}</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Create Goal</h3>
          <p className="text-sm text-muted-foreground">Set a new sales goal.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">User</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.userId} onChange={(e) => setForm({ ...form, userId: parseInt(e.target.value), userLabel: e.target.options[e.target.selectedIndex].text })}>
                    <option value={1}>Current User</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Amount ($)</label>
                  <Input type="number" placeholder="100000" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Period Name</label>
                  <Input placeholder="e.g. Q1 2026" value={form.periodName} onChange={(e) => setForm({ ...form, periodName: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Period Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.periodType} onChange={(e) => setForm({ ...form, periodType: e.target.value })}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Plus className="mr-2 h-4 w-4" /> Create Goal
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}

function CommissionsTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [form, setForm] = useState({ name: "", rateType: "percentage", rateValue: "", minDealValue: "", maxDealValue: "", tiers: "[{\"min\":0,\"max\":50000,\"rate\":5}]" });
  const [calcForm, setCalcForm] = useState({ dealId: "", userId: "", planId: "", dealAmount: "" });

  async function load() {
    setLoading(true);
    try {
      const [plansRes, earningsRes] = await Promise.all([
        fetch("/api/sales/commissions"),
        fetch("/api/sales/commissions?earnings=1"),
      ]);
      if (plansRes.ok) setPlans(await plansRes.json());
      if (earningsRes.ok) setEarnings(await earningsRes.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.name || !form.rateValue) return;
    setCreating(true);
    try {
      let tiers;
      try { tiers = JSON.parse(form.tiers); } catch { toast.error("Invalid tiers JSON"); setCreating(false); return; }
      const res = await fetch("/api/sales/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rateValue: parseFloat(form.rateValue), minDealValue: form.minDealValue ? parseFloat(form.minDealValue) : null, maxDealValue: form.maxDealValue ? parseFloat(form.maxDealValue) : null, tiers }),
      });
      if (res.ok) {
        toast.success("Commission plan created");
        setForm({ name: "", rateType: "percentage", rateValue: "", minDealValue: "", maxDealValue: "", tiers: "[{\"min\":0,\"max\":50000,\"rate\":5}]" });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create plan");
      }
    } catch {} finally { setCreating(false); }
  }

  async function toggleActive(id: number, active: boolean) {
    try {
      const res = await fetch("/api/sales/commissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (res.ok) { toast.success(active ? "Plan activated" : "Plan deactivated"); load(); }
    } catch {}
  }

  async function removePlan(id: number) {
    try {
      const res = await fetch(`/api/sales/commissions?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Plan deleted"); load(); }
    } catch {}
  }

  async function calculateEarning() {
    if (!calcForm.dealId || !calcForm.userId || !calcForm.planId || !calcForm.dealAmount) return;
    setCalculating(true);
    try {
      const res = await fetch("/api/sales/commissions?calculate=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...calcForm, dealAmount: parseFloat(calcForm.dealAmount) }),
      });
      if (res.ok) {
        toast.success("Commission calculated and recorded");
        setCalcForm({ dealId: "", userId: "", planId: "", dealAmount: "" });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Calculation failed");
      }
    } catch {} finally { setCalculating(false); }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Commission Plans</h3>
          <p className="text-sm text-muted-foreground">Manage commission structures.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : plans.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No commission plans yet.</p>
            ) : (
              <div className="space-y-3">
                {plans.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{p.name}</p>
                        <Badge variant={p.rateType === "percentage" ? "default" : "secondary"} className="text-xs">
                          {p.rateType === "percentage" ? <Percent className="h-3 w-3 mr-1" /> : <DollarSign className="h-3 w-3 mr-1" />}
                          {p.rateType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: {p.rateValue}{p.rateType === "percentage" ? "%" : ""} |
                        Min Deal: ${(p.minDealValue || 0).toLocaleString()} |
                        Max Deal: ${(p.maxDealValue || "∞").toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => toggleActive(p.id, !p.active)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${p.active ? "bg-primary" : "bg-muted"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.active ? "translate-x-4" : ""}`} />
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => removePlan(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Create Plan</h3>
          <p className="text-sm text-muted-foreground">Add a new commission plan.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input placeholder="e.g. Standard Plan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Rate Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.rateType} onChange={(e) => setForm({ ...form, rateType: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Rate Value</label>
                  <Input type="number" step="0.01" placeholder={form.rateType === "percentage" ? "10" : "500"} value={form.rateValue} onChange={(e) => setForm({ ...form, rateValue: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Min Deal Value ($)</label>
                  <Input type="number" placeholder="0" value={form.minDealValue} onChange={(e) => setForm({ ...form, minDealValue: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Deal Value ($)</label>
                  <Input type="number" placeholder="1000000" value={form.maxDealValue} onChange={(e) => setForm({ ...form, maxDealValue: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tiers (JSON array)</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={form.tiers}
                  onChange={(e) => setForm({ ...form, tiers: e.target.value })}
                />
              </div>
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Plus className="mr-2 h-4 w-4" /> Create Plan
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Commission Earnings</h3>
          <p className="text-sm text-muted-foreground">Recorded commission payouts.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : earnings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No earnings recorded.</p>
            ) : (
              <div className="space-y-3">
                {earnings.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{e.dealName || `Deal #${e.dealId}`}</p>
                      <p className="text-xs text-muted-foreground">User: {e.userLabel || `#${e.userId}`} | Amount: ${(e.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(e.status)}
                      {e.paidDate && <span className="text-xs text-muted-foreground">{e.paidDate}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Calculate Commission</h3>
          <p className="text-sm text-muted-foreground">Calculate and record a commission earning.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Deal ID</label>
                  <Input type="number" placeholder="1" value={calcForm.dealId} onChange={(e) => setCalcForm({ ...calcForm, dealId: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">User ID</label>
                  <Input type="number" placeholder="1" value={calcForm.userId} onChange={(e) => setCalcForm({ ...calcForm, userId: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Plan ID</label>
                  <Input type="number" placeholder="1" value={calcForm.planId} onChange={(e) => setCalcForm({ ...calcForm, planId: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Deal Amount ($)</label>
                  <Input type="number" placeholder="50000" value={calcForm.dealAmount} onChange={(e) => setCalcForm({ ...calcForm, dealAmount: e.target.value })} />
                </div>
              </div>
              <Button onClick={calculateEarning} disabled={calculating}>
                {calculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <DollarSign className="mr-2 h-4 w-4" /> Calculate & Record
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}

function QuotesTab() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [changingStatus, setChangingStatus] = useState<number | null>(null);
  const [form, setForm] = useState({ contactId: "", taxRate: "", discountAmount: "", notes: "", terms: "", validUntil: "" });
  const [lineItems, setLineItems] = useState([{ productId: "", quantity: "1", unitPrice: "", discountPercent: "0" }]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/quotes");
      if (res.ok) setQuotes(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function addLineItem() {
    setLineItems([...lineItems, { productId: "", quantity: "1", unitPrice: "", discountPercent: "0" }]);
  }

  function updateLineItem(index: number, field: string, value: string) {
    const items = [...lineItems];
    items[index] = { ...items[index], [field]: value };
    setLineItems(items);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  async function create() {
    if (!form.contactId) return;
    setCreating(true);
    try {
      const res = await fetch("/api/sales/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          taxRate: form.taxRate ? parseFloat(form.taxRate) : 0,
          discountAmount: form.discountAmount ? parseFloat(form.discountAmount) : 0,
          lineItems: lineItems.map((li) => ({
            productId: parseInt(li.productId),
            quantity: parseInt(li.quantity) || 1,
            unitPrice: parseFloat(li.unitPrice),
            discountPercent: parseFloat(li.discountPercent) || 0,
          })),
        }),
      });
      if (res.ok) {
        toast.success("Quote created");
        setForm({ contactId: "", taxRate: "", discountAmount: "", notes: "", terms: "", validUntil: "" });
        setLineItems([{ productId: "", quantity: "1", unitPrice: "", discountPercent: "0" }]);
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create quote");
      }
    } catch {} finally { setCreating(false); }
  }

  async function changeStatus(id: number, status: string) {
    setChangingStatus(id);
    try {
      const res = await fetch("/api/sales/quotes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) { toast.success(`Quote ${status}`); load(); }
    } catch {} finally { setChangingStatus(null); }
  }

  async function remove(id: number) {
    try {
      const res = await fetch(`/api/sales/quotes?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Quote deleted"); load(); }
    } catch {}
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-blue-100 text-blue-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Quotes</h3>
          <p className="text-sm text-muted-foreground">Manage sales quotes.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : quotes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No quotes yet.</p>
            ) : (
              <div className="space-y-3">
                {quotes.map((q: any) => (
                  <div key={q.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{q.quoteNumber || `Q-${q.id}`}</p>
                        {statusBadge(q.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {q.status === "draft" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => changeStatus(q.id, "sent")} disabled={changingStatus === q.id}>
                              {changingStatus === q.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />} Send
                            </Button>
                          </>
                        )}
                        {q.status === "sent" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600" onClick={() => changeStatus(q.id, "accepted")} disabled={changingStatus === q.id}>
                              {changingStatus === q.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />} Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => changeStatus(q.id, "rejected")} disabled={changingStatus === q.id}>
                              {changingStatus === q.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3 mr-1" />} Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Contact: {q.contactLabel || `#${q.contactId}`}</span>
                      <span>Total: ${(q.total || 0).toLocaleString()}</span>
                      {q.validUntil && <span>Valid until: {q.validUntil}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Create Quote</h3>
          <p className="text-sm text-muted-foreground">Generate a new quote.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Contact ID</label>
                  <Input type="number" placeholder="1" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tax Rate (%)</label>
                  <Input type="number" step="0.01" placeholder="10" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Discount Amount ($)</label>
                  <Input type="number" step="0.01" placeholder="0" value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Valid Until</label>
                  <Input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <Input placeholder="Optional notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Terms</label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Payment terms..."
                    value={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Line Items</label>
                <div className="space-y-2">
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-0.5 block">Product ID</label>
                        <Input type="number" placeholder="1" value={item.productId} onChange={(e) => updateLineItem(i, "productId", e.target.value)} />
                      </div>
                      <div className="w-20">
                        <label className="text-xs text-muted-foreground mb-0.5 block">Qty</label>
                        <Input type="number" placeholder="1" value={item.quantity} onChange={(e) => updateLineItem(i, "quantity", e.target.value)} />
                      </div>
                      <div className="w-28">
                        <label className="text-xs text-muted-foreground mb-0.5 block">Unit Price</label>
                        <Input type="number" step="0.01" placeholder="99.99" value={item.unitPrice} onChange={(e) => updateLineItem(i, "unitPrice", e.target.value)} />
                      </div>
                      <div className="w-20">
                        <label className="text-xs text-muted-foreground mb-0.5 block">Disc %</label>
                        <Input type="number" placeholder="0" value={item.discountPercent} onChange={(e) => updateLineItem(i, "discountPercent", e.target.value)} />
                      </div>
                      <Button variant="ghost" size="icon" className="mb-0.5" onClick={() => removeLineItem(i)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addLineItem}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                </div>
              </div>

              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <FileText className="mr-2 h-4 w-4" /> Create Quote
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}

function TerritoriesTab() {
  const [territories, setTerritories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", regions: "[{\"country\":\"US\",\"state\":\"CA\"}]", managerId: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/territories");
      if (res.ok) setTerritories(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.name) return;
    setCreating(true);
    try {
      let regions;
      try { regions = JSON.parse(form.regions); } catch { toast.error("Invalid regions JSON"); setCreating(false); return; }
      const res = await fetch("/api/sales/territories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, regions, managerId: form.managerId ? parseInt(form.managerId) : null }),
      });
      if (res.ok) {
        toast.success("Territory created");
        setForm({ name: "", regions: "[{\"country\":\"US\",\"state\":\"CA\"}]", managerId: "" });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create territory");
      }
    } catch {} finally { setCreating(false); }
  }

  async function remove(id: number) {
    try {
      const res = await fetch(`/api/sales/territories?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Territory deleted"); load(); }
    } catch {}
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Territories</h3>
          <p className="text-sm text-muted-foreground">Manage sales territories and regions.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : territories.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No territories yet.</p>
            ) : (
              <div className="space-y-3">
                {territories.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Regions: {JSON.stringify(t.regions).substring(0, 60)}{JSON.stringify(t.regions).length > 60 ? "..." : ""}
                        {t.managerLabel && <> | Manager: {t.managerLabel}</>}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-4 shrink-0" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="font-medium">Create Territory</h3>
          <p className="text-sm text-muted-foreground">Add a new territory.</p>
        </div>
        <div className="lg:col-span-2">
          <BentoCard>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input placeholder="e.g. West Coast" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Manager ID</label>
                  <Input type="number" placeholder="1" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Regions (JSON array)</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={form.regions}
                  onChange={(e) => setForm({ ...form, regions: e.target.value })}
                />
              </div>
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Plus className="mr-2 h-4 w-4" /> Create Territory
              </Button>
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}

function SubscriptionsTab() {
  const [subTab, setSubTab] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSub, setCreatingSub] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [subForm, setSubForm] = useState({ contactId: "", planId: "", startDate: "", endDate: "" });
  const [planForm, setPlanForm] = useState({ name: "", description: "", price: "", currency: "USD", billingCycle: "monthly", features: "", active: true });

  async function load() {
    setLoading(true);
    try {
      const [subsRes, plansRes] = await Promise.all([
        fetch("/api/sales/subscriptions"),
        fetch("/api/sales/subscriptions?plans=1"),
      ]);
      if (subsRes.ok) setSubscriptions(await subsRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function createSubscription() {
    if (!subForm.contactId || !subForm.planId || !subForm.startDate) return;
    setCreatingSub(true);
    try {
      const res = await fetch("/api/sales/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subForm, contactId: parseInt(subForm.contactId), planId: parseInt(subForm.planId) }),
      });
      if (res.ok) {
        toast.success("Subscription created");
        setSubForm({ contactId: "", planId: "", startDate: "", endDate: "" });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create subscription");
      }
    } catch {} finally { setCreatingSub(false); }
  }

  async function createPlan() {
    if (!planForm.name || !planForm.price) return;
    setCreatingPlan(true);
    try {
      const res = await fetch("/api/sales/subscriptions?plans=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...planForm,
          price: parseFloat(planForm.price),
          features: planForm.features.split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success("Plan created");
        setPlanForm({ name: "", description: "", price: "", currency: "USD", billingCycle: "monthly", features: "", active: true });
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create plan");
      }
    } catch {} finally { setCreatingPlan(false); }
  }

  async function togglePlanActive(id: number, active: boolean) {
    try {
      const res = await fetch("/api/sales/subscriptions?plans=1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (res.ok) { toast.success(active ? "Plan activated" : "Plan deactivated"); load(); }
    } catch {}
  }

  async function removeSub(id: number) {
    try {
      const res = await fetch(`/api/sales/subscriptions?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Subscription deleted"); load(); }
    } catch {}
  }

  async function removePlan(id: number) {
    try {
      const res = await fetch(`/api/sales/subscriptions?plans=1&id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Plan deleted"); load(); }
    } catch {}
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      paused: "bg-amber-100 text-amber-700",
      cancelled: "bg-red-100 text-red-700",
      expired: "bg-muted text-muted-foreground",
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
  };

  const subTabs = [
    { id: "subscriptions", label: "Active Subscriptions" },
    { id: "plans", label: "Subscription Plans" },
  ];

  return (
    <>
      <div className="flex gap-2 flex-wrap border-b pb-2">
        {subTabs.map((st) => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              subTab === st.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {subTab === "subscriptions" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Subscriptions</h3>
              <p className="text-sm text-muted-foreground">Active and past subscriptions.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : subscriptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No subscriptions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{s.contactLabel || `Contact #${s.contactId}`}</p>
                            {statusBadge(s.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Plan: {s.planLabel || `#${s.planId}`} | Amount: ${(s.amount || 0).toLocaleString()}
                            {s.nextBillingDate && <> | Next billing: {s.nextBillingDate}</>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.startDate} - {s.endDate || "Ongoing"}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-4 shrink-0" onClick={() => removeSub(s.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </BentoCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Create Subscription</h3>
              <p className="text-sm text-muted-foreground">Add a new subscription.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Contact ID</label>
                      <Input type="number" placeholder="1" value={subForm.contactId} onChange={(e) => setSubForm({ ...subForm, contactId: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Plan ID</label>
                      <Input type="number" placeholder="1" value={subForm.planId} onChange={(e) => setSubForm({ ...subForm, planId: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Start Date</label>
                      <Input type="date" value={subForm.startDate} onChange={(e) => setSubForm({ ...subForm, startDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">End Date</label>
                      <Input type="date" value={subForm.endDate} onChange={(e) => setSubForm({ ...subForm, endDate: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={createSubscription} disabled={creatingSub}>
                    {creatingSub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Plus className="mr-2 h-4 w-4" /> Create Subscription
                  </Button>
                </div>
              </BentoCard>
            </div>
          </div>
        </>
      )}

      {subTab === "plans" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Plans</h3>
              <p className="text-sm text-muted-foreground">Subscription plans and pricing.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : plans.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No plans yet.</p>
                ) : (
                  <div className="space-y-3">
                    {plans.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{p.name}</p>
                            <Badge variant="secondary" className="text-xs">{p.billingCycle}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                          <p className="text-xs mt-1">
                            <span className="font-medium">{p.currency} {p.price?.toLocaleString()}</span>
                            {p.features?.length > 0 && <> | Features: {p.features.join(", ")}</>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <button
                            onClick={() => togglePlanActive(p.id, !p.active)}
                            className={`relative w-9 h-5 rounded-full transition-colors ${p.active ? "bg-primary" : "bg-muted"}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.active ? "translate-x-4" : ""}`} />
                          </button>
                          <Button variant="ghost" size="icon" onClick={() => removePlan(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </BentoCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Create Plan</h3>
              <p className="text-sm text-muted-foreground">Add a new subscription plan.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input placeholder="e.g. Pro Plan" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price</label>
                      <Input type="number" step="0.01" placeholder="29.99" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Currency</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={planForm.currency} onChange={(e) => setPlanForm({ ...planForm, currency: e.target.value })}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Billing Cycle</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={planForm.billingCycle} onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Input placeholder="Plan description" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-1 block">Features (comma-separated)</label>
                      <Input placeholder="CRM, Marketing, Staff Management, Inventory, AI Features, API Access, Automation" value={planForm.features} onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={createPlan} disabled={creatingPlan}>
                    {creatingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Plus className="mr-2 h-4 w-4" /> Create Plan
                  </Button>
                </div>
              </BentoCard>
            </div>
          </div>
        </>
      )}
    </>
  );
}
