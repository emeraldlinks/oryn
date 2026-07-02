"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, Plus } from "lucide-react";

interface InventoryBrand {
  id: number; name: string; slug: string; website?: string; isActive: boolean;
}

const columns: Column<InventoryBrand>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
  { key: "website", label: "Website", render: (b) => b.website ? <a href={b.website} target="_blank" className="hover:underline text-primary">{b.website}</a> : "-" },
  { key: "isActive", label: "Active", render: (b) => <Badge variant={b.isActive ? "default" : "secondary"}>{b.isActive ? "Yes" : "No"}</Badge> },
];

export default function BrandsPage() {
  const [data, setData] = useState<InventoryBrand[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", logoUrl: "", website: "", isActive: true });

  useEffect(() => { fetch("/api/admin/inventory/brands").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/brands", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, slug: form.slug, description: form.description || undefined,
        logoUrl: form.logoUrl || undefined, website: form.website || undefined, isActive: form.isActive,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", slug: "", description: "", logoUrl: "", website: "", isActive: true });
      setData(await fetch("/api/admin/inventory/brands").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Brands</h1><p className="text-muted-foreground">Manage product brands</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Brand</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Brands" value={data.length} icon={Tag} />
          <StatCard title="Active Brands" value={data.filter((b) => b.isActive).length} icon={Tag} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
              <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Brand</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "slug"]} />
      </div>
    </DashboardShell>
  );
}
