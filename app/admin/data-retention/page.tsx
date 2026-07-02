"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Database, Plus, Trash2, Save, Loader2, X, Check } from "lucide-react";

interface Policy {
  id: number;
  entityType: string;
  retentionDays: number;
  action: string;
  active: boolean;
}

const ENTITY_TYPES = ["Contact", "Deal", "Activity", "Ticket", "Company", "Product", "Project", "Document", "Invoice", "Order"];

export default function DataRetentionPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ entityType: "Contact", retentionDays: 90, action: "delete" });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ retentionDays: 0, action: "delete", active: false });

  useEffect(() => { loadPolicies(); }, []);

  async function loadPolicies() {
    try {
      const res = await fetch("/api/admin/data-retention");
      if (res.ok) setPolicies(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function addPolicy() {
    setAdding(true);
    try {
      const res = await fetch("/api/admin/data-retention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPolicy),
      });
      if (res.ok) { toast.success("Policy added"); setShowAddForm(false); setNewPolicy({ entityType: "Contact", retentionDays: 90, action: "delete" }); loadPolicies(); }
      else toast.error("Failed to add policy");
    } catch { toast.error("Failed to add policy"); } finally { setAdding(false); }
  }

  async function updatePolicy(policy: Policy) {
    try {
      const res = await fetch(`/api/admin/data-retention?id=${policy.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });
      if (res.ok) { toast.success("Policy updated"); setEditingId(null); loadPolicies(); }
      else toast.error("Failed to update policy");
    } catch { toast.error("Failed to update policy"); }
  }

  async function deletePolicy(id: number) {
    try {
      const res = await fetch(`/api/admin/data-retention?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Policy deleted"); loadPolicies(); }
      else toast.error("Failed to delete policy");
    } catch { toast.error("Failed to delete policy"); }
  }

  function startEdit(p: Policy) {
    setEditingId(p.id);
    setEditValues({ retentionDays: p.retentionDays, action: p.action, active: p.active });
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Retention</h1>
            <p className="text-muted-foreground">Manage data retention policies per entity</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}><Plus className="mr-2 h-4 w-4" /> Add Policy</Button>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Entity Type</th>
                    <th className="text-left py-2 px-2 font-medium">Retention Days</th>
                    <th className="text-left py-2 px-2 font-medium">Action</th>
                    <th className="text-center py-2 px-2 font-medium">Active</th>
                    <th className="text-right py-2 pl-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                  ) : policies.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No policies configured.</td></tr>
                  ) : policies.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      {editingId === p.id ? (
                        <>
                          <td className="py-3 pr-4 font-medium">{p.entityType}</td>
                          <td className="py-3 px-2">
                            <Input type="number" value={editValues.retentionDays} onChange={(e) => setEditValues({ ...editValues, retentionDays: parseInt(e.target.value) || 0 })} className="w-24 h-8 text-sm" />
                          </td>
                          <td className="py-3 px-2">
                            <select className="flex h-8 rounded-lg border border-input bg-background px-2 py-1 text-sm" value={editValues.action} onChange={(e) => setEditValues({ ...editValues, action: e.target.value })}>
                              <option value="delete">Delete</option>
                              <option value="archive">Archive</option>
                            </select>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => setEditValues({ ...editValues, active: !editValues.active })}
                              className={`relative w-9 h-5 rounded-full transition-colors ${editValues.active ? "bg-primary" : "bg-muted"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editValues.active ? "translate-x-4" : ""}`} />
                            </button>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updatePolicy({ ...p, ...editValues })}><Check className="h-4 w-4 text-green-500" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 pr-4 font-medium">{p.entityType}</td>
                          <td className="py-3 px-2">{p.retentionDays} days</td>
                          <td className="py-3 px-2"><Badge variant={p.action === "delete" ? "destructive" : "secondary"}>{p.action}</Badge></td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => startEdit(p)}
                              className={`relative w-9 h-5 rounded-full transition-colors ${p.active ? "bg-primary" : "bg-muted"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.active ? "translate-x-4" : ""}`} />
                            </button>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(p)}><Save className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deletePolicy(p.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </BentoCard>

        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Retention Policy</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddForm(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Entity Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={newPolicy.entityType} onChange={(e) => setNewPolicy({ ...newPolicy, entityType: e.target.value })}>
                    {ENTITY_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Retention Days</label>
                  <Input type="number" value={newPolicy.retentionDays} onChange={(e) => setNewPolicy({ ...newPolicy, retentionDays: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Action</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={newPolicy.action} onChange={(e) => setNewPolicy({ ...newPolicy, action: e.target.value })}>
                    <option value="delete">Delete</option>
                    <option value="archive">Archive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button onClick={addPolicy} disabled={adding}>
                  {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
