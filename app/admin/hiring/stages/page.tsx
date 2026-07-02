"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, GripVertical, ArrowUpDown } from "lucide-react";

export default function HiringStagesPage() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "custom" });

  function load() {
    setLoading(true);
    fetch("/api/admin/hiring/stages")
      .then((r) => r.json())
      .then(setStages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function createStage(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/hiring/stages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: stages.length }),
    });
    setShowForm(false);
    setForm({ name: "", description: "", type: "custom" });
    load();
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
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hiring Stages</h1>
            <p className="text-muted-foreground">Configure your hiring pipeline stages</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Stage</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Stage</DialogTitle></DialogHeader>
              <form onSubmit={createStage} className="space-y-4">
                <Input placeholder="Stage name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                <Input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="shortlist">Shortlist</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                  <option value="custom">Custom</option>
                </select>
                <Button type="submit" className="w-full">Add Stage</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
              <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  <Badge variant="outline" className="text-xs">{s.type}</Badge>
                  {s.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                </div>
                {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
              </div>
              <span className="text-xs text-muted-foreground">Order: {s.sortOrder}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
