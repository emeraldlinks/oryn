"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus } from "lucide-react";

interface ComplianceItem {
  id: number;
  name: string;
  description?: string;
  category?: string;
  frequency?: string;
  isMandatory: boolean;
}

const columns: Column<ComplianceItem>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", render: (c) => c.description || "-" },
  { key: "category", label: "Category", render: (c) => c.category || "-" },
  { key: "frequency", label: "Frequency", render: (c) => c.frequency || "-" },
  { key: "isMandatory", label: "Mandatory", render: (c) => <Badge variant={c.isMandatory ? "default" : "secondary"}>{c.isMandatory ? "Yes" : "No"}</Badge> },
];

export default function CompliancePage() {
  const [data, setData] = useState<ComplianceItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "training", frequency: "", isMandatory: "false" });

  useEffect(() => {
    fetch("/api/admin/staff/compliance").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description || undefined, category: form.category, frequency: form.frequency || undefined, isMandatory: form.isMandatory === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", description: "", category: "training", frequency: "", isMandatory: "false" });
      setData(await fetch("/api/admin/staff/compliance").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Compliance</h1>
            <p className="text-muted-foreground">Manage compliance items</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Items" value={data.length} icon={Shield} />
          <StatCard title="Mandatory Items" value={data.filter((c) => c.isMandatory).length} icon={Shield} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="training">Training</option>
                <option value="certification">Certification</option>
                <option value="policy">Policy</option>
                <option value="legal">Legal</option>
                <option value="safety">Safety</option>
              </select>
              <Input placeholder="Frequency (e.g. yearly)" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isMandatory === "true"} onChange={(e) => setForm({ ...form, isMandatory: e.target.checked ? "true" : "false" })} />
                Mandatory
              </label>
            </div>
            <Button type="submit">Save Item</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["name", "category"]} />
      </div>
    </DashboardShell>
  );
}
