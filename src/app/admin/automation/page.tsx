"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Play, Pause, Trash2, GitBranch, Clock, Mail, MessageSquare, UserPlus, Edit3 } from "lucide-react";

const triggerOptions = [
  { value: "new-contact", label: "New Contact Created", icon: UserPlus },
  { value: "deal-stage-change", label: "Deal Stage Changed", icon: GitBranch },
  { value: "form-submission", label: "Form Submitted", icon: Edit3 },
  { value: "email-opened", label: "Email Opened", icon: Mail },
  { value: "time-elapsed", label: "Time Elapsed", icon: Clock },
];

const actionOptions = [
  { value: "send-email", label: "Send Email", icon: Mail },
  { value: "send-sms", label: "Send SMS", icon: MessageSquare },
  { value: "create-task", label: "Create Task", icon: Plus },
  { value: "update-field", label: "Update Field", icon: Edit3 },
  { value: "notify-user", label: "Notify User", icon: UserPlus },
  { value: "create-deal", label: "Create Deal", icon: GitBranch },
];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  function toggleAction(action: string) {
    setSelectedActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  }

  async function saveWorkflow() {
    if (!workflowName || !selectedTrigger) return;

    const res = await fetch("/api/automation/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workflowName,
        trigger: selectedTrigger,
        actions: selectedActions,
      }),
    });

    if (res.ok) {
      setShowBuilder(false);
      setWorkflowName("");
      setSelectedTrigger("");
      setSelectedActions([]);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automation Engine</h1>
            <p className="text-muted-foreground">Visual workflow builder</p>
          </div>
          <Button onClick={() => setShowBuilder(!showBuilder)}>
            <Zap className="mr-2 h-4 w-4" /> New Workflow
          </Button>
        </div>

        {showBuilder && (
          <BentoCard className="w-full">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Build Workflow</h3>

              <div>
                <label className="text-sm font-medium mb-1 block">Workflow Name</label>
                <Input
                  placeholder="e.g. Welcome Email Sequence"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Trigger</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {triggerOptions.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setSelectedTrigger(t.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                          selectedTrigger === t.value
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
                <label className="text-sm font-medium mb-2 block">Actions (select one or more)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {actionOptions.map((a) => {
                    const Icon = a.icon;
                    const active = selectedActions.includes(a.value);
                    return (
                      <button
                        key={a.value}
                        onClick={() => toggleAction(a.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                          active
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button onClick={saveWorkflow} disabled={!workflowName || !selectedTrigger}>
                <Zap className="mr-2 h-4 w-4" /> Activate Workflow
              </Button>
            </div>
          </BentoCard>
        )}

        <div className="space-y-3">
          {workflows.length === 0 && !showBuilder && (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No workflows yet. Create your first automation.</p>
            </div>
          )}
          {workflows.map((w: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{w.name || "Workflow"}</p>
                  <p className="text-xs text-muted-foreground">
                    Trigger: {w.trigger} · {w.actions?.length || 0} actions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
