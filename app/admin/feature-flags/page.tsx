"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Flag, Plus, Trash2, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feature-flags");
      if (res.ok) setFlags(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function addFlag() {
    if (!newKey) return;
    try {
      const res = await fetch("/api/admin/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey, description: newDesc }),
      });
      if (res.ok) {
        toast.success("Feature flag added");
        setNewKey("");
        setNewDesc("");
        load();
      }
    } catch {}
  }

  async function toggleFlag(flag: any) {
    try {
      await fetch("/api/admin/feature-flags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: flag.id, key: flag.key, enabled: !flag.enabled, description: flag.description }),
      });
      load();
    } catch {}
  }

  async function deleteFlag(id: number) {
    try {
      await fetch(`/api/admin/feature-flags?id=${id}`, { method: "DELETE" });
      toast.success("Flag deleted");
      load();
    } catch {}
  }

  return (
    <DashboardShell title="Feature Flags" icon={Flag} description="Manage feature flags for your workspace">
      <BentoCard title="Add Flag" icon={Plus}>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Flag Key</label>
            <Input placeholder="e.g. advanced-analytics" value={newKey} onChange={e => setNewKey(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Input placeholder="What does this flag do?" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          </div>
          <Button onClick={addFlag}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </BentoCard>

      <BentoCard title="All Flags" icon={Flag}>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
        ) : flags.length === 0 ? (
          <p className="text-muted-foreground">No feature flags yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Key</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flags.map(f => (
                <tr key={f.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-sm">{f.key}</td>
                  <td className="py-3 text-muted-foreground">{f.description || "-"}</td>
                  <td className="py-3">
                    <Badge variant={f.enabled ? "default" : "secondary"}>{f.enabled ? "Enabled" : "Disabled"}</Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleFlag(f)}>
                        {f.enabled ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteFlag(f.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </BentoCard>
    </DashboardShell>
  );
}
