"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Loader2, Server, Database, Activity, Clock, Wifi } from "lucide-react";

export default function SuperAdminHealthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/health")
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

  const services = data?.services || [];
  const stats = data?.stats || {};

  const serviceIcons: Record<string, any> = {
    Database: Database,
    "API Server": Activity,
    "Email Service": Clock,
    WebSocket: Wifi,
    Storage: Database,
    "AI Service": Server,
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor infrastructure and service status</p>
        </div>

        <BentoGrid>
          <StatCard title="Services" value={services.length} icon={Server} />
          <StatCard title="Healthy" value={services.filter((s: any) => s.status === "healthy").length} icon={CheckCircle} />
          <StatCard title="Degraded" value={services.filter((s: any) => s.status !== "healthy").length} icon={AlertTriangle} />
          <StatCard title="Total Users" value={stats.totalUsers || 0} icon={Shield} />
        </BentoGrid>

        <BentoGrid>
          {services.map((s: any) => {
            const Icon = serviceIcons[s.name] || Server;
            return (
              <BentoCard key={s.name}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">{s.name}</h4>
                    </div>
                    <Badge variant={s.status === "healthy" ? "success" as const : "warning" as const}>{s.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{s.uptime}</span>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
