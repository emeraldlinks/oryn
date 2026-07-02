"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, DollarSign, Building2, Download, Calendar, Loader2 } from "lucide-react";

export default function SuperAdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/analytics")
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

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Platform-wide metrics and trends</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> This Year</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Users" value={data?.totalUsers || 0} icon={Users} />
          <StatCard title="Workspaces" value={data?.totalWorkspaces || 0} icon={Building2} />
          <StatCard title="Total Deals" value={data?.totalDeals || 0} icon={BarChart3} />
          <StatCard title="Active Users" value={data?.activeUsers || 0} icon={TrendingUp} />
        </BentoGrid>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">${((data?.totalRevenue || 0) / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground mt-2">Total pipeline value</p>
              </div>
            </div>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
