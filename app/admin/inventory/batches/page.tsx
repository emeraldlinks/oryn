"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hash, Plus } from "lucide-react";

interface InventoryBatch {
  id: number; itemId: number; batchNumber: string; quantity: number;
  expiryDate?: string; status: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default", expired: "secondary", recalled: "destructive",
};

const columns: Column<InventoryBatch>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "batchNumber", label: "Batch #", sortable: true },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "expiryDate", label: "Expiry", render: (b) => b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : "-" },
  { key: "status", label: "Status", render: (b) => <Badge variant={statusColors[b.status] || "default"}>{b.status}</Badge> },
];

const statuses = ["active", "expired", "recalled"];

export default function BatchesPage() {
  const [data, setData] = useState<InventoryBatch[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemId: "", batchNumber: "", manufacturerDate: "", expiryDate: "", quantity: "", status: "active", notes: "" });

  useEffect(() => { fetch("/api/admin/inventory/batches").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/batches", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.itemId), batchNumber: form.batchNumber,
        manufacturerDate: form.manufacturerDate || undefined, expiryDate: form.expiryDate || undefined,
        quantity: Number(form.quantity), status: form.status, notes: form.notes || undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ itemId: "", batchNumber: "", manufacturerDate: "", expiryDate: "", quantity: "", status: "active", notes: "" });
      setData(await fetch("/api/admin/inventory/batches").then((r) => r.json()));
    }
  }

  const active = data.filter((b) => b.status === "active").length;
  const expired = data.filter((b) => b.status === "expired").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Batches</h1><p className="text-muted-foreground">Track inventory batches and expiry</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Batch</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Batches" value={data.length} icon={Hash} />
          <StatCard title="Active" value={active} icon={Hash} />
          <StatCard title="Expired" value={expired} icon={Hash} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Item ID" type="number" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
              <Input placeholder="Batch Number" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} required />
              <Input placeholder="Manufacturer Date" type="date" value={form.manufacturerDate} onChange={(e) => setForm({ ...form, manufacturerDate: e.target.value })} />
              <Input placeholder="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              <Input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit">Save Batch</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["batchNumber", "status"]} />
      </div>
    </DashboardShell>
  );
}
