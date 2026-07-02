"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, TrendingUp, Loader2, ExternalLink, Download } from "lucide-react";

export default function AdminPaymentsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments/stats")
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

  const { payments, stats } = data || {};

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Track customer payments and transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant={stats?.configured ? "outline" : "default"} asChild>
              <a href="/admin/payments/settings">Configure Paystack</a>
            </Button>
          </div>
        </div>

        {!stats?.configured && (
          <BentoCard>
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-1">Paystack Not Configured</h3>
              <p className="text-sm text-muted-foreground mb-4">Set up your Paystack API keys to start accepting payments</p>
              <Button asChild><a href="/admin/payments/settings">Configure Now</a></Button>
            </div>
          </BentoCard>
        )}

        <BentoGrid>
          <StatCard title="Total Payments" value={stats?.total || 0} icon={CreditCard} />
          <StatCard title="Successful" value={stats?.successful || 0} icon={CheckCircle} />
          <StatCard title="Failed" value={stats?.failed || 0} icon={XCircle} />
          <StatCard title="Total Revenue" value={`₦${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`} icon={DollarSign} />
        </BentoGrid>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            {(!payments || payments.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No payments yet</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${p.status === "success" ? "bg-emerald-500" : p.status === "failed" ? "bg-red-500" : "bg-amber-500"}`} />
                      <div>
                        <p className="text-sm font-medium">{p.reference?.slice(0, 20)}...</p>
                        <p className="text-xs text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₦{(p.amount || 0).toLocaleString()}</span>
                      <Badge variant={p.status === "success" ? "success" as const : p.status === "failed" ? "destructive" as const : "warning" as const}>{p.status}</Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/api/payments/invoice/${p.invoiceId}/pdf?type=receipt`} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
