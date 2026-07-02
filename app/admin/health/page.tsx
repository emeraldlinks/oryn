"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BarChart3, Loader2, RefreshCw, Activity, Cpu, MemoryStick, Timer } from "lucide-react";

interface Metric {
  metric: string;
  value: number;
  unit: string;
  lastRecordedAt: string;
}

const METRIC_ICONS: Record<string, any> = {
  cpu: Cpu,
  memory: MemoryStick,
  response_time: Timer,
  uptime: Activity,
};

const COMMON_METRICS = ["cpu", "memory", "response_time", "uptime", "disk_io", "network_in", "network_out", "db_connections", "active_users", "request_rate"];

export default function HealthPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("");

  useEffect(() => { loadMetrics(); }, []);

  async function loadMetrics() {
    try {
      const params = new URLSearchParams();
      if (selectedMetric) params.set("metric", selectedMetric);
      const res = await fetch(`/api/admin/system-health?${params}`);
      if (res.ok) setMetrics(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadMetrics(); }, [selectedMetric]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Health</h1>
            <p className="text-muted-foreground">Monitor system performance and metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
              <option value="">All Metrics</option>
              {COMMON_METRICS.map((m) => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
            </select>
            <Button variant="outline" onClick={loadMetrics}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : metrics.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">No metrics available.</div>
        ) : (
          <BentoGrid>
            {metrics.map((m, i) => {
              const Icon = METRIC_ICONS[m.metric] || BarChart3;
              return (
                <BentoCard key={i}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{m.metric.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">{m.lastRecordedAt ? new Date(m.lastRecordedAt).toLocaleString() : "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{m.value ?? "-"}</span>
                      <span className="text-sm text-muted-foreground">{m.unit}</span>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </BentoGrid>
        )}
      </div>
    </DashboardShell>
  );
}
