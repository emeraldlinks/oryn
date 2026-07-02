"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Building2, Users, CreditCard, Activity, Loader2 } from "lucide-react";

export default function SuperAdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/dashboard")
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
        <div>
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground">Super admin control panel</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Workspaces" value={data?.totalWorkspaces || 0} icon={Building2} />
          <StatCard title="Total Users" value={data?.totalUsers || 0} icon={Users} />
          <StatCard title="Active Users" value={data?.activeUsers || 0} icon={Activity} />
          <StatCard title="Workspace Avg Users" value={data?.totalWorkspaces ? Math.round((data?.totalUsers || 0) / data.totalWorkspaces) : 0} icon={CreditCard} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Total Users", value: data?.totalUsers || 0 },
                  { name: "Active", value: data?.activeUsers || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {data?.recentActivity?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : data?.recentActivity?.slice(0, 10).map((a: any, i: number) => (
                <div key={a.id || i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{a.description || a.type || "Activity"}</p>
                      <p className="text-xs text-muted-foreground">{a.userName || ""}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
