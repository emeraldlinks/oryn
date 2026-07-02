"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Target, Users, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";

export default function ManagerPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Dashboard</h1>
          <p className="text-muted-foreground">Performance & operations overview</p>
        </div>

        <BentoGrid>
          <StatCard title="Team Deals Won" value="18" icon={Target} trend={{ value: 15, positive: true }} />
          <StatCard title="Team Members" value="8" icon={Users} />
          <StatCard title="Tasks Completed" value="142" icon={CheckCircle} trend={{ value: 22, positive: true }} />
          <StatCard title="Lead Conversion" value="31.2%" icon={TrendingUp} trend={{ value: 4.5, positive: true }} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Performance</h3>
              <div className="space-y-3">
                {[
                  { name: "Alice Johnson", deals: 8, revenue: "$120,000", tasks: 45, avatar: "AJ" },
                  { name: "Bob Smith", deals: 5, revenue: "$85,000", tasks: 38, avatar: "BS" },
                  { name: "Carol Davis", deals: 3, revenue: "$52,000", tasks: 32, avatar: "CD" },
                  { name: "David Lee", deals: 2, revenue: "$31,000", tasks: 27, avatar: "DL" },
                ].map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.deals} deals · {member.tasks} tasks</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{member.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pipeline by Stage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Prospecting</span>
                    <span className="text-muted-foreground">24</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 w-3/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Qualified</span>
                    <span className="text-muted-foreground">18</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Proposal</span>
                    <span className="text-muted-foreground">12</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 w-1/3" />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Needs Review</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-amber-50 dark:bg-amber-950">
                  <span>Social post approval</span>
                  <span className="text-xs text-muted-foreground">2 pending</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-blue-50 dark:bg-blue-950">
                  <span>Leave requests</span>
                  <span className="text-xs text-muted-foreground">3 pending</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-950">
                  <span>Overdue tasks</span>
                  <span className="text-xs text-muted-foreground">5</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
