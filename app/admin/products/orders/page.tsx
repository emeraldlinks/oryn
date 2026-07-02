"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Plus } from "lucide-react";

interface Order {
  id: number;
  contactId: number;
  status: string;
  totalAmount: number;
  currency: string;
  paidAt?: string;
  createdAt: string;
}

const columns: Column<Order>[] = [
  { key: "id", label: "Order #", sortable: true, render: (o) => `ORD-${String(o.id).padStart(4, "0")}` },
  { key: "contactId", label: "Contact", render: (o) => `#${o.contactId}` },
  { key: "totalAmount", label: "Total", sortable: true, render: (o) => `$${o.totalAmount.toFixed(2)}` },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (o) => (
      <Badge variant={
        o.status === "completed" ? "success" :
        o.status === "cancelled" ? "destructive" :
        o.status === "pending" ? "warning" : "default"
      }>
        {o.status}
      </Badge>
    ),
  },
  { key: "paidAt", label: "Paid", render: (o) => o.paidAt ? new Date(o.paidAt).toLocaleDateString() : "-" },
  { key: "createdAt", label: "Created", sortable: true, render: (o) => new Date(o.createdAt).toLocaleDateString() },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ contactId: "", totalAmount: "", status: "pending" });

  useEffect(() => {
    fetch("/api/products/orders").then((r) => r.json()).then(setOrders);
  }, []);

  async function addOrder(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contactId: Number(form.contactId), totalAmount: Number(form.totalAmount) }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ contactId: "", totalAmount: "", status: "pending" });
      setOrders(await fetch("/api/products/orders").then((r) => r.json()));
    }
  }

  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.totalAmount, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Track sales and revenue</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} />
          <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addOrder} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} required />
              <Input placeholder="Total Amount" type="number" step="0.01" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} required />
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <Button type="submit">Create Order</Button>
          </form>
        )}

        <DataTable columns={columns} data={orders} searchKeys={["status"]} />
      </div>
    </DashboardShell>
  );
}
