"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
import Link from "next/link";

interface InventoryItem {
  id: number; name: string; sku: string; categoryId?: number; brandId?: number;
  price: number; cost?: number; isActive: boolean;
}

const columns: Column<InventoryItem>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true, render: (i) => <Link href={`/admin/inventory/items/${i.id}`} className="hover:underline text-primary">{i.name}</Link> },
  { key: "sku", label: "SKU", sortable: true },
  { key: "categoryId", label: "Category ID", render: (i) => i.categoryId ?? "-" },
  { key: "brandId", label: "Brand ID", render: (i) => i.brandId ?? "-" },
  { key: "price", label: "Price", sortable: true, render: (i) => `$${i.price.toFixed(2)}` },
  { key: "cost", label: "Cost", render: (i) => i.cost ? `$${i.cost.toFixed(2)}` : "-" },
  { key: "isActive", label: "Active", render: (i) => <Badge variant={i.isActive ? "default" : "secondary"}>{i.isActive ? "Yes" : "No"}</Badge> },
];

export default function ItemsPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", sku: "", barcode: "", description: "", categoryId: "", brandId: "", unit: "",
    price: "", cost: "", trackStock: true, trackSerial: false, trackBatch: false,
    minStock: "", maxStock: "", isActive: true,
  });

  useEffect(() => { fetch("/api/admin/inventory/items").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/items", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, sku: form.sku, barcode: form.barcode || undefined,
        description: form.description || undefined, categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        brandId: form.brandId ? Number(form.brandId) : undefined, unit: form.unit || undefined,
        price: Number(form.price), cost: form.cost ? Number(form.cost) : undefined,
        trackStock: form.trackStock, trackSerial: form.trackSerial, trackBatch: form.trackBatch,
        minStock: form.minStock ? Number(form.minStock) : undefined, maxStock: form.maxStock ? Number(form.maxStock) : undefined,
        isActive: form.isActive,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", sku: "", barcode: "", description: "", categoryId: "", brandId: "", unit: "", price: "", cost: "", trackStock: true, trackSerial: false, trackBatch: false, minStock: "", maxStock: "", isActive: true });
      setData(await fetch("/api/admin/inventory/items").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Items</h1><p className="text-muted-foreground">Manage inventory items</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Items" value={data.length} icon={Package} />
          <StatCard title="Active Items" value={data.filter((i) => i.isActive).length} icon={Package} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              <Input placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Category ID" type="number" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
              <Input placeholder="Brand ID" type="number" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} />
              <Input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <Input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input placeholder="Cost" type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              <Input placeholder="Min Stock" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              <Input placeholder="Max Stock" type="number" value={form.maxStock} onChange={(e) => setForm({ ...form, maxStock: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trackStock} onChange={(e) => setForm({ ...form, trackStock: e.target.checked })} /> Track Stock</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trackSerial} onChange={(e) => setForm({ ...form, trackSerial: e.target.checked })} /> Track Serial</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trackBatch} onChange={(e) => setForm({ ...form, trackBatch: e.target.checked })} /> Track Batch</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Item</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "sku"]} />
      </div>
    </DashboardShell>
  );
}
