"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Activity, Search, Loader2 } from "lucide-react";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/superadmin/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all users across workspaces</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Admins" value={users.filter((u) => u.role === "admin" || u.role === "superadmin").length} icon={UserCheck} />
          <StatCard title="Employees" value={users.filter((u) => u.role === "employee" || u.role === "manager").length} icon={Activity} />
        </BentoGrid>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Workspace</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No users found.</p>
          ) : filtered.map((u) => (
            <div key={u.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <p className="font-medium">{u.name}</p>
              <span className="text-sm text-muted-foreground">{u.email}</span>
              <Badge variant="outline">{u.role}</Badge>
              <span className="text-sm">#{u.workspaceId}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
