"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, GripVertical, Plus, Trash2 } from "lucide-react";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/hiring/metrics")
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateMetric(id: number, field: string, value: any) {
    setMetrics((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  }

  async function saveMetrics() {
    setSaving(true);
    await fetch("/api/admin/hiring/metrics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metrics }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function resetDefaults() {
    await fetch("/api/admin/hiring/metrics/seed", { method: "POST" });
    const res = await fetch("/api/admin/hiring/metrics");
    const data = await res.json();
    setMetrics(data);
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
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scoring Metrics</h1>
            <p className="text-muted-foreground">Customize AI CV scoring criteria</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDefaults}>Reset Defaults</Button>
            <Button onClick={saveMetrics} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save"}
            </Button>
            {saved && <Badge variant="success">Saved</Badge>}
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          These metrics are used by the AI CV scanner to score candidates. Adjust weights and max scores to match your hiring priorities.
        </div>

        <div className="space-y-4">
          {metrics.map((m) => (
            <div key={m.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={m.enabled !== false} onChange={(e) => updateMetric(m.id, "enabled", e.target.checked)} className="rounded" />
                    <span className="font-medium">{m.name}</span>
                    <Badge variant="outline" className="text-xs">{m.category}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Max Score</label>
                    <Input type="number" value={m.maxScore} onChange={(e) => updateMetric(m.id, "maxScore", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Weight (%)</label>
                    <Input type="number" value={m.weight} onChange={(e) => updateMetric(m.id, "weight", Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
