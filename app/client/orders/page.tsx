"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Loader2 } from "lucide-react";

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((sum: number, o) => sum + (Number(o.totalAmount) || 0), 0);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <BentoGrid>
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} />
          <StatCard title="Total Spent" value={`$${totalSpent.toLocaleString()}`} icon={DollarSign} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No orders yet.</p>
          ) : orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""} · {order.items?.length || 0} items</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  order.status === "completed" || order.status === "Completed" ? "success" :
                  order.status === "in_progress" || order.status === "In Progress" ? "warning" : "secondary"
                }>
                  {order.status}
                </Badge>
                <span className="font-semibold">${Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
