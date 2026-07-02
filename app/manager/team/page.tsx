"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, CheckCircle, DollarSign, TrendingUp, Mail, Phone } from "lucide-react";

export default function ManagerTeamPage() {
  const members = [
    { name: "Alice Johnson", role: "Senior Sales Rep", avatar: "AJ", email: "alice@oryn.com", deals: 8, revenue: "$120,000", tasks: 45, completion: 92, dealsWon: 5 },
    { name: "Bob Smith", role: "Sales Rep", avatar: "BS", email: "bob@oryn.com", deals: 5, revenue: "$85,000", tasks: 38, completion: 78, dealsWon: 3 },
    { name: "Carol Davis", role: "Sales Rep", avatar: "CD", email: "carol@oryn.com", deals: 3, revenue: "$52,000", tasks: 32, completion: 65, dealsWon: 2 },
    { name: "David Lee", role: "Junior Sales Rep", avatar: "DL", email: "david@oryn.com", deals: 2, revenue: "$31,000", tasks: 27, completion: 55, dealsWon: 1 },
  ];

  const totalRevenue = members.reduce((acc, m) => {
    return acc + parseInt(m.revenue.replace(/[^0-9]/g, ""));
  }, 0);

  const avgCompletion = Math.round(members.reduce((acc, m) => acc + m.completion, 0) / members.length);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Team</h1>
          <p className="text-muted-foreground">Manage and monitor team performance</p>
        </div>

        <BentoGrid>
          <StatCard title="Team Members" value={members.length} icon={Users} />
          <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: 22, positive: true }} />
          <StatCard title="Total Deals" value={members.reduce((acc, m) => acc + m.deals, 0)} icon={Target} />
          <StatCard title="Avg Completion" value={`${avgCompletion}%`} icon={CheckCircle} trend={{ value: 5, positive: true }} />
        </BentoGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.name} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {m.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{m.deals}</p>
                  <p className="text-xs text-muted-foreground">Active Deals</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{m.dealsWon}</p>
                  <p className="text-xs text-muted-foreground">Deals Won</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{m.revenue}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Task Completion</span>
                  <span className="font-medium">{m.completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.completion >= 80 ? "bg-emerald-500" : m.completion >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${m.completion}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
