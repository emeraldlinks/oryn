"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Download, Loader2 } from "lucide-react";

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/invoices")
      .then((r) => r.json())
      .then(setInvoices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "Paid")
    .reduce((sum: number, i) => sum + (Number(i.totalAmount) || 0), 0);

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
        <h1 className="text-3xl font-bold">My Invoices</h1>

        <BentoGrid>
          <StatCard title="Open Invoices" value={invoices.filter((i) => i.status !== "paid" && i.status !== "Paid").length} icon={FileText} />
          <StatCard title="Outstanding" value={`$${outstanding.toLocaleString()}`} icon={DollarSign} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No invoices yet.</p>
          ) : invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div>
                <p className="font-medium">{inv.id}</p>
                <p className="text-sm text-muted-foreground">Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  inv.status === "paid" || inv.status === "Paid" ? "success" :
                  inv.status === "overdue" || inv.status === "Overdue" ? "destructive" : "warning"
                }>
                  {inv.status}
                </Badge>
                <span className="font-semibold">${Number(inv.totalAmount || 0).toLocaleString()}</span>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
