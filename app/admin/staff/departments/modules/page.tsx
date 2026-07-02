"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Puzzle, Plus, Loader2 } from "lucide-react";

interface DeptModule {
  id: number;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  category: string;
  href?: string;
  isActive: boolean;
  sortOrder: number;
}

const columns: Column<DeptModule>[] = [
  { key: "key", label: "Key", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "description", label: "Description", render: (m) => m.description || "-" },
  { key: "href", label: "Path", render: (m) => m.href || "-" },
  { key: "isActive", label: "Active", render: (m) => <Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Yes" : "No"}</Badge> },
];

export default function DeptModulesPage() {
  const [data, setData] = useState<DeptModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ key: "", name: "", description: "", category: "", icon: "", href: "", sortOrder: "0" });

  useEffect(() => {
    fetch("/api/admin/staff/department-modules")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/department-modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    if (res.ok) {
      toast.success("Module created");
      setShowAdd(false);
      setForm({ key: "", name: "", description: "", category: "", icon: "", href: "", sortOrder: "0" });
      setData(await fetch("/api/admin/staff/department-modules").then((r) => r.json()));
    } else {
      toast.error("Failed to create module");
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const categories = [...new Set(data.map((m) => m.category))].sort();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Department Modules</h1>
            <p className="text-muted-foreground">Configure available modules for department assignment</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Module
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Modules" value={data.length} icon={Puzzle} />
          <StatCard title="Categories" value={categories.length} icon={Puzzle} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Key (e.g. hr-employees)" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required />
              <Input placeholder="Name (e.g. Employees)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Category (e.g. HR)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <Input placeholder="Icon name (e.g. Users)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              <Input placeholder="Route path (e.g. /admin/staff)" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
              <Input placeholder="Sort order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button type="submit">Save Module</Button>
          </form>
        )}

        <div className="space-y-6">
          {categories.map((cat) => {
            const catModules = data.filter((m) => m.category === cat);
            return (
              <div key={cat}>
                <h3 className="text-lg font-semibold capitalize mb-3">{cat} ({catModules.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {catModules.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg border hover:bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={m.isActive ? "default" : "secondary"} className="text-[10px]">{m.isActive ? "active" : "inactive"}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{m.key}</span>
                      </div>
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.description && <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>}
                      {m.href && <p className="text-[10px] text-muted-foreground mt-1 font-mono">{m.href}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <DataTable columns={columns} data={data} searchKeys={["name", "key", "category"]} />
      </div>
    </DashboardShell>
  );
}
