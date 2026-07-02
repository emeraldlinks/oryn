"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Undo2, Plus } from "lucide-react";

interface InventoryReturn {
  id: number; supplierId: number; returnNumber: string; returnDate: string;
  status: string; totalAmount: number;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary", sent: "default", received: "outline", credited: "default",
};

const columns: Column<InventoryReturn>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "returnNumber", label: "Return #", sortable: true },
  { key: "supplierId", label: "Supplier ID", sortable: true },
  { key: "returnDate", label: "Date", render: (r) => new Date(r.returnDate).toLocaleDateString() },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusColors[r.status] || "default"}>{r.status}</Badge> },
  { key: "totalAmount", label: "Amount", render: (r) => `$${r.totalAmount.toFixed(2)}` },
];

const statuses = ["draft", "sent", "received", "credited"];

export default function ReturnsPage() {
  const [data, setData] = useState<InventoryReturn[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ supplierId: "", returnNumber: "", returnDate: "", reason: "", status: "draft", totalAmount: "" });

  useEffect(() => { fetch("/api/admin/inventory/returns").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/returns", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: Number(form.supplierId), returnNumber: form.returnNumber,
        returnDate: form.returnDate, reason: form.reason || undefined,
        status: form.status, totalAmount: Number(form.totalAmount),
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ supplierId: "", returnNumber: "", returnDate: "", reason: "", status: "draft", totalAmount: "" });
      setData(await fetch("/api/admin/inventory/returns").then((r) => r.json()));
    }
  }

  const pending = data.filter((r) => r.status === "draft" || r.status === "sent").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Returns</h1><p className="text-muted-foreground">Manage supplier returns</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Return</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Returns" value={data.length} icon={Undo2} />
          <StatCard title="Pending Returns" value={pending} icon={Undo2} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Supplier ID" type="number" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required />
              <Input placeholder="Return Number" value={form.returnNumber} onChange={(e) => setForm({ ...form, returnNumber: e.target.value })} required />
              <Input placeholder="Return Date" type="date" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} required />
              <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Total Amount" type="number" step="0.01" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} required />
            </div>
            <Button type="submit">Save Return</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["returnNumber", "status"]} />
      </div>
    </DashboardShell>
  );
}
