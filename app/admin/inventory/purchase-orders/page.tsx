"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

interface InventoryPurchaseOrder {
  id: number; supplierId: number; orderNumber: string; status: string;
  orderDate: string; totalAmount: number; currency: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary", pending: "warning", approved: "default",
  sent: "outline", received: "default", cancelled: "destructive",
};

const columns: Column<InventoryPurchaseOrder>[] = [
  { key: "id", label: "ID", sortable: true, render: (po) => <Link href={`/admin/inventory/purchase-orders/${po.id}`} className="hover:underline text-primary">#{po.id}</Link> },
  { key: "orderNumber", label: "Order #", sortable: true },
  { key: "supplierId", label: "Supplier ID", sortable: true },
  { key: "status", label: "Status", sortable: true, render: (po) => <Badge variant={statusColors[po.status] || "default"}>{po.status}</Badge> },
  { key: "orderDate", label: "Date", render: (po) => new Date(po.orderDate).toLocaleDateString() },
  { key: "totalAmount", label: "Amount", render: (po) => `$${po.totalAmount.toFixed(2)}` },
  { key: "currency", label: "Currency" },
];

const statuses = ["draft", "pending", "approved", "sent", "received", "cancelled"];

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<InventoryPurchaseOrder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    supplierId: "", orderNumber: "", orderDate: "", expectedDate: "", notes: "",
    status: "draft", subtotal: "", tax: "", shipping: "", totalAmount: "",
  });

  useEffect(() => { fetch("/api/admin/inventory/purchase-orders").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/purchase-orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: Number(form.supplierId), orderNumber: form.orderNumber,
        orderDate: form.orderDate, expectedDate: form.expectedDate || undefined,
        notes: form.notes || undefined, status: form.status,
        subtotal: form.subtotal ? Number(form.subtotal) : undefined,
        tax: form.tax ? Number(form.tax) : undefined,
        shipping: form.shipping ? Number(form.shipping) : undefined,
        totalAmount: Number(form.totalAmount),
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ supplierId: "", orderNumber: "", orderDate: "", expectedDate: "", notes: "", status: "draft", subtotal: "", tax: "", shipping: "", totalAmount: "" });
      setData(await fetch("/api/admin/inventory/purchase-orders").then((r) => r.json()));
    }
  }

  const pending = data.filter((po) => po.status === "pending" || po.status === "draft" || po.status === "approved" || po.status === "sent").length;
  const received = data.filter((po) => po.status === "received").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Purchase Orders</h1><p className="text-muted-foreground">Manage procurement</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add PO</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total POs" value={data.length} icon={FileText} />
          <StatCard title="Pending" value={pending} icon={FileText} />
          <StatCard title="Received" value={received} icon={FileText} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Supplier ID" type="number" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required />
              <Input placeholder="Order Number" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} required />
              <Input placeholder="Order Date" type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} required />
              <Input placeholder="Expected Date" type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
              <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input placeholder="Subtotal" type="number" step="0.01" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: e.target.value })} />
              <Input placeholder="Tax" type="number" step="0.01" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
              <Input placeholder="Shipping" type="number" step="0.01" value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} />
              <Input placeholder="Total Amount" type="number" step="0.01" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} required />
            </div>
            <Button type="submit">Save PO</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["orderNumber", "status"]} />
      </div>
    </DashboardShell>
  );
}
