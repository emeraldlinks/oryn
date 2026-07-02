"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, UserPlus, Search, Download } from "lucide-react";

export default function ManagerLeadsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const leads = [
    { id: 1, company: "Acme Corp", contact: "John Smith", source: "Website", status: "qualified", value: "$50,000", owner: "Alice J.", score: 85 },
    { id: 2, company: "TechFlow Inc", contact: "Sarah Johnson", source: "Referral", status: "contacted", value: "$120,000", owner: "Bob S.", score: 92 },
    { id: 3, company: "GlobalTech Solutions", contact: "Mike Chen", source: "LinkedIn", status: "qualified", value: "$75,000", owner: "Carol D.", score: 78 },
    { id: 4, company: "StartupXYZ", contact: "Emily Davis", source: "Conference", status: "new", value: "$25,000", owner: "Alice J.", score: 45 },
    { id: 5, company: "DataFlow Corp", contact: "Robert Wilson", source: "Website", status: "contacted", value: "$200,000", owner: "David L.", score: 88 },
    { id: 6, company: "InnovateLab", contact: "Lisa Park", source: "Referral", status: "new", value: "$30,000", owner: "Bob S.", score: 35 },
    { id: 7, company: "NexGen Software", contact: "Tom Brown", source: "Cold Call", status: "qualified", value: "$95,000", owner: "Carol D.", score: 71 },
    { id: 8, company: "CloudBase Inc", contact: "Anna White", source: "Website", status: "new", value: "$60,000", owner: "David L.", score: 52 },
  ];

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = leads.reduce((acc, l) => acc + parseInt(l.value.replace(/[^0-9]/g, "")), 0);

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
          <StatCard title="Team Members" value={4} icon={Users} />
          <StatCard title="Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={UserPlus} trend={{ value: 18, positive: true }} />
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
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Company / Contact</span>
            <span>Owner</span>
            <span>Value</span>
            <span>Score</span>
            <span>Status</span>
          </div>
          {filtered.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{l.company}</p>
                <p className="text-xs text-muted-foreground">{l.contact} · {l.source}</p>
              </div>
              <span className="text-sm">{l.owner}</span>
              <span className="text-sm font-medium">{l.value}</span>
              <span className={`text-sm font-medium ${l.score >= 80 ? "text-emerald-500" : l.score >= 60 ? "text-amber-500" : "text-muted-foreground"}`}>{l.score}</span>
              <Badge variant={l.status === "qualified" ? "success" : l.status === "contacted" ? "warning" : "secondary"}>{l.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
