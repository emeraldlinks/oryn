"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function ClientOrdersPage() {
  const orders = [
    { id: "ORD-2024-001", status: "In Progress", total: "$2,400", date: "Mar 15, 2024", items: 3 },
    { id: "ORD-2024-002", status: "Completed", total: "$850", date: "Mar 10, 2024", items: 1 },
    { id: "ORD-2024-003", status: "Pending", total: "$3,200", date: "Mar 18, 2024", items: 5 },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <BentoGrid>
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} />
          <StatCard title="Total Spent" value="$6,450" icon={DollarSign} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.date} · {order.items} items</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  order.status === "Completed" ? "success" :
                  order.status === "In Progress" ? "warning" : "secondary"
                }>
                  {order.status}
                </Badge>
                <span className="font-semibold">{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
