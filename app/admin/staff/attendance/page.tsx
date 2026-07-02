"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Plus } from "lucide-react";

interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  status: string;
  clockIn?: string;
  clockOut?: string;
  lateMinutes?: number;
  isExcused: boolean;
  reason?: string;
}

const columns: Column<Attendance>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (a) => `#${a.employeeId}` },
  { key: "date", label: "Date", render: (a) => new Date(a.date).toLocaleDateString() },
  { key: "status", label: "Status", render: (a) => <Badge>{a.status}</Badge> },
  { key: "clockIn", label: "Clock In", render: (a) => a.clockIn || "-" },
  { key: "clockOut", label: "Clock Out", render: (a) => a.clockOut || "-" },
  { key: "lateMinutes", label: "Late (min)", render: (a) => a.lateMinutes ?? "-" },
  { key: "isExcused", label: "Excused", render: (a) => <Badge variant={a.isExcused ? "default" : "secondary"}>{a.isExcused ? "Yes" : "No"}</Badge> },
];

export default function AttendancePage() {
  const [data, setData] = useState<Attendance[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", date: "", status: "present", clockIn: "", clockOut: "", isExcused: "false", reason: "" });

  useEffect(() => {
    fetch("/api/admin/staff/attendance").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), date: form.date, status: form.status, clockIn: form.clockIn || undefined, clockOut: form.clockOut || undefined, isExcused: form.isExcused === "true", reason: form.reason || undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", date: "", status: "present", clockIn: "", clockOut: "", isExcused: "false", reason: "" });
      setData(await fetch("/api/admin/staff/attendance").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Track staff attendance</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Record
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Today Present" value="-" icon={CalendarCheck} />
          <StatCard title="Late" value="-" icon={CalendarCheck} />
          <StatCard title="Absent" value="-" icon={CalendarCheck} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
                <option value="wfh">WFH</option>
              </select>
              <Input placeholder="Clock In" type="time" value={form.clockIn} onChange={(e) => setForm({ ...form, clockIn: e.target.value })} />
              <Input placeholder="Clock Out" type="time" value={form.clockOut} onChange={(e) => setForm({ ...form, clockOut: e.target.value })} />
              <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isExcused === "true"} onChange={(e) => setForm({ ...form, isExcused: e.target.checked ? "true" : "false" })} />
                Excused
              </label>
            </div>
            <Button type="submit">Save Record</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId", "status"]} />
      </div>
    </DashboardShell>
  );
}
