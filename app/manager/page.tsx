"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Target, Users, CheckCircle, TrendingUp, Loader2 } from "lucide-react";

export default function ManagerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/dashboard")
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

  const team = data?.team || [];
  const pipelineStages = data?.pipelineStages || {};
  const totalDeals = Object.values(pipelineStages).reduce((a: number, b: any) => a + (b || 0), 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Dashboard</h1>
          <p className="text-muted-foreground">Performance & operations overview</p>
        </div>

        <BentoGrid>
          <StatCard title="Team Members" value={team.length} icon={Users} />
          <StatCard title="Active Deals" value={totalDeals} icon={Target} />
          <StatCard title="Tasks" value={data?.tasks?.length || 0} icon={CheckCircle} />
          <StatCard title="Pipeline Stages" value={Object.keys(pipelineStages).length} icon={TrendingUp} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="space-y-3">
                {team.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No team members</p>
                ) : team.slice(0, 10).map((m: any, i: number) => (
                  <div key={m.id || i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {(m.name || m.userName || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.name || m.userName || "Member"}</p>
                        <p className="text-xs text-muted-foreground">{m.role || m.position || ""}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pipeline by Stage</h3>
              <div className="space-y-3">
                {Object.keys(pipelineStages).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No pipeline data</p>
                ) : Object.entries(pipelineStages).map(([stage, count]) => (
                  <div key={stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{stage.replace(/_/g, " ")}</span>
                      <span className="text-muted-foreground">{count as number}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(count as number / totalDeals) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Tasks</h3>
              <div className="space-y-2 text-sm">
                {data?.tasks?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No tasks</p>
                ) : data?.tasks?.slice(0, 5).map((t: any, i: number) => (
                  <div key={t.id || i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span>{t.title}</span>
                    <span className={`text-xs ${t.status === "completed" ? "text-emerald-500" : t.status === "in_progress" ? "text-blue-500" : "text-amber-500"}`}>
                      {t.status?.replace(/_/g, " ") || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
