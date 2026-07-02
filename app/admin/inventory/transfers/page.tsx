"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";

interface InventoryStockTransfer {
  id: number; itemId: number; fromWarehouseId: number; toWarehouseId: number;
  quantity: number; status: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary", "in-transit": "default", received: "default", cancelled: "destructive",
};

const columns: Column<InventoryStockTransfer>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "fromWarehouseId", label: "From WH", sortable: true },
  { key: "toWarehouseId", label: "To WH", sortable: true },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "status", label: "Status", render: (t) => <Badge variant={statusColors[t.status] || "default"}>{t.status}</Badge> },
];

const statuses = ["draft", "in-transit", "received", "cancelled"];

export default function TransfersPage() {
  const [data, setData] = useState<InventoryStockTransfer[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemId: "", fromWarehouseId: "", toWarehouseId: "", quantity: "", status: "draft", notes: "" });

  useEffect(() => { fetch("/api/admin/inventory/transfers").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/transfers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.itemId), fromWarehouseId: Number(form.fromWarehouseId),
        toWarehouseId: Number(form.toWarehouseId), quantity: Number(form.quantity),
        status: form.status, notes: form.notes || undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ itemId: "", fromWarehouseId: "", toWarehouseId: "", quantity: "", status: "draft", notes: "" });
      setData(await fetch("/api/admin/inventory/transfers").then((r) => r.json()));
    }
  }

  const inTransit = data.filter((t) => t.status === "in-transit").length;
  const completed = data.filter((t) => t.status === "received").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Stock Transfers</h1><p className="text-muted-foreground">Move stock between warehouses</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Transfer</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Transfers" value={data.length} icon={RefreshCw} />
          <StatCard title="In Transit" value={inTransit} icon={RefreshCw} />
          <StatCard title="Completed" value={completed} icon={RefreshCw} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Item ID" type="number" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
              <Input placeholder="From Warehouse ID" type="number" value={form.fromWarehouseId} onChange={(e) => setForm({ ...form, fromWarehouseId: e.target.value })} required />
              <Input placeholder="To Warehouse ID" type="number" value={form.toWarehouseId} onChange={(e) => setForm({ ...form, toWarehouseId: e.target.value })} required />
              <Input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit">Save Transfer</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["status"]} />
      </div>
    </DashboardShell>
  );
}
