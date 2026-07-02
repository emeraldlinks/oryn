"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus } from "lucide-react";

interface InventoryStockCount {
  id: number; warehouseId: number; countDate: string; status: string;
}

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary", "in-progress": "default", complete: "outline", verified: "default",
};

const columns: Column<InventoryStockCount>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "warehouseId", label: "Warehouse ID", sortable: true },
  { key: "countDate", label: "Count Date", render: (s) => new Date(s.countDate).toLocaleDateString() },
  { key: "status", label: "Status", render: (s) => <Badge variant={statusColors[s.status] || "default"}>{s.status}</Badge> },
];

const statuses = ["draft", "in-progress", "complete", "verified"];

export default function StockCountsPage() {
  const [data, setData] = useState<InventoryStockCount[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ warehouseId: "", countDate: "", status: "draft", notes: "" });

  useEffect(() => { fetch("/api/admin/inventory/stock-counts").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/stock-counts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        warehouseId: Number(form.warehouseId), countDate: form.countDate,
        status: form.status, notes: form.notes || undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ warehouseId: "", countDate: "", status: "draft", notes: "" });
      setData(await fetch("/api/admin/inventory/stock-counts").then((r) => r.json()));
    }
  }

  const inProgress = data.filter((s) => s.status === "in-progress").length;
  const verified = data.filter((s) => s.status === "verified").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Stock Counts</h1><p className="text-muted-foreground">Physical inventory audits</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Count</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Counts" value={data.length} icon={ClipboardList} />
          <StatCard title="In Progress" value={inProgress} icon={ClipboardList} />
          <StatCard title="Verified" value={verified} icon={ClipboardList} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Warehouse ID" type="number" value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required />
              <Input placeholder="Count Date" type="date" value={form.countDate} onChange={(e) => setForm({ ...form, countDate: e.target.value })} required />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit">Save Count</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["status"]} />
      </div>
    </DashboardShell>
  );
}
