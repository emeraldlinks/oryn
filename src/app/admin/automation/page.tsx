"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Plus, Play, Pause, Trash2, GitBranch, Clock, Mail,
  MessageSquare, UserPlus, Edit3, Globe, Loader2, Check, X,
} from "lucide-react";
import { toast } from "sonner";

const triggerOptions = [
  { value: "contact.created", label: "New Contact Created", icon: UserPlus },
  { value: "deal.stage_changed", label: "Deal Stage Changed", icon: GitBranch },
  { value: "deal.created", label: "New Deal Created", icon: GitBranch },
  { value: "form.submitted", label: "Form Submitted", icon: Edit3 },
  { value: "email.opened", label: "Email Opened", icon: Mail },
  { value: "ticket.created", label: "New Ticket", icon: MessageSquare },
];

const actionOptions = [
  { value: "create_activity", label: "Log Activity", icon: Edit3 },
  { value: "update_field", label: "Update Field", icon: Edit3 },
  { value: "notify_user", label: "Notify User", icon: UserPlus },
  { value: "create_deal", label: "Create Deal", icon: GitBranch },
  { value: "webhook", label: "Webhook", icon: Globe },
];

const actionLabels: Record<string, string> = {
  create_activity: "Log Activity",
  update_field: "Update Field",
  notify_user: "Notify User",
  create_deal: "Create Deal",
  webhook: "Webhook",
};

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    triggerType: "",
    triggerConfig: '{}' as string,
    actions: '[]' as string,
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      const res = await fetch("/api/automation/workflows");
      if (res.ok) setWorkflows(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }

  async function saveWorkflow() {
    if (!form.name || !form.triggerType) return;
    setSaving(true);
    try {
      let triggerConfig: Record<string, unknown> = {};
      let actions: any[] = [];
      try { triggerConfig = JSON.parse(form.triggerConfig); } catch {}
      try { actions = JSON.parse(form.actions); } catch {}

      const res = await fetch("/api/automation/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          triggerType: form.triggerType,
          triggerConfig,
          actions,
          active: true,
        }),
      });

      if (res.ok) {
        toast.success("Workflow created");
        setShowBuilder(false);
        setForm({ name: "", triggerType: "", triggerConfig: "{}", actions: "[]" });
        loadWorkflows();
      }
    } catch {} finally {
      setSaving(false);
    }
  }

  async function toggleWorkflow(w: any) {
    await fetch("/api/automation/workflows", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: w.id, active: !w.active }),
    });
    loadWorkflows();
  }

  async function deleteWorkflow(id: number) {
    await fetch(`/api/automation/workflows?id=${id}`, { method: "DELETE" });
    loadWorkflows();
    toast.success("Workflow deleted");
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automation Engine</h1>
            <p className="text-muted-foreground">Trigger-based workflow automation</p>
          </div>
          <Button onClick={() => setShowBuilder(!showBuilder)}>
            <Zap className="mr-2 h-4 w-4" /> New Workflow
          </Button>
        </div>

        {showBuilder && (
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Build Workflow</h3>
              <Input
                placeholder="Workflow Name (e.g. Welcome Email)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Trigger</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {triggerOptions.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setForm({ ...form, triggerType: t.value })}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                          form.triggerType === t.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Trigger Config (JSON, optional condition)
                </label>
                <textarea
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono min-h-[80px]"
                  placeholder='{"conditionField":"stage","conditionValue":"closed-won"}'
                  value={form.triggerConfig}
                  onChange={(e) => setForm({ ...form, triggerConfig: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Actions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {actionOptions.map((a) => {
                    const Icon = a.icon;
                    let currentActions: any[] = [];
                    try { currentActions = JSON.parse(form.actions); } catch {}
                    const isActive = currentActions.some((act) => act.type === a.value);
                    return (
                      <button
                        key={a.value}
                        onClick={() => {
                          let current: any[] = [];
                          try { current = JSON.parse(form.actions); } catch {}
                          if (isActive) {
                            current = current.filter((act) => act.type !== a.value);
                          } else {
                            current.push({ type: a.value, [a.value === "notify_user" ? "title" : "subject"]: "" });
                          }
                          setForm({ ...form, actions: JSON.stringify(current, null, 2) });
                        }}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                          isActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono min-h-[120px]"
                  placeholder='[{"type":"notify_user","title":"New contact!","body":"{{firstName}} {{lastName}} created"}]'
                  value={form.actions}
                  onChange={(e) => setForm({ ...form, actions: e.target.value })}
                />
              </div>

              <Button onClick={saveWorkflow} disabled={!form.name || !form.triggerType || saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Zap className="mr-2 h-4 w-4" /> Activate Workflow
              </Button>
            </div>
          </BentoCard>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : workflows.length === 0 && !showBuilder ? (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No workflows yet. Create your first automation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${w.active ? "bg-primary/10" : "bg-muted"}`}>
                    <Zap className={`h-5 w-5 ${w.active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{w.name}</p>
                      <Badge variant={w.active ? "success" : "secondary"}>{w.active ? "Active" : "Paused"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trigger: {w.triggerType} · {w.actions?.length || 0} actions · {w.runCount || 0} runs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleWorkflow(w)}>
                    {w.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteWorkflow(w.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
