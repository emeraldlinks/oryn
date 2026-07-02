"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Target, Download, Calendar } from "lucide-react";

export default function ManagerReportsPage() {
  const metrics = [
    { label: "Jan", revenue: 45000, deals: 8, leads: 45 },
    { label: "Feb", revenue: 52000, deals: 10, leads: 52 },
    { label: "Mar", revenue: 48000, deals: 7, leads: 48 },
    { label: "Apr", revenue: 61000, deals: 12, leads: 55 },
    { label: "May", revenue: 58000, deals: 9, leads: 50 },
    { label: "Jun", revenue: 72000, deals: 14, leads: 62 },
  ];

  const totalRevenue = metrics.reduce((acc, m) => acc + m.revenue, 0);
  const avgDeals = Math.round(metrics.reduce((acc, m) => acc + m.deals, 0) / metrics.length);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Team performance analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> This Quarter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: 15, positive: true }} />
          <StatCard title="Avg Deals/Month" value={avgDeals} icon={Target} />
          <StatCard title="Conversion Rate" value="31.2%" icon={TrendingUp} trend={{ value: 4.5, positive: true }} />
          <StatCard title="Avg Deal Size" value="$8,450" icon={BarChart3} trend={{ value: 2.8, positive: true }} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Monthly Revenue</h3>
              <div className="flex items-end gap-3 h-48">
                {metrics.map((m) => (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">${(m.revenue / 1000).toFixed(0)}K</span>
                    <div
                      className="w-full bg-primary/80 rounded-t-md hover:bg-primary transition-colors"
                      style={{ height: `${(m.revenue / 72000) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deals by Stage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lead</span>
                    <span className="text-muted-foreground">12</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Qualified</span>
                    <span className="text-muted-foreground">8</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 w-2/3" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Proposal</span>
                    <span className="text-muted-foreground">5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Negotiation</span>
                    <span className="text-muted-foreground">3</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-red-500 w-1/3" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Closed Won</span>
                    <span className="text-muted-foreground">7</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Metrics</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Lead Response Time</p>
                  <p className="text-2xl font-bold">2.4 hrs</p>
                  <p className="text-xs text-emerald-500">↓ 12% vs last month</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Avg. Deal Cycle</p>
                  <p className="text-2xl font-bold">18 days</p>
                  <p className="text-xs text-red-500">↑ 5% vs last month</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Team Activity</p>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-muted-foreground">calls & emails this week</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
