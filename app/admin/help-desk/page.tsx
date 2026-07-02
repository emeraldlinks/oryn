"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock, MessageSquare, Zap, ArrowUpCircle, FolderOpen, Plus, X, Loader2,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

interface SLAPolicy {
  id: number;
  name: string;
  responseTime: number;
  resolutionTime: number;
  active: boolean;
}

interface CannedResponse {
  id: number;
  title: string;
  category: string;
  shortcuts: string;
  bodyHtml: string;
}

interface Macro {
  id: number;
  name: string;
  description?: string;
  actions: string;
}

interface EscalationRule {
  id: number;
  name: string;
  triggerType: string;
  conditions: string;
  actions: string;
  active: boolean;
}

interface Asset {
  id: number;
  name: string;
  type: string;
  contact?: { name: string };
  warrantyEnd?: string;
}

export default function HelpDeskPage() {
  const [activeTab, setActiveTab] = useState("sla");
  const [submitting, setSubmitting] = useState(false);

  const [slas, setSlas] = useState<SLAPolicy[]>([]);
  const [slaForm, setSlaForm] = useState({ name: "", responseTime: 60, resolutionTime: 240, active: true });
  const [showNewSla, setShowNewSla] = useState(false);

  const [canned, setCanned] = useState<CannedResponse[]>([]);
  const [cannedForm, setCannedForm] = useState({ title: "", category: "", shortcuts: "", bodyHtml: "" });
  const [showNewCanned, setShowNewCanned] = useState(false);

  const [macros, setMacros] = useState<Macro[]>([]);
  const [macroForm, setMacroForm] = useState({ name: "", description: "", actions: "[]" });
  const [showNewMacro, setShowNewMacro] = useState(false);

  const [escalations, setEscalations] = useState<EscalationRule[]>([]);
  const [escalationForm, setEscalationForm] = useState({ name: "", triggerType: "time", conditions: "{}", actions: "[]", active: true });
  const [showNewEscalation, setShowNewEscalation] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetForm, setAssetForm] = useState({ name: "", type: "document", contactId: "" });
  const [showNewAsset, setShowNewAsset] = useState(false);

  useEffect(() => {
    loadSlas();
    loadCanned();
    loadMacros();
    loadEscalations();
    loadAssets();
  }, []);

  async function loadSlas() { try { const r = await fetch("/api/help-desk/sla"); if (r.ok) setSlas(await r.json()); } catch {} }
  async function loadCanned() { try { const r = await fetch("/api/help-desk/canned"); if (r.ok) setCanned(await r.json()); } catch {} }
  async function loadMacros() { try { const r = await fetch("/api/help-desk/macros"); if (r.ok) setMacros(await r.json()); } catch {} }
  async function loadEscalations() { try { const r = await fetch("/api/help-desk/escalation"); if (r.ok) setEscalations(await r.json()); } catch {} }
  async function loadAssets() { try { const r = await fetch("/api/help-desk/assets"); if (r.ok) setAssets(await r.json()); } catch {} }

  async function createSla(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/help-desk/sla", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(slaForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewSla(false);
      setSlaForm({ name: "", responseTime: 60, resolutionTime: 240, active: true });
      await loadSlas();
      toast.success("SLA policy created");
    }
  }

  async function toggleSla(policy: SLAPolicy) {
    await fetch(`/api/help-desk/sla?id=${policy.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...policy, active: !policy.active }),
    });
    await loadSlas();
    toast.success(policy.active ? "SLA deactivated" : "SLA activated");
  }

  async function createCanned(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/help-desk/canned", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cannedForm, shortcuts: cannedForm.shortcuts.split(",").map((s) => s.trim()) }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewCanned(false);
      setCannedForm({ title: "", category: "", shortcuts: "", bodyHtml: "" });
      await loadCanned();
      toast.success("Canned response created");
    }
  }

  async function createMacro(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/help-desk/macros", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(macroForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewMacro(false);
      setMacroForm({ name: "", description: "", actions: "[]" });
      await loadMacros();
      toast.success("Macro created");
    }
  }

  async function createEscalation(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/help-desk/escalation", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(escalationForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewEscalation(false);
      setEscalationForm({ name: "", triggerType: "time", conditions: "{}", actions: "[]", active: true });
      await loadEscalations();
      toast.success("Escalation rule created");
    }
  }

  async function toggleEscalation(rule: EscalationRule) {
    await fetch(`/api/help-desk/escalation?id=${rule.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rule, active: !rule.active }),
    });
    await loadEscalations();
    toast.success(rule.active ? "Rule deactivated" : "Rule activated");
  }

  async function createAsset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/help-desk/assets", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...assetForm, contactId: Number(assetForm.contactId) }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewAsset(false);
      setAssetForm({ name: "", type: "document", contactId: "" });
      await loadAssets();
      toast.success("Asset created");
    }
  }

  const tabs = [
    { id: "sla", label: "SLA Policies", icon: Clock },
    { id: "canned", label: "Canned Responses", icon: MessageSquare },
    { id: "macros", label: "Macros", icon: Zap },
    { id: "escalation", label: "Escalation Rules", icon: ArrowUpCircle },
    { id: "assets", label: "Assets", icon: FolderOpen },
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
          <h1 className="text-3xl font-bold">Help Desk</h1>
          <p className="text-muted-foreground">SLA policies, canned responses, macros, and more</p>
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

        {activeTab === "sla" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewSla(true)}><Plus className="mr-2 h-4 w-4" /> New SLA Policy</Button>
            </div>
            {slas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No SLA policies yet.</p>
            ) : (
              <div className="space-y-3">
                {slas.map((s) => (
                  <BentoCard key={s.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{s.name}</h4>
                          {s.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">Response: {s.responseTime}m · Resolution: {s.resolutionTime}m</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleSla(s)}>
                        {s.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewSla} onClose={() => setShowNewSla(false)} title="New SLA Policy">
              <form onSubmit={createSla} className="space-y-3">
                <Input placeholder="Policy Name" value={slaForm.name} onChange={(e) => setSlaForm({ ...slaForm, name: e.target.value })} required />
                <Input placeholder="Response Time (minutes)" type="number" value={slaForm.responseTime} onChange={(e) => setSlaForm({ ...slaForm, responseTime: Number(e.target.value) })} required />
                <Input placeholder="Resolution Time (minutes)" type="number" value={slaForm.resolutionTime} onChange={(e) => setSlaForm({ ...slaForm, resolutionTime: Number(e.target.value) })} required />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <button type="button" onClick={() => setSlaForm({ ...slaForm, active: !slaForm.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${slaForm.active ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${slaForm.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create SLA Policy
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "canned" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewCanned(true)}><Plus className="mr-2 h-4 w-4" /> New Canned Response</Button>
            </div>
            {canned.length === 0 ? (
              <p className="text-sm text-muted-foreground">No canned responses yet.</p>
            ) : (
              <div className="space-y-3">
                {canned.map((c) => {
                  const shortcuts = typeof c.shortcuts === "string" ? c.shortcuts.split(",") : c.shortcuts;
                  return (
                    <BentoCard key={c.id}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{c.title}</h4>
                          <Badge variant="secondary">{c.category}</Badge>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {(Array.isArray(shortcuts) ? shortcuts : []).map((s: string) => (
                            <Badge key={s} variant="outline">{s.trim()}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {c.bodyHtml.length > 150 ? c.bodyHtml.slice(0, 150) + "..." : c.bodyHtml}
                        </p>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>
            )}
            <Modal open={showNewCanned} onClose={() => setShowNewCanned(false)} title="New Canned Response">
              <form onSubmit={createCanned} className="space-y-3">
                <Input placeholder="Title" value={cannedForm.title} onChange={(e) => setCannedForm({ ...cannedForm, title: e.target.value })} required />
                <Input placeholder="Category" value={cannedForm.category} onChange={(e) => setCannedForm({ ...cannedForm, category: e.target.value })} required />
                <Input placeholder="Shortcuts (comma separated, e.g. #thanks,#welcome)" value={cannedForm.shortcuts} onChange={(e) => setCannedForm({ ...cannedForm, shortcuts: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body HTML</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]" value={cannedForm.bodyHtml} onChange={(e) => setCannedForm({ ...cannedForm, bodyHtml: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Canned Response
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "macros" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewMacro(true)}><Plus className="mr-2 h-4 w-4" /> New Macro</Button>
            </div>
            {macros.length === 0 ? (
              <p className="text-sm text-muted-foreground">No macros yet.</p>
            ) : (
              <div className="space-y-3">
                {macros.map((m) => (
                  <BentoCard key={m.id}>
                    <div>
                      <h4 className="font-semibold">{m.name}</h4>
                      {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                      <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto max-w-lg">
                        {m.actions.length > 120 ? m.actions.slice(0, 120) + "..." : m.actions}
                      </pre>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewMacro} onClose={() => setShowNewMacro(false)} title="New Macro">
              <form onSubmit={createMacro} className="space-y-3">
                <Input placeholder="Macro Name" value={macroForm.name} onChange={(e) => setMacroForm({ ...macroForm, name: e.target.value })} required />
                <Input placeholder="Description" value={macroForm.description} onChange={(e) => setMacroForm({ ...macroForm, description: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Actions JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] font-mono" value={macroForm.actions} onChange={(e) => setMacroForm({ ...macroForm, actions: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Macro
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "escalation" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewEscalation(true)}><Plus className="mr-2 h-4 w-4" /> New Escalation Rule</Button>
            </div>
            {escalations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No escalation rules yet.</p>
            ) : (
              <div className="space-y-3">
                {escalations.map((e) => (
                  <BentoCard key={e.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{e.name}</h4>
                          <Badge variant="secondary">{e.triggerType}</Badge>
                          {e.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Conditions: <span className="font-mono">{e.conditions.length > 80 ? e.conditions.slice(0, 80) + "..." : e.conditions}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Actions: <span className="font-mono">{e.actions.length > 80 ? e.actions.slice(0, 80) + "..." : e.actions}</span>
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleEscalation(e)}>
                        {e.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewEscalation} onClose={() => setShowNewEscalation(false)} title="New Escalation Rule">
              <form onSubmit={createEscalation} className="space-y-3">
                <Input placeholder="Rule Name" value={escalationForm.name} onChange={(e) => setEscalationForm({ ...escalationForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Trigger Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={escalationForm.triggerType} onChange={(e) => setEscalationForm({ ...escalationForm, triggerType: e.target.value })}>
                    <option value="time">Time-based</option>
                    <option value="event">Event-based</option>
                    <option value="condition">Condition-based</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Conditions JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={escalationForm.conditions} onChange={(e) => setEscalationForm({ ...escalationForm, conditions: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Actions JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={escalationForm.actions} onChange={(e) => setEscalationForm({ ...escalationForm, actions: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <button type="button" onClick={() => setEscalationForm({ ...escalationForm, active: !escalationForm.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${escalationForm.active ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${escalationForm.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Escalation Rule
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewAsset(true)}><Plus className="mr-2 h-4 w-4" /> New Asset</Button>
            </div>
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets yet.</p>
            ) : (
              <div className="space-y-3">
                {assets.map((a) => (
                  <BentoCard key={a.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{a.name}</h4>
                          <Badge variant="secondary">{a.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {a.contact?.name && `Contact: ${a.contact.name}`}
                          {a.warrantyEnd && ` · Warranty: ${new Date(a.warrantyEnd).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewAsset} onClose={() => setShowNewAsset(false)} title="New Asset">
              <form onSubmit={createAsset} className="space-y-3">
                <Input placeholder="Asset Name" value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}>
                    <option value="document">Document</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input placeholder="Contact ID" type="number" value={assetForm.contactId} onChange={(e) => setAssetForm({ ...assetForm, contactId: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Asset
                </Button>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
