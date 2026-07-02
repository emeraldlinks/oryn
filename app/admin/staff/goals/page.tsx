"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Plus } from "lucide-react";

interface Goal {
  id: number;
  employeeId: number;
  title: string;
  type?: string;
  progress?: number;
  status: string;
}

const columns: Column<Goal>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (g) => `#${g.employeeId}` },
  { key: "title", label: "Title", sortable: true },
  { key: "type", label: "Type", render: (g) => g.type || "-" },
  { key: "progress", label: "Progress %", render: (g) => g.progress ?? "-" },
  { key: "status", label: "Status", render: (g) => <Badge>{g.status}</Badge> },
];

export default function GoalsPage() {
  const [data, setData] = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", title: "", description: "", type: "quarterly", startDate: "", targetDate: "", status: "active" });

  useEffect(() => {
    fetch("/api/admin/staff/goals").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), title: form.title, description: form.description || undefined, type: form.type, startDate: form.startDate || undefined, targetDate: form.targetDate || undefined, status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", title: "", description: "", type: "quarterly", startDate: "", targetDate: "", status: "active" });
      setData(await fetch("/api/admin/staff/goals").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goals</h1>
            <p className="text-muted-foreground">Manage employee goals</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Goal
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Active Goals" value={data.filter((g) => g.status === "active").length} icon={Target} />
          <StatCard title="Completed Goals" value={data.filter((g) => g.status === "completed").length} icon={Target} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="ongoing">Ongoing</option>
              </select>
              <Input placeholder="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <Input placeholder="Target Date" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <Button type="submit">Save Goal</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["title", "type", "status"]} />
      </div>
    </DashboardShell>
  );
}
