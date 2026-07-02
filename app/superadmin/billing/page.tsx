"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, Users, Search, Download, MoreHorizontal } from "lucide-react";

export default function SuperAdminBillingPage() {
  const [search, setSearch] = useState("");

  const invoices = [
    { id: "INV-2024-001", workspace: "Acme Corp", amount: "$12,000", plan: "Enterprise", status: "paid", date: "Mar 1, 2024" },
    { id: "INV-2024-002", workspace: "TechFlow Inc", amount: "$4,500", plan: "Business", status: "paid", date: "Mar 1, 2024" },
    { id: "INV-2024-003", workspace: "GlobalTech Solutions", amount: "$3,000", plan: "Business", status: "pending", date: "Mar 15, 2024" },
    { id: "INV-2024-004", workspace: "DataFlow Corp", amount: "$15,000", plan: "Enterprise", status: "paid", date: "Mar 1, 2024" },
    { id: "INV-2024-005", workspace: "StartupXYZ", amount: "$0", plan: "Starter (Trial)", status: "pending", date: "Mar 15, 2024" },
  ];

  const filtered = invoices.filter((i) =>
    !search || i.workspace.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())
  );

  const mrr = invoices.filter((i) => i.status === "paid").reduce((acc, i) => {
    return acc + parseInt(i.amount.replace(/[^0-9]/g, ""));
  }, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Subscription management and invoicing</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Monthly Recurring" value={`$${(mrr / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: 18, positive: true }} />
          <StatCard title="Active Subscriptions" value={4} icon={CreditCard} />
          <StatCard title="Pending Invoices" value={invoices.filter((i) => i.status === "pending").length} icon={TrendingUp} />
          <StatCard title="Avg Revenue/Workspace" value="$6,125" icon={Users} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="font-medium">Enterprise</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$27,000/mo</p>
                    <p className="text-xs text-muted-foreground">2 workspaces</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="font-medium">Business</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$7,500/mo</p>
                    <p className="text-xs text-muted-foreground">2 workspaces</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="font-medium">Starter</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$0/mo</p>
                    <p className="text-xs text-muted-foreground">1 workspace (trial)</p>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Invoices</h3>
              {filtered.map((i) => (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{i.workspace}</p>
                    <p className="text-xs text-muted-foreground">{i.id} · {i.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{i.amount}</span>
                    <Badge variant={i.status === "paid" ? "success" : "warning"}>{i.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
