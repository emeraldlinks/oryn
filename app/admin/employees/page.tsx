"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Building2, Plus } from "lucide-react";

interface Employee {
  id: number;
  userId: number;
  branchId?: number;
  departmentId?: number;
  department?: { id: number; name: string };
  jobTitle?: string;
  salary?: number;
  startDate?: string;
}

const columns: Column<Employee>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "userId", label: "User ID", render: (e) => `#${e.userId}` },
  { key: "jobTitle", label: "Title", sortable: true, render: (e) => e.jobTitle || "-" },
  { key: "departmentId", label: "Department", sortable: true, render: (e) => e.department?.name || (e.departmentId ? `#${e.departmentId}` : "-") },
  { key: "branchId", label: "Branch", render: (e) => e.branchId ? `#${e.branchId}` : "-" },
  { key: "salary", label: "Salary", render: (e) => e.salary ? `$${e.salary.toLocaleString()}` : "-" },
  { key: "startDate", label: "Started", render: (e) => e.startDate ? new Date(e.startDate).toLocaleDateString() : "-" },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: "", branchId: "", departmentId: "", jobTitle: "", salary: "" });

  useEffect(() => {
    fetch("/api/employees").then((r) => r.json()).then(setEmployees);
  }, []);

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(form.userId),
        branchId: form.branchId ? Number(form.branchId) : undefined,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        jobTitle: form.jobTitle,
        salary: form.salary ? Number(form.salary) : undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ userId: "", branchId: "", departmentId: "", jobTitle: "", salary: "" });
      setEmployees(await fetch("/api/employees").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your team</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Employees" value={employees.length} icon={Users} />
          <StatCard title="Departments" value={new Set(employees.map((e) => e.departmentId)).size} icon={Building2} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addEmployee} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="User ID" type="number" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
              <Input placeholder="Branch ID" type="number" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} />
              <Input placeholder="Department ID" type="number" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} />
              <Input placeholder="Job Title" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
              <Input placeholder="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
            <Button type="submit">Save Employee</Button>
          </form>
        )}

        <DataTable columns={columns} data={employees} searchKeys={["jobTitle"]} />
      </div>
    </DashboardShell>
  );
}
