"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus } from "lucide-react";

interface InventoryStock {
  id: number; itemId: number; warehouseId: number; quantity: number;
  reservedQuantity: number; availableQuantity: number; location?: string;
}

const columns: Column<InventoryStock>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "warehouseId", label: "Warehouse ID", sortable: true },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "reservedQuantity", label: "Reserved", sortable: true },
  { key: "availableQuantity", label: "Available", sortable: true, render: (s) => <Badge variant={s.availableQuantity <= 0 ? "destructive" : s.availableQuantity <= 5 ? "warning" : "default"}>{s.availableQuantity}</Badge> },
  { key: "location", label: "Location", render: (s) => s.location || "-" },
];

export default function StockPage() {
  const [data, setData] = useState<InventoryStock[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemId: "", warehouseId: "", quantity: "", reservedQuantity: "0", location: "", bin: "", shelf: "" });

  useEffect(() => { fetch("/api/admin/inventory/stock").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/stock", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.itemId), warehouseId: Number(form.warehouseId),
        quantity: Number(form.quantity), reservedQuantity: Number(form.reservedQuantity),
        location: form.location || undefined, bin: form.bin || undefined, shelf: form.shelf || undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ itemId: "", warehouseId: "", quantity: "", reservedQuantity: "0", location: "", bin: "", shelf: "" });
      setData(await fetch("/api/admin/inventory/stock").then((r) => r.json()));
    }
  }

  const lowStock = data.filter((s) => s.quantity > 0 && s.quantity <= 5).length;
  const outOfStock = data.filter((s) => s.quantity <= 0).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Stock Levels</h1><p className="text-muted-foreground">Current inventory quantities</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Stock</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Stock Items" value={data.length} icon={Layers} />
          <StatCard title="Low Stock (≤5)" value={lowStock} icon={Layers} />
          <StatCard title="Out of Stock" value={outOfStock} icon={Layers} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Item ID" type="number" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
              <Input placeholder="Warehouse ID" type="number" value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required />
              <Input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <Input placeholder="Reserved Quantity" type="number" value={form.reservedQuantity} onChange={(e) => setForm({ ...form, reservedQuantity: e.target.value })} />
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input placeholder="Bin" value={form.bin} onChange={(e) => setForm({ ...form, bin: e.target.value })} />
              <Input placeholder="Shelf" value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} />
            </div>
            <Button type="submit">Save Stock</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["location"]} />
      </div>
    </DashboardShell>
  );
}
