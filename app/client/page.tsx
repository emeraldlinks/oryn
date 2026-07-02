"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { ShoppingCart, FileText, Ticket, Loader2 } from "lucide-react";

export default function ClientPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const stats = data?.stats || {};
  const orders = data?.recentOrders || [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Portal</h1>
          <p className="text-muted-foreground">Your account overview</p>
        </div>

        <BentoGrid>
          <StatCard title="Active Orders" value={stats.activeOrders ?? "—"} icon={ShoppingCart} />
          <StatCard title="Open Invoices" value={stats.openInvoices ?? "—"} icon={FileText} />
          <StatCard title="Support Tickets" value={stats.supportTickets ?? "—"} icon={Ticket} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : orders.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{item.id || `ORD-${item.order_number || ""}`}</p>
                      <p className="text-xs text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === "completed" || item.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100" :
                        item.status === "in_progress" || item.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-sm font-medium">{item.totalAmount ? `$${item.totalAmount}` : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
