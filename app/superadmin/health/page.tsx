"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Server, Database, Clock, AlertTriangle, CheckCircle, Wifi } from "lucide-react";

export default function SuperAdminHealthPage() {
  const services = [
    { name: "Web Server", status: "healthy", uptime: "99.99%", latency: "45ms", icon: Server },
    { name: "Database", status: "healthy", uptime: "99.97%", latency: "12ms", icon: Database },
    { name: "Email Service", status: "healthy", uptime: "99.95%", latency: "120ms", icon: Activity },
    { name: "WebSocket", status: "degraded", uptime: "99.80%", latency: "89ms", icon: Wifi },
    { name: "AI Service", status: "healthy", uptime: "99.99%", latency: "340ms", icon: Clock },
    { name: "File Storage", status: "healthy", uptime: "100%", latency: "67ms", icon: Database },
  ];

  const recentEvents = [
    { type: "warning", message: "High memory usage on worker-3", time: "5 min ago", status: "active" },
    { type: "info", message: "Database backup completed successfully", time: "1 hour ago", status: "resolved" },
    { type: "error", message: "Email delivery delayed for 12 messages", time: "2 hours ago", status: "resolved" },
    { type: "warning", message: "WebSocket connection pool at 78% capacity", time: "3 hours ago", status: "active" },
    { type: "info", message: "SSL certificate renewal for *.oryn.com", time: "1 day ago", status: "resolved" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor infrastructure and service status</p>
        </div>

        <BentoGrid>
          <StatCard title="Services" value="6" icon={Server} />
          <StatCard title="Healthy" value={services.filter((s) => s.status === "healthy").length} icon={CheckCircle} />
          <StatCard title="Degraded" value={services.filter((s) => s.status === "degraded").length} icon={AlertTriangle} />
          <StatCard title="Avg Latency" value="112ms" icon={Activity} trend={{ value: 3, positive: false }} />
        </BentoGrid>

        <BentoGrid>
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <BentoCard key={s.name}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">{s.name}</h4>
                    </div>
                    <Badge variant={s.status === "healthy" ? "success" : "warning"}>{s.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{s.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="font-medium">{s.latency}</span>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="rounded-lg border overflow-hidden">
            {recentEvents.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${e.type === "error" ? "bg-red-500" : e.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{e.message}</p>
                    <p className="text-xs text-muted-foreground">{e.time}</p>
                  </div>
                </div>
                <Badge variant={e.status === "active" ? "warning" : "success"}>{e.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
