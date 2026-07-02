"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, Plus, Puzzle } from "lucide-react";

interface Department {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  parentId?: number;
}

const columns: Column<Department>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true, render: (d) => <Link href={`/admin/staff/departments/${d.id}`} className="text-primary hover:underline font-medium">{d.name}</Link> },
  { key: "description", label: "Description", render: (d) => d.description || "-" },
  { key: "parentId", label: "Parent ID", render: (d) => d.parentId ?? "-" },
  { key: "isActive", label: "Active", render: (d) => <Badge variant={d.isActive ? "default" : "secondary"}>{d.isActive ? "Yes" : "No"}</Badge> },
];

export default function DepartmentsPage() {
  const [data, setData] = useState<Department[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", parentId: "", isActive: "true" });

  useEffect(() => {
    fetch("/api/admin/staff/departments").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description, parentId: form.parentId ? Number(form.parentId) : undefined, isActive: form.isActive === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", description: "", parentId: "", isActive: "true" });
      setData(await fetch("/api/admin/staff/departments").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Manage staff departments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.href = "/admin/staff/departments/modules"}>
              <Puzzle className="mr-2 h-4 w-4" /> Manage Modules
            </Button>
            <Button onClick={() => setShowAdd(!showAdd)}>
              <Plus className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Departments" value={data.length} icon={Building2} />
          <StatCard title="Active Departments" value={data.filter((d) => d.isActive).length} icon={Building2} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Parent ID" type="number" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <Button type="submit">Save Department</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["name", "description"]} />
      </div>
    </DashboardShell>
  );
}
