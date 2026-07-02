"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, DollarSign, Activity, Search, Plus, MoreHorizontal } from "lucide-react";

export default function SuperAdminWorkspacesPage() {
  const [search, setSearch] = useState("");

  const workspaces = [
    { id: 1, name: "Acme Corp", owner: "John Smith", users: 24, plan: "Enterprise", status: "active", revenue: "$12,000/mo", created: "Jan 15, 2024" },
    { id: 2, name: "TechFlow Inc", owner: "Sarah Johnson", users: 12, plan: "Business", status: "active", revenue: "$4,500/mo", created: "Feb 1, 2024" },
    { id: 3, name: "GlobalTech Solutions", owner: "Mike Chen", users: 8, plan: "Business", status: "active", revenue: "$3,000/mo", created: "Feb 15, 2024" },
    { id: 4, name: "StartupXYZ", owner: "Emily Davis", users: 3, plan: "Starter", status: "trial", revenue: "$0/mo", created: "Mar 1, 2024" },
    { id: 5, name: "DataFlow Corp", owner: "Robert Wilson", users: 45, plan: "Enterprise", status: "active", revenue: "$15,000/mo", created: "Dec 1, 2023" },
    { id: 6, name: "InnovateLab", owner: "Lisa Park", users: 6, plan: "Starter", status: "suspended", revenue: "$0/mo", created: "Jan 20, 2024" },
  ];

  const filtered = workspaces.filter((w) =>
    !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.owner.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = workspaces.filter((w) => w.status === "active").reduce((acc, w) => {
    return acc + parseInt(w.revenue.replace(/[^0-9]/g, ""));
  }, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">Manage all tenant workspaces</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Workspace
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Workspaces" value={workspaces.length} icon={Building2} />
          <StatCard title="Active" value={workspaces.filter((w) => w.status === "active").length} icon={Activity} />
          <StatCard title="Total Users" value={workspaces.reduce((acc, w) => acc + w.users, 0)} icon={Users} />
          <StatCard title="Monthly Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: 12, positive: true }} />
        </BentoGrid>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workspaces..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Workspace / Owner</span>
            <span>Users</span>
            <span>Plan</span>
            <span>Revenue</span>
            <span>Status</span>
            <span></span>
          </div>
          {filtered.map((w) => (
            <div key={w.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-xs text-muted-foreground">{w.owner} · Created {w.created}</p>
              </div>
              <span className="text-sm">{w.users}</span>
              <span className="text-sm">{w.plan}</span>
              <span className="text-sm font-medium">{w.revenue}</span>
              <Badge variant={
                w.status === "active" ? "success" :
                w.status === "trial" ? "warning" : "destructive"
              }>{w.status}</Badge>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
