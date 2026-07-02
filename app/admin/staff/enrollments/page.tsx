"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from "lucide-react";

interface Enrollment {
  id: number;
  employeeId: number;
  courseId: number;
  enrolledAt?: string;
  status: string;
  completedAt?: string;
  score?: number;
  certificateUrl?: string;
}

const columns: Column<Enrollment>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (e) => `#${e.employeeId}` },
  { key: "courseId", label: "Course", render: (e) => `#${e.courseId}` },
  { key: "status", label: "Status", render: (e) => <Badge>{e.status}</Badge> },
  { key: "score", label: "Score", render: (e) => e.score != null ? `${e.score}%` : "-" },
  { key: "enrolledAt", label: "Enrolled", render: (e) => e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "-" },
  { key: "completedAt", label: "Completed", render: (e) => e.completedAt ? new Date(e.completedAt).toLocaleDateString() : "-" },
];

export default function EnrollmentsPage() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", courseId: "", status: "enrolled" });

  useEffect(() => {
    fetch("/api/admin/staff/enrollments").then((r) => r.json()).then(setData);
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: Number(form.employeeId),
        courseId: Number(form.courseId),
        status: form.status,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", courseId: "", status: "enrolled" });
      setData(await fetch("/api/admin/staff/enrollments").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Training Enrollments</h1>
            <p className="text-muted-foreground">Manage employee course enrollments</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Enroll Employee</Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Enrollments" value={data.length} icon={BookOpen} />
          <StatCard title="Active" value={data.filter((e) => e.status === "enrolled" || e.status === "in-progress").length} icon={BookOpen} />
          <StatCard title="Completed" value={data.filter((e) => e.status === "completed").length} icon={BookOpen} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addItem} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Course ID" type="number" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="enrolled">Enrolled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <Button type="submit">Save Enrollment</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["status"]} />
      </div>
    </DashboardShell>
  );
}
