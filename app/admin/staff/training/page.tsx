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

interface Course {
  id: number;
  title: string;
  provider?: string;
  duration?: string;
  cost?: number;
  certificationOffered: boolean;
  isMandatory: boolean;
  status: string;
}

const columns: Column<Course>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "provider", label: "Provider", render: (c) => c.provider || "-" },
  { key: "duration", label: "Duration", render: (c) => c.duration || "-" },
  { key: "cost", label: "Cost", render: (c) => c.cost ? `$${c.cost}` : "-" },
  { key: "certificationOffered", label: "Certification", render: (c) => <Badge variant={c.certificationOffered ? "default" : "secondary"}>{c.certificationOffered ? "Yes" : "No"}</Badge> },
  { key: "isMandatory", label: "Mandatory", render: (c) => <Badge variant={c.isMandatory ? "default" : "secondary"}>{c.isMandatory ? "Yes" : "No"}</Badge> },
  { key: "status", label: "Status", render: (c) => <Badge>{c.status}</Badge> },
];

export default function TrainingPage() {
  const [data, setData] = useState<Course[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", provider: "", duration: "", cost: "", certificationOffered: "false", isMandatory: "false", status: "active" });

  useEffect(() => {
    fetch("/api/admin/staff/training").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, description: form.description || undefined, provider: form.provider || undefined, duration: form.duration || undefined, cost: form.cost ? Number(form.cost) : undefined, certificationOffered: form.certificationOffered === "true", isMandatory: form.isMandatory === "true", status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ title: "", description: "", provider: "", duration: "", cost: "", certificationOffered: "false", isMandatory: "false", status: "active" });
      setData(await fetch("/api/admin/staff/training").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Training Courses</h1>
            <p className="text-muted-foreground">Manage training courses</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Courses" value={data.length} icon={BookOpen} />
          <StatCard title="Mandatory Courses" value={data.filter((c) => c.isMandatory).length} icon={BookOpen} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Provider" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
              <Input placeholder="Duration (e.g. 2h)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              <Input placeholder="Cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.certificationOffered === "true"} onChange={(e) => setForm({ ...form, certificationOffered: e.target.checked ? "true" : "false" })} />
                Certification Offered
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isMandatory === "true"} onChange={(e) => setForm({ ...form, isMandatory: e.target.checked ? "true" : "false" })} />
                Mandatory
              </label>
            </div>
            <Button type="submit">Save Course</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["title", "provider"]} />
      </div>
    </DashboardShell>
  );
}
