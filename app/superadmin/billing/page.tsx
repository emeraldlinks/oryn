"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, Users, Search, Download, Loader2 } from "lucide-react";

export default function SuperAdminBillingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/superadmin/billing")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const invoices = data?.invoices || [];
  const filtered = invoices.filter((i: any) =>
    !search || i.id?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPaid = invoices.filter((i: any) => i.status === "paid").reduce((a: number, i: any) => a + (Number(i.total) || Number(i.amount) || 0), 0);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Subscription management and invoicing</p>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Paid" value={`$${(totalPaid / 1000).toFixed(0)}K`} icon={DollarSign} />
          <StatCard title="Invoices" value={invoices.length} icon={CreditCard} />
          <StatCard title="Pending" value={invoices.filter((i: any) => i.status === "pending").length} icon={TrendingUp} />
          <StatCard title="Subscriptions" value={data?.subscriptions?.length || 0} icon={Users} />
        </BentoGrid>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No invoices found.</p>
              ) : filtered.slice(0, 20).map((i: any) => (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{i.id || `INV-${i.id}`}</p>
                    <p className="text-xs text-muted-foreground">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">${Number(i.total || i.amount || 0).toLocaleString()}</span>
                    <Badge variant={i.status === "paid" ? "success" as const : "warning" as const}>{i.status || "pending"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
