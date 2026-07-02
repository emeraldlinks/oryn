"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus } from "lucide-react";

interface InventoryReorderRule {
  id: number; itemId: number; warehouseId: number;
  reorderPoint: number; reorderQuantity: number; leadTimeDays: number; isActive: boolean;
}

const columns: Column<InventoryReorderRule>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "warehouseId", label: "Warehouse ID", sortable: true },
  { key: "reorderPoint", label: "Reorder Point", sortable: true },
  { key: "reorderQuantity", label: "Reorder Qty", sortable: true },
  { key: "leadTimeDays", label: "Lead Time (days)", sortable: true },
  { key: "isActive", label: "Active", render: (r) => <Badge variant={r.isActive ? "default" : "secondary"}>{r.isActive ? "Yes" : "No"}</Badge> },
];

export default function ReorderRulesPage() {
  const [data, setData] = useState<InventoryReorderRule[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemId: "", warehouseId: "", reorderPoint: "", reorderQuantity: "", leadTimeDays: "", isActive: true });

  useEffect(() => { fetch("/api/admin/inventory/reorder-rules").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/reorder-rules", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.itemId), warehouseId: Number(form.warehouseId),
        reorderPoint: Number(form.reorderPoint), reorderQuantity: Number(form.reorderQuantity),
        leadTimeDays: Number(form.leadTimeDays), isActive: form.isActive,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ itemId: "", warehouseId: "", reorderPoint: "", reorderQuantity: "", leadTimeDays: "", isActive: true });
      setData(await fetch("/api/admin/inventory/reorder-rules").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Reorder Rules</h1><p className="text-muted-foreground">Automated replenishment rules</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Rule</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Rules" value={data.length} icon={Bell} />
          <StatCard title="Active Rules" value={data.filter((r) => r.isActive).length} icon={Bell} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Item ID" type="number" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
              <Input placeholder="Warehouse ID" type="number" value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required />
              <Input placeholder="Reorder Point" type="number" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })} required />
              <Input placeholder="Reorder Quantity" type="number" value={form.reorderQuantity} onChange={(e) => setForm({ ...form, reorderQuantity: e.target.value })} required />
              <Input placeholder="Lead Time (days)" type="number" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} required />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Rule</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={[]} />
      </div>
    </DashboardShell>
  );
}
