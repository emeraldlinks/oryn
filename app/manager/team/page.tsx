"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Users, Target, DollarSign, CheckCircle, Loader2, Mail, Phone } from "lucide-react";

export default function ManagerTeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/team")
      .then((r) => r.json())
      .then(setMembers)
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
          <h1 className="text-3xl font-bold">My Team</h1>
          <p className="text-muted-foreground">Manage and monitor team performance</p>
        </div>

        <BentoGrid>
          <StatCard title="Team Members" value={members.length} icon={Users} />
          <StatCard title="Total Tasks" value={members.reduce((a: number, m: any) => a + (m.tasks || 0), 0)} icon={CheckCircle} />
        </BentoGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-2 text-center py-12">No team members found.</p>
          ) : members.map((m, i) => (
            <div key={m.id || i} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {(m.name || m.userName || "?").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name || m.userName || "Member"}</p>
                    <p className="text-xs text-muted-foreground">{m.role || m.position || ""}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {m.email && (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{m.deals || 0}</p>
                  <p className="text-xs text-muted-foreground">Deals</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{m.tasks || 0}</p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{m.revenue ? `$${Number(m.revenue).toLocaleString()}` : "$0"}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
