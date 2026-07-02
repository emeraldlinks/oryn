"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus } from "lucide-react";

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration?: number;
  isActive: boolean;
}

const columns: Column<Shift>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "startTime", label: "Start" },
  { key: "endTime", label: "End" },
  { key: "breakDuration", label: "Break (min)", render: (s) => s.breakDuration ?? "-" },
  { key: "isActive", label: "Active", render: (s) => <Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? "Yes" : "No"}</Badge> },
];

export default function ShiftsPage() {
  const [data, setData] = useState<Shift[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", startTime: "", endTime: "", breakDuration: "", isActive: "true" });

  useEffect(() => {
    fetch("/api/admin/staff/shifts").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, startTime: form.startTime, endTime: form.endTime, breakDuration: form.breakDuration ? Number(form.breakDuration) : undefined, isActive: form.isActive === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", startTime: "", endTime: "", breakDuration: "", isActive: "true" });
      setData(await fetch("/api/admin/staff/shifts").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shifts</h1>
            <p className="text-muted-foreground">Manage staff shifts</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Shift
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Shifts" value={data.length} icon={Clock} />
          <StatCard title="Active Shifts" value={data.filter((s) => s.isActive).length} icon={Clock} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Start Time (HH:mm)" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              <Input placeholder="End Time (HH:mm)" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              <Input placeholder="Break Duration (min)" type="number" value={form.breakDuration} onChange={(e) => setForm({ ...form, breakDuration: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <Button type="submit">Save Shift</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["name"]} />
      </div>
    </DashboardShell>
  );
}
