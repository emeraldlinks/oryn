"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus } from "lucide-react";

interface Position {
  id: number;
  title: string;
  departmentId?: number;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
}

const columns: Column<Position>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "departmentId", label: "Dept ID", render: (p) => p.departmentId ?? "-" },
  { key: "salaryMin", label: "Salary Min", render: (p) => p.salaryMin ? `$${p.salaryMin.toLocaleString()}` : "-" },
  { key: "salaryMax", label: "Salary Max", render: (p) => p.salaryMax ? `$${p.salaryMax.toLocaleString()}` : "-" },
  { key: "isActive", label: "Active", render: (p) => <Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? "Yes" : "No"}</Badge> },
];

export default function PositionsPage() {
  const [data, setData] = useState<Position[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", departmentId: "", salaryMin: "", salaryMax: "", isActive: "true" });

  useEffect(() => {
    fetch("/api/admin/staff/positions").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, departmentId: form.departmentId ? Number(form.departmentId) : undefined, salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined, salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined, isActive: form.isActive === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ title: "", departmentId: "", salaryMin: "", salaryMax: "", isActive: "true" });
      setData(await fetch("/api/admin/staff/positions").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Positions</h1>
            <p className="text-muted-foreground">Manage staff positions</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Position
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Positions" value={data.length} icon={Briefcase} />
          <StatCard title="Active Positions" value={data.filter((p) => p.isActive).length} icon={Briefcase} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Department ID" type="number" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} />
              <Input placeholder="Salary Min" type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
              <Input placeholder="Salary Max" type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <Button type="submit">Save Position</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["title"]} />
      </div>
    </DashboardShell>
  );
}
