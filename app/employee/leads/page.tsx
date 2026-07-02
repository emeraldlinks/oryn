"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Target, Users, TrendingUp, UserPlus, Plus, Search, Mail, Phone, Loader2 } from "lucide-react";

export default function EmployeeLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadLeads(); }, []);

  async function loadLeads() {
    try {
      const res = await fetch("/api/employee/leads");
      if (res.ok) setLeads(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.name?.toLowerCase().includes(search.toLowerCase()) && !l.firstName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case "new": return "secondary" as const;
      case "contacted": return "warning" as const;
      case "qualified": return "success" as const;
      case "lost": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

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
            <h1 className="text-3xl font-bold">My Leads</h1>
            <p className="text-muted-foreground">Track and manage your prospects</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Leads" value={leads.length} icon={Target} />
          <StatCard title="New" value={leads.filter((l) => l.status === "new").length} icon={UserPlus} />
          <StatCard title="Qualified" value={leads.filter((l) => l.status === "qualified").length} icon={TrendingUp} />
          <StatCard title="Active" value={leads.filter((l) => l.status !== "lost").length} icon={Users} />
        </BentoGrid>

        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="p-4 rounded-lg border bg-muted/30 grid grid-cols-2 gap-3">
            <Input placeholder="First name" required />
            <Input placeholder="Last name" required />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" />
            <Input placeholder="Company" />
            <div className="col-span-2">
              <Button type="submit" className="w-full">Save Lead</Button>
            </div>
          </form>
        )}

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
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Name</span>
            <span>Email</span>
            <span>Status</span>
            <span>Source</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No leads found.</p>
          ) : filtered.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{l.firstName || l.name} {l.lastName || ""}</p>
                {l.company && <p className="text-xs text-muted-foreground">{l.company}</p>}
              </div>
              <div className="text-sm">{l.email}</div>
              <Badge variant={statusColor(l.status)}>{l.status}</Badge>
              <span className="text-sm">{l.source || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
