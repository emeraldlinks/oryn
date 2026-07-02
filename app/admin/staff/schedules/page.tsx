"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";

interface Schedule {
  id: number;
  employeeId: number;
  shiftId: number;
  startDate: string;
  endDate?: string;
  isRecurring: boolean;
}

const columns: Column<Schedule>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee ID", render: (s) => `#${s.employeeId}` },
  { key: "shiftId", label: "Shift ID", render: (s) => `#${s.shiftId}` },
  { key: "startDate", label: "Start", render: (s) => new Date(s.startDate).toLocaleDateString() },
  { key: "endDate", label: "End", render: (s) => s.endDate ? new Date(s.endDate).toLocaleDateString() : "-" },
  { key: "isRecurring", label: "Recurring", render: (s) => <Badge variant={s.isRecurring ? "default" : "secondary"}>{s.isRecurring ? "Yes" : "No"}</Badge> },
];

export default function SchedulesPage() {
  const [data, setData] = useState<Schedule[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", shiftId: "", startDate: "", endDate: "", isRecurring: "false" });

  useEffect(() => {
    fetch("/api/admin/staff/schedules").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), shiftId: Number(form.shiftId), startDate: form.startDate, endDate: form.endDate || undefined, isRecurring: form.isRecurring === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", shiftId: "", startDate: "", endDate: "", isRecurring: "false" });
      setData(await fetch("/api/admin/staff/schedules").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schedules</h1>
            <p className="text-muted-foreground">Manage staff schedules</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Schedule
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Schedules" value={data.length} icon={Calendar} />
          <StatCard title="Recurring Schedules" value={data.filter((s) => s.isRecurring).length} icon={Calendar} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Shift ID" type="number" value={form.shiftId} onChange={(e) => setForm({ ...form, shiftId: e.target.value })} required />
              <Input placeholder="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              <Input placeholder="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isRecurring === "true"} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked ? "true" : "false" })} />
                Recurring
              </label>
            </div>
            <Button type="submit">Save Schedule</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId"]} />
      </div>
    </DashboardShell>
  );
}
