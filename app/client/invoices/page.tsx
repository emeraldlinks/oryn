"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Download } from "lucide-react";

export default function ClientInvoicesPage() {
  const invoices = [
    { id: "INV-2024-001", status: "Paid", amount: "$2,400", due: "Mar 1, 2024", paid: "Feb 28, 2024" },
    { id: "INV-2024-002", status: "Sent", amount: "$850", due: "Apr 15, 2024", paid: null },
    { id: "INV-2024-003", status: "Overdue", amount: "$3,200", due: "Mar 5, 2024", paid: null },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Invoices</h1>

        <BentoGrid>
          <StatCard title="Open Invoices" value={invoices.filter((i) => i.status !== "Paid").length} icon={FileText} />
          <StatCard title="Outstanding" value="$4,050" icon={DollarSign} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div>
                <p className="font-medium">{inv.id}</p>
                <p className="text-sm text-muted-foreground">Due: {inv.due}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  inv.status === "Paid" ? "success" :
                  inv.status === "Overdue" ? "destructive" : "warning"
                }>
                  {inv.status}
                </Badge>
                <span className="font-semibold">{inv.amount}</span>
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
