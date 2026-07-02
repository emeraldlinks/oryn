"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, DollarSign, Building2, Activity, Download, Calendar } from "lucide-react";

export default function SuperAdminAnalyticsPage() {
  const monthlyData = [
    { label: "Jan", workspaces: 18, revenue: 42000, users: 180 },
    { label: "Feb", workspaces: 22, revenue: 48000, users: 210 },
    { label: "Mar", workspaces: 26, revenue: 51000, users: 245 },
    { label: "Apr", workspaces: 30, revenue: 55000, users: 280 },
    { label: "May", workspaces: 34, revenue: 62000, users: 310 },
    { label: "Jun", workspaces: 38, revenue: 68000, users: 345 },
  ];

  const currentMRR = monthlyData[monthlyData.length - 1].revenue;
  const growth = ((monthlyData[monthlyData.length - 1].revenue - monthlyData[monthlyData.length - 2].revenue) / monthlyData[monthlyData.length - 2].revenue * 100).toFixed(1);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Platform-wide metrics and trends</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> This Year
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Monthly Revenue" value={`$${(currentMRR / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: parseFloat(growth), positive: true }} />
          <StatCard title="Total Workspaces" value={monthlyData[monthlyData.length - 1].workspaces} icon={Building2} trend={{ value: 12, positive: true }} />
          <StatCard title="Active Users" value={monthlyData[monthlyData.length - 1].users} icon={Users} trend={{ value: 11, positive: true }} />
          <StatCard title="ARPU" value="$197" icon={TrendingUp} trend={{ value: 5.2, positive: true }} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Monthly Growth</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Revenue</p>
                  <div className="flex items-end gap-2 h-32">
                    {monthlyData.map((m) => (
                      <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">${(m.revenue / 1000).toFixed(0)}K</span>
                        <div className="w-full bg-primary/80 rounded-t-md" style={{ height: `${(m.revenue / 68000) * 100}%` }} />
                        <span className="text-xs text-muted-foreground">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Users</p>
                  <div className="flex items-end gap-2 h-24">
                    {monthlyData.map((m) => (
                      <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-emerald-500/80 rounded-t-md" style={{ height: `${(m.users / 345) * 100}%` }} />
                        <span className="text-xs text-muted-foreground">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Insights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold">2.4%</p>
                  <p className="text-xs text-emerald-500">↓ 0.8% vs last quarter</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">NPS Score</p>
                  <p className="text-2xl font-bold">72</p>
                  <p className="text-xs text-emerald-500">↑ 5 pts this quarter</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Avg. Onboarding</p>
                  <p className="text-2xl font-bold">4.2 days</p>
                  <p className="text-xs text-red-500">↑ 0.5 days vs target</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Support Tickets</p>
                  <p className="text-2xl font-bold">148</p>
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
