"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, Plus } from "lucide-react";

interface InventoryGoodsReceivedNote {
  id: number; poId: number; receiptNumber: string; receivedDate: string; status: string; notes?: string;
}

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  draft: "secondary", received: "default", "partially-received": "outline", complete: "default",
};

const columns: Column<InventoryGoodsReceivedNote>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "poId", label: "PO ID", sortable: true },
  { key: "receiptNumber", label: "Receipt #", sortable: true },
  { key: "receivedDate", label: "Date", render: (g) => new Date(g.receivedDate).toLocaleDateString() },
  { key: "status", label: "Status", render: (g) => <Badge variant={statusColors[g.status] || "default"}>{g.status}</Badge> },
  { key: "notes", label: "Notes", render: (g) => g.notes || "-" },
];

const statuses = ["draft", "received", "partially-received", "complete"];

export default function GoodsReceivedPage() {
  const [data, setData] = useState<InventoryGoodsReceivedNote[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ poId: "", receiptNumber: "", receivedDate: "", status: "draft", notes: "" });

  useEffect(() => { fetch("/api/admin/inventory/goods-received").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/goods-received", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        poId: Number(form.poId), receiptNumber: form.receiptNumber,
        receivedDate: form.receivedDate, status: form.status, notes: form.notes || undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ poId: "", receiptNumber: "", receivedDate: "", status: "draft", notes: "" });
      setData(await fetch("/api/admin/inventory/goods-received").then((r) => r.json()));
    }
  }

  const pending = data.filter((g) => g.status === "draft" || g.status === "partially-received").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Goods Received</h1><p className="text-muted-foreground">Record incoming inventory</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add GRN</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total GRNs" value={data.length} icon={PackageCheck} />
          <StatCard title="Pending Receipts" value={pending} icon={PackageCheck} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="PO ID" type="number" value={form.poId} onChange={(e) => setForm({ ...form, poId: e.target.value })} required />
              <Input placeholder="Receipt Number" value={form.receiptNumber} onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })} required />
              <Input placeholder="Received Date" type="date" value={form.receivedDate} onChange={(e) => setForm({ ...form, receivedDate: e.target.value })} required />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit">Save GRN</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["receiptNumber", "status"]} />
      </div>
    </DashboardShell>
  );
}
