"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Activity, Search, Loader2 } from "lucide-react";

export default function SuperAdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/superadmin/workspaces")
      .then((r) => r.json())
      .then(setWorkspaces)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = workspaces.filter((w) =>
    !search || w.name?.toLowerCase().includes(search.toLowerCase())
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">Manage all tenant workspaces</p>
          </div>
          <Button>Create Workspace</Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Workspaces" value={workspaces.length} icon={Building2} />
          <StatCard title="Active" value={workspaces.filter((w) => w.active !== false).length} icon={Activity} />
        </BentoGrid>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workspaces..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Name</span>
            <span>Plan</span>
            <span>Slug</span>
            <span>Status</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No workspaces found.</p>
          ) : filtered.map((w) => (
            <div key={w.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{w.name}</p>
              </div>
              <Badge variant="outline">{w.plan || "starter"}</Badge>
              <span className="text-sm text-muted-foreground">{w.slug}</span>
              <Badge variant={w.active !== false ? "success" as const : "destructive" as const}>
                {w.active !== false ? "active" : "inactive"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
