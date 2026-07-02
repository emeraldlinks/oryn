"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Plus } from "lucide-react";

interface InventoryCategory {
  id: number; name: string; slug: string; parentId?: number; sortOrder: number; isActive: boolean;
}

const columns: Column<InventoryCategory>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
  { key: "parentId", label: "Parent ID", render: (c) => c.parentId ?? "-" },
  { key: "sortOrder", label: "Sort Order", sortable: true },
  { key: "isActive", label: "Active", render: (c) => <Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "Yes" : "No"}</Badge> },
];

export default function CategoriesPage() {
  const [data, setData] = useState<InventoryCategory[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", parentId: "", sortOrder: "0", isActive: true });

  useEffect(() => { fetch("/api/admin/inventory/categories").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, slug: form.slug, description: form.description || undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
        sortOrder: Number(form.sortOrder), isActive: form.isActive,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", slug: "", description: "", parentId: "", sortOrder: "0", isActive: true });
      setData(await fetch("/api/admin/inventory/categories").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Categories</h1><p className="text-muted-foreground">Organize inventory items</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Categories" value={data.length} icon={FolderTree} />
          <StatCard title="Active Categories" value={data.filter((c) => c.isActive).length} icon={FolderTree} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Parent ID" type="number" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} />
              <Input placeholder="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Category</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "slug"]} />
      </div>
    </DashboardShell>
  );
}
