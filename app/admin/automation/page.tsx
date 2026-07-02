"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Zap, Plus, Play, Pause, Trash2, GitBranch, Clock, Mail,
  MessageSquare, UserPlus, Edit3, Globe, Loader2, ChevronRight,
  ArrowRight, Settings, Eye, Activity, Tag, Users,
} from "lucide-react";

const triggerOptions = [
  { value: "contact.created", label: "New Contact Created", icon: UserPlus, description: "When a new contact is added" },
  { value: "deal.stage_changed", label: "Deal Stage Changed", icon: GitBranch, description: "When a deal moves to a new stage" },
  { value: "deal.created", label: "New Deal Created", icon: GitBranch, description: "When a new deal is created" },
  { value: "form.submitted", label: "Form Submitted", icon: Edit3, description: "When a web form is submitted" },
  { value: "email.opened", label: "Email Opened", icon: Mail, description: "When a tracked email is opened" },
  { value: "ticket.created", label: "New Ticket", icon: MessageSquare, description: "When a support ticket is created" },
];

const actionOptions = [
  { value: "create_activity", label: "Log Activity", icon: Edit3, description: "Create an activity record" },
  { value: "update_field", label: "Update Field", icon: Tag, description: "Update a field on the entity" },
  { value: "notify_user", label: "Notify User", icon: Users, description: "Send an in-app notification" },
  { value: "create_deal", label: "Create Deal", icon: GitBranch, description: "Create a new deal" },
  { value: "webhook", label: "Webhook", icon: Globe, description: "Call an external URL" },
];

interface WorkflowAction {
  type: string;
  subject?: string;
  body?: string;
  title?: string;
  userId?: number;
  activityType?: string;
  entityType?: string;
  fieldName?: string;
  fieldValue?: string;
  value?: number;
  stage?: string;
  probability?: number;
  assignedTo?: number;
  url?: string;
  method?: string;
  headers?: string;
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<"trigger" | "conditions" | "actions" | "review">("trigger");

  const [form, setForm] = useState({
    name: "",
    triggerType: "",
    conditionField: "",
    conditionOp: "equals",
    conditionValue: "",
    actions: [] as WorkflowAction[],
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      const res = await fetch("/api/automation/workflows");
      if (res.ok) setWorkflows(await res.json());
    } catch {} finally { setLoading(false); }
  }

  function resetForm() {
    setForm({ name: "", triggerType: "", conditionField: "", conditionOp: "equals", conditionValue: "", actions: [] });
    setStep("trigger");
    setEditingId(null);
  }

  async function saveWorkflow() {
    if (!form.name || !form.triggerType) return;
    setSaving(true);
    try {
      const triggerConfig: Record<string, unknown> = {};
      if (form.conditionField && form.conditionValue) {
        triggerConfig.conditionField = form.conditionField;
        triggerConfig.conditionOp = form.conditionOp;
        triggerConfig.conditionValue = form.conditionValue;
      }

      const res = editingId
        ? await fetch("/api/automation/workflows", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, name: form.name, triggerType: form.triggerType, triggerConfig, actions: form.actions }),
          })
        : await fetch("/api/automation/workflows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name, triggerType: form.triggerType, triggerConfig, actions: form.actions, active: true }),
          });

      if (res.ok) {
        toast.success(editingId ? "Workflow updated" : "Workflow created");
        setShowBuilder(false);
        resetForm();
        loadWorkflows();
      }
    } catch {} finally { setSaving(false); }
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

  function addAction(type: string) {
    const base: WorkflowAction = { type };
    switch (type) {
      case "create_activity": base.subject = ""; base.body = ""; base.activityType = "note"; break;
      case "update_field": base.entityType = "Contact"; base.fieldName = ""; base.fieldValue = ""; break;
      case "notify_user": base.title = ""; base.body = ""; base.userId = undefined; break;
      case "create_deal": base.title = ""; base.value = 0; base.stage = "lead"; base.probability = 10; break;
      case "webhook": base.url = ""; base.method = "POST"; break;
    }
    setForm({ ...form, actions: [...form.actions, base] });
  }

  function updateAction(index: number, updates: Partial<WorkflowAction>) {
    const actions = [...form.actions];
    actions[index] = { ...actions[index], ...updates };
    setForm({ ...form, actions });
  }

  function removeAction(index: number) {
    setForm({ ...form, actions: form.actions.filter((_, i) => i !== index) });
  }

  function editWorkflow(w: any) {
    const triggerConfig = (w.triggerConfig || {}) as Record<string, unknown>;
    setForm({
      name: w.name,
      triggerType: w.triggerType,
      conditionField: (triggerConfig.conditionField as string) || "",
      conditionOp: (triggerConfig.conditionOp as string) || "equals",
      conditionValue: (triggerConfig.conditionValue as string) || "",
      actions: (w.actions || []) as WorkflowAction[],
    });
    setEditingId(w.id);
    setShowBuilder(true);
    setStep("trigger");
  }

  const selectedTrigger = triggerOptions.find((t) => t.value === form.triggerType);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automation Engine</h1>
            <p className="text-muted-foreground">Trigger-based workflow automation</p>
          </div>
          <Button onClick={() => { setShowBuilder(!showBuilder); if (!showBuilder) resetForm(); }}>
            <Zap className="mr-2 h-4 w-4" /> {showBuilder ? "Cancel" : "New Workflow"}
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Workflows" value={workflows.length} icon={Zap} />
          <StatCard title="Active" value={workflows.filter((w) => w.active).length} icon={Play} />
          <StatCard title="Total Runs" value={workflows.reduce((acc, w) => acc + (w.runCount || 0), 0)} icon={Activity} />
        </BentoGrid>

        {showBuilder && (
          <BentoCard>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {["trigger", "conditions", "actions", "review"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                        step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</div>
                      <span className={`text-sm capitalize ${step === s ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
                      {i < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </div>

              <Input
                placeholder="Workflow Name (e.g. Welcome Email Sequence)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              {step === "trigger" && (
                <div>
                  <label className="text-sm font-medium mb-3 block">Choose a trigger event</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {triggerOptions.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.value}
                          onClick={() => setForm({ ...form, triggerType: t.value })}
                          className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                            form.triggerType === t.value
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "hover:bg-muted/50 hover:border-foreground/20"
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                            form.triggerType === t.value ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{t.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === "conditions" && (
                <div>
                  <label className="text-sm font-medium mb-3 block">Optional conditions (skip if not needed)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Field</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={form.conditionField} onChange={(e) => setForm({ ...form, conditionField: e.target.value })}>
                        <option value="">No condition</option>
                        {form.triggerType === "deal.stage_changed" && <option value="stage">Deal Stage</option>}
                        {form.triggerType === "form.submitted" && <option value="formId">Form ID</option>}
                        <option value="status">Status</option>
                        <option value="source">Source</option>
                        <option value="assignedTo">Assigned To</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Operator</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={form.conditionOp} onChange={(e) => setForm({ ...form, conditionOp: e.target.value })}>
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not equals</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Value</label>
                      <Input placeholder="e.g. closed-won" value={form.conditionValue}
                        onChange={(e) => setForm({ ...form, conditionValue: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {step === "actions" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Actions</label>
                    <div className="flex gap-2">
                      {actionOptions.map((a) => {
                        const Icon = a.icon;
                        return (
                          <Button key={a.value} variant="outline" size="sm" onClick={() => addAction(a.value)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> {a.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {form.actions.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No actions yet. Click an action button above to add one.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.actions.map((action, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-muted/20 relative">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">{i + 1}</Badge>
                              <span className="font-medium text-sm capitalize">{action.type.replace(/_/g, " ")}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeAction(i)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>

                          {action.type === "create_activity" && (
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Type</label>
                                <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
                                  value={action.activityType || "note"} onChange={(e) => updateAction(i, { activityType: e.target.value })}>
                                  <option value="note">Note</option>
                                  <option value="call">Call</option>
                                  <option value="email">Email</option>
                                  <option value="meeting">Meeting</option>
                                  <option value="task">Task</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Subject</label>
                                <Input size={9} value={action.subject || ""} onChange={(e) => updateAction(i, { subject: e.target.value })} placeholder="Subject" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Body</label>
                                <Input size={9} value={action.body || ""} onChange={(e) => updateAction(i, { body: e.target.value })} placeholder="Body text" />
                              </div>
                            </div>
                          )}

                          {action.type === "update_field" && (
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Entity</label>
                                <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
                                  value={action.entityType || "Contact"} onChange={(e) => updateAction(i, { entityType: e.target.value })}>
                                  <option value="Contact">Contact</option>
                                  <option value="Deal">Deal</option>
                                  <option value="Ticket">Ticket</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Field</label>
                                <Input size={9} value={action.fieldName || ""} onChange={(e) => updateAction(i, { fieldName: e.target.value })} placeholder="e.g. status" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Value</label>
                                <Input size={9} value={action.fieldValue || ""} onChange={(e) => updateAction(i, { fieldValue: e.target.value })} placeholder="New value" />
                              </div>
                            </div>
                          )}

                          {action.type === "notify_user" && (
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Title</label>
                                <Input size={9} value={action.title || ""} onChange={(e) => updateAction(i, { title: e.target.value })} placeholder="Notification title" />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-xs text-muted-foreground">Body</label>
                                <Input size={9} value={action.body || ""} onChange={(e) => updateAction(i, { body: e.target.value })} placeholder="Use {{fieldName}} for variables" />
                              </div>
                            </div>
                          )}

                          {action.type === "create_deal" && (
                            <div className="grid grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Title</label>
                                <Input size={9} value={action.title || ""} onChange={(e) => updateAction(i, { title: e.target.value })} placeholder="Deal title" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Value</label>
                                <Input type="number" size={9} value={action.value || ""} onChange={(e) => updateAction(i, { value: Number(e.target.value) })} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Stage</label>
                                <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
                                  value={action.stage || "lead"} onChange={(e) => updateAction(i, { stage: e.target.value })}>
                                  <option value="lead">Lead</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="proposal">Proposal</option>
                                  <option value="negotiation">Negotiation</option>
                                  <option value="closed-won">Closed Won</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Probability %</label>
                                <Input type="number" size={9} value={action.probability || 10} onChange={(e) => updateAction(i, { probability: Number(e.target.value) })} />
                              </div>
                            </div>
                          )}

                          {action.type === "webhook" && (
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1 col-span-2">
                                <label className="text-xs text-muted-foreground">URL</label>
                                <Input size={9} value={action.url || ""} onChange={(e) => updateAction(i, { url: e.target.value })} placeholder="https://example.com/webhook" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Method</label>
                                <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
                                  value={action.method || "POST"} onChange={(e) => updateAction(i, { method: e.target.value })}>
                                  <option value="POST">POST</option>
                                  <option value="GET">GET</option>
                                  <option value="PUT">PUT</option>
                                </select>
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mt-2">
                            Available variables: <code className="text-xs bg-muted px-1 rounded">{`{{firstName}}`}</code> <code className="text-xs bg-muted px-1 rounded">{`{{lastName}}`}</code> <code className="text-xs bg-muted px-1 rounded">{`{{email}}`}</code> <code className="text-xs bg-muted px-1 rounded">{`{{title}}`}</code>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "review" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/20">
                    <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4" /> {form.name || "Unnamed Workflow"}</h3>
                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                        {selectedTrigger && <selectedTrigger.icon className="h-4 w-4 text-primary" />}
                        <span>{selectedTrigger?.label || form.triggerType}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900">
                        <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>{form.conditionField ? `Condition: ${form.conditionField} ${form.conditionOp} ${form.conditionValue}` : "No conditions"}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                        <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{form.actions.length} action{form.actions.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  {form.actions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Action summary:</p>
                      {form.actions.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">{i + 1}</Badge>
                          <span className="capitalize">{a.type.replace(/_/g, " ")}</span>
                          {a.subject && <span>— {a.subject}</span>}
                          {a.title && <span>— {a.title}</span>}
                          {a.fieldName && <span>— {a.fieldName} = {a.fieldValue}</span>}
                          {a.url && <span className="truncate max-w-[200px]">— {a.url}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  {step !== "trigger" && (
                    <Button variant="outline" onClick={() => {
                      if (step === "conditions") setStep("trigger");
                      else if (step === "actions") setStep("conditions");
                      else if (step === "review") setStep("actions");
                    }}>Back</Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {step !== "review" ? (
                    <Button onClick={() => {
                      if (step === "trigger" && form.triggerType) setStep("conditions");
                      else if (step === "conditions") setStep("actions");
                      else if (step === "actions") setStep("review");
                    }} disabled={step === "trigger" && !form.triggerType}>
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={saveWorkflow} disabled={!form.name || saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Zap className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Activate"} Workflow
                    </Button>
                  )}
                </div>
              </div>
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
            {workflows.map((w: any) => {
              const triggerMeta = triggerOptions.find((t) => t.value === w.triggerType);
              const TriggerIcon = triggerMeta?.icon || Zap;
              return (
                <div key={w.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${w.active ? "bg-primary/10" : "bg-muted"}`}>
                      <TriggerIcon className={`h-5 w-5 ${w.active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{w.name}</p>
                        <Badge variant={w.active ? "success" : "secondary"}>{w.active ? "Active" : "Paused"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>Trigger: {triggerMeta?.label || w.triggerType}</span>
                        <span>·</span>
                        <span>{w.actions?.length || 0} action{(w.actions?.length || 0) !== 1 ? "s" : ""}</span>
                        <span>·</span>
                        <span>{w.runCount || 0} run{(w.runCount || 0) !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => editWorkflow(w)} title="Edit">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleWorkflow(w)} title={w.active ? "Pause" : "Activate"}>
                      {w.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWorkflow(w.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
