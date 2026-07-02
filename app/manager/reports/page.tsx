"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Target, Download, Calendar, Loader2 } from "lucide-react";

export default function ManagerReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/reports")
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
          <StatCard title="Total Pipeline" value={`$${((data?.totalPipeline || 0) / 1000).toFixed(0)}K`} icon={DollarSign} />
          <StatCard title="Won Value" value={`$${((data?.wonValue || 0) / 1000).toFixed(0)}K`} icon={Target} />
          <StatCard title="Conversion Rate" value={`${data?.conversionRate || 0}%`} icon={TrendingUp} />
          <StatCard title="Active Deals" value={data?.totalDeals || 0} icon={BarChart3} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summary</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                  <p className="text-2xl font-bold">{data?.totalContacts || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold">{data?.totalActivities || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold">{data?.totalDeals || 0}</p>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pipeline Overview</h3>
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">${((data?.totalPipeline || 0) / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground mt-2">Total pipeline value</p>
                  <p className="text-sm text-muted-foreground">{data?.totalDeals || 0} deals in pipeline</p>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
