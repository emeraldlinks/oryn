"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Activity, Search, MoreHorizontal } from "lucide-react";

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const users = [
    { id: 1, name: "John Smith", email: "john@acme.com", workspace: "Acme Corp", role: "admin", status: "active", lastLogin: "Today, 9:30 AM" },
    { id: 2, name: "Sarah Johnson", email: "sarah@techflow.io", workspace: "TechFlow Inc", role: "manager", status: "active", lastLogin: "Today, 8:15 AM" },
    { id: 3, name: "Mike Chen", email: "mike@globaltech.com", workspace: "GlobalTech", role: "employee", status: "active", lastLogin: "Yesterday" },
    { id: 4, name: "Emily Davis", email: "emily@startup.xyz", workspace: "StartupXYZ", role: "employee", status: "active", lastLogin: "Mar 18" },
    { id: 5, name: "Robert Wilson", email: "rob@dataflow.co", workspace: "DataFlow Corp", role: "admin", status: "active", lastLogin: "Today, 10:00 AM" },
    { id: 6, name: "Lisa Park", email: "lisa@innovatelab.io", workspace: "InnovateLab", role: "manager", status: "suspended", lastLogin: "Mar 10" },
    { id: 7, name: "Tom Brown", email: "tom@nexgen.io", workspace: "NexGen Software", role: "employee", status: "inactive", lastLogin: "Feb 28" },
    { id: 8, name: "Anna White", email: "anna@cloudbase.com", workspace: "CloudBase Inc", role: "employee", status: "active", lastLogin: "Mar 17" },
  ];

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.status !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all users across workspaces</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Active" value={users.filter((u) => u.status === "active").length} icon={UserCheck} />
          <StatCard title="Suspended" value={users.filter((u) => u.status === "suspended").length} icon={UserX} />
          <StatCard title="Logged In Today" value={users.filter((u) => u.lastLogin.includes("Today")).length} icon={Activity} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive", "suspended"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>User</span>
            <span>Workspace</span>
            <span>Role</span>
            <span>Last Login</span>
            <span>Status</span>
            <span></span>
          </div>
          {filtered.map((u) => (
            <div key={u.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span className="text-sm">{u.workspace}</span>
              <Badge variant="outline" className="text-xs">{u.role}</Badge>
              <span className="text-xs text-muted-foreground">{u.lastLogin}</span>
              <Badge variant={
                u.status === "active" ? "success" :
                u.status === "suspended" ? "destructive" : "secondary"
              }>{u.status}</Badge>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
