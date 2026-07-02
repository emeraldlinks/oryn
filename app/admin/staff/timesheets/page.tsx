"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";

interface Timesheet {
  id: number;
  employeeId: number;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours?: number;
  overtimeHours?: number;
  status: string;
}

const columns: Column<Timesheet>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (t) => `#${t.employeeId}` },
  { key: "date", label: "Date", render: (t) => new Date(t.date).toLocaleDateString() },
  { key: "clockIn", label: "Clock In" },
  { key: "clockOut", label: "Clock Out" },
  { key: "totalHours", label: "Hours", render: (t) => t.totalHours ?? "-" },
  { key: "overtimeHours", label: "Overtime", render: (t) => t.overtimeHours ?? "-" },
  { key: "status", label: "Status", render: (t) => <Badge>{t.status}</Badge> },
];

export default function TimesheetsPage() {
  const [data, setData] = useState<Timesheet[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", date: "", clockIn: "", clockOut: "", breakDuration: "", status: "draft" });

  useEffect(() => {
    fetch("/api/admin/staff/timesheets").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), date: form.date, clockIn: form.clockIn, clockOut: form.clockOut, breakDuration: form.breakDuration ? Number(form.breakDuration) : undefined, status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", date: "", clockIn: "", clockOut: "", breakDuration: "", status: "draft" });
      setData(await fetch("/api/admin/staff/timesheets").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timesheets</h1>
            <p className="text-muted-foreground">Manage timesheet entries</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Entry
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Entries" value={data.length} icon={FileText} />
          <StatCard title="Pending Approval" value={data.filter((t) => t.status === "pending").length} icon={FileText} />
          <StatCard title="Overtime Hours" value={data.reduce((a, t) => a + (t.overtimeHours || 0), 0)} icon={FileText} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <Input placeholder="Clock In" type="time" value={form.clockIn} onChange={(e) => setForm({ ...form, clockIn: e.target.value })} />
              <Input placeholder="Clock Out" type="time" value={form.clockOut} onChange={(e) => setForm({ ...form, clockOut: e.target.value })} />
              <Input placeholder="Break (min)" type="number" value={form.breakDuration} onChange={(e) => setForm({ ...form, breakDuration: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button type="submit">Save Entry</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId", "status"]} />
      </div>
    </DashboardShell>
  );
}
