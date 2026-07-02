"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarOff, Plus } from "lucide-react";

interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveTypeId?: number;
  startDate: string;
  endDate: string;
  totalDays?: number;
  status: string;
}

const columns: Column<LeaveRequest>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (l) => `#${l.employeeId}` },
  { key: "leaveTypeId", label: "Leave Type", render: (l) => l.leaveTypeId ?? "-" },
  { key: "startDate", label: "Start", render: (l) => new Date(l.startDate).toLocaleDateString() },
  { key: "endDate", label: "End", render: (l) => new Date(l.endDate).toLocaleDateString() },
  { key: "totalDays", label: "Days", render: (l) => l.totalDays ?? "-" },
  { key: "status", label: "Status", render: (l) => <Badge>{l.status}</Badge> },
];

export default function LeavePage() {
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "", status: "pending" });

  useEffect(() => {
    fetch("/api/admin/staff/leave").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), leaveTypeId: form.leaveTypeId ? Number(form.leaveTypeId) : undefined, startDate: form.startDate, endDate: form.endDate, reason: form.reason || undefined, status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "", status: "pending" });
      setData(await fetch("/api/admin/staff/leave").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <p className="text-muted-foreground">Manage staff leave requests</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Request
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Requests" value={data.length} icon={CalendarOff} />
          <StatCard title="Pending" value={data.filter((l) => l.status === "pending").length} icon={CalendarOff} />
          <StatCard title="Approved" value={data.filter((l) => l.status === "approved").length} icon={CalendarOff} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Leave Type ID" type="number" value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })} />
              <Input placeholder="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              <Input placeholder="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <Button type="submit">Save Request</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId", "status"]} />
      </div>
    </DashboardShell>
  );
}
