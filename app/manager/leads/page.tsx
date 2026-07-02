"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, Search, Download, Loader2 } from "lucide-react";

export default function ManagerLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/manager/leads")
      .then((r) => r.json())
      .then(setLeads)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.name?.toLowerCase().includes(search.toLowerCase()) && !l.firstName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            <h1 className="text-3xl font-bold">Team Leads</h1>
            <p className="text-muted-foreground">Overview of all team leads and prospects</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Leads" value={leads.length} icon={Target} />
          <StatCard title="Qualified" value={leads.filter((l) => l.status === "qualified").length} icon={TrendingUp} />
          <StatCard title="New" value={leads.filter((l) => l.status === "new").length} icon={Users} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search leads..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "new", "contacted", "qualified", "lost"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Name</span>
            <span>Email</span>
            <span>Status</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No leads found.</p>
          ) : filtered.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{l.firstName || l.name} {l.lastName || ""}</p>
                {l.company && <p className="text-xs text-muted-foreground">{l.company}</p>}
              </div>
              <span className="text-sm">{l.email || "-"}</span>
              <Badge variant={l.status === "qualified" ? "success" as const : l.status === "contacted" ? "warning" as const : "secondary" as const}>
                {l.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
