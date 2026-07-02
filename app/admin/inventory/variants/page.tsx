"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Plus } from "lucide-react";

interface InventoryVariant {
  id: number; itemId: number; name: string; sku: string; price: number; attributes?: string; isActive: boolean;
}

const columns: Column<InventoryVariant>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "sku", label: "SKU", sortable: true },
  { key: "price", label: "Price", sortable: true, render: (v) => `$${v.price.toFixed(2)}` },
  { key: "isActive", label: "Active", render: (v) => <Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Yes" : "No"}</Badge> },
];

export default function VariantsPage() {
  const [data, setData] = useState<InventoryVariant[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemId: "", name: "", sku: "", price: "", attributes: "", isActive: true });

  useEffect(() => { fetch("/api/admin/inventory/variants").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/variants", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.itemId), name: form.name, sku: form.sku, price: Number(form.price),
        attributes: form.attributes ? JSON.parse(form.attributes) : undefined, isActive: form.isActive,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ itemId: "", name: "", sku: "", price: "", attributes: "", isActive: true });
      setData(await fetch("/api/admin/inventory/variants").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Variants</h1><p className="text-muted-foreground">Item variations</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Variant</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Variants" value={data.length} icon={GitBranch} />
          <StatCard title="Active Variants" value={data.filter((v) => v.isActive).length} icon={GitBranch} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Item ID" type="number" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              <Input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input placeholder="Attributes (JSON)" value={form.attributes} onChange={(e) => setForm({ ...form, attributes: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Variant</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "sku"]} />
      </div>
    </DashboardShell>
  );
}
