"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus } from "lucide-react";

interface Disciplinary {
  id: number;
  employeeId: number;
  type: string;
  description?: string;
  date: string;
  severity: string;
  status: string;
}

const columns: Column<Disciplinary>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (d) => `#${d.employeeId}` },
  { key: "type", label: "Type", render: (d) => <Badge>{d.type}</Badge> },
  { key: "description", label: "Description", render: (d) => d.description || "-" },
  { key: "date", label: "Date", render: (d) => new Date(d.date).toLocaleDateString() },
  { key: "severity", label: "Severity", render: (d) => <Badge>{d.severity}</Badge> },
  { key: "status", label: "Status", render: (d) => <Badge variant={d.status === "open" ? "destructive" : "default"}>{d.status}</Badge> },
];

export default function DisciplinaryPage() {
  const [data, setData] = useState<Disciplinary[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", type: "verbal-warning", description: "", date: "", severity: "minor", status: "open", resolutionNotes: "" });

  useEffect(() => {
    fetch("/api/admin/staff/disciplinary").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/disciplinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), type: form.type, description: form.description || undefined, date: form.date, severity: form.severity, status: form.status, resolutionNotes: form.resolutionNotes || undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", type: "verbal-warning", description: "", date: "", severity: "minor", status: "open", resolutionNotes: "" });
      setData(await fetch("/api/admin/staff/disciplinary").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Disciplinary Actions</h1>
            <p className="text-muted-foreground">Manage disciplinary actions</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Action
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Actions" value={data.length} icon={AlertTriangle} />
          <StatCard title="Open Cases" value={data.filter((d) => d.status === "open").length} icon={AlertTriangle} />
          <StatCard title="Resolved" value={data.filter((d) => d.status === "resolved").length} icon={AlertTriangle} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="verbal-warning">Verbal Warning</option>
                <option value="written-warning">Written Warning</option>
                <option value="suspension">Suspension</option>
                <option value="termination">Termination</option>
              </select>
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
              <Input placeholder="Resolution Notes" value={form.resolutionNotes} onChange={(e) => setForm({ ...form, resolutionNotes: e.target.value })} />
            </div>
            <Button type="submit">Save Action</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["type", "severity", "status"]} />
      </div>
    </DashboardShell>
  );
}
