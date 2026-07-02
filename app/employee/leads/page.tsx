"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, UserPlus, Plus, Search, Mail, Phone } from "lucide-react";

export default function EmployeeLeadsPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const leads = [
    { id: 1, name: "Acme Corp", contact: "John Smith", email: "john@acme.com", phone: "+1-555-0101", source: "Website", status: "new", value: "$50,000", score: 85 },
    { id: 2, name: "TechFlow Inc", contact: "Sarah Johnson", email: "sarah@techflow.io", phone: "+1-555-0102", source: "Referral", status: "contacted", value: "$120,000", score: 92 },
    { id: 3, name: "GlobalTech Solutions", contact: "Mike Chen", email: "mike@globaltech.com", phone: "+1-555-0103", source: "LinkedIn", status: "qualified", value: "$75,000", score: 78 },
    { id: 4, name: "StartupXYZ", contact: "Emily Davis", email: "emily@startup.xyz", phone: "+1-555-0104", source: "Conference", status: "new", value: "$25,000", score: 45 },
    { id: 5, name: "DataFlow Corp", contact: "Robert Wilson", email: "rob@dataflow.co", phone: "+1-555-0105", source: "Website", status: "contacted", value: "$200,000", score: 88 },
    { id: 6, name: "InnovateLab", contact: "Lisa Park", email: "lisa@innovatelab.io", phone: "+1-555-0106", source: "Referral", status: "lost", value: "$30,000", score: 35 },
  ];

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case "new": return "secondary";
      case "contacted": return "warning";
      case "qualified": return "success";
      case "lost": return "destructive";
      default: return "secondary";
    }
  };

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
          <StatCard title="New This Week" value={3} icon={UserPlus} trend={{ value: 12, positive: true }} />
          <StatCard title="Qualified" value={leads.filter((l) => l.status === "qualified").length} icon={TrendingUp} />
          <StatCard title="Conversion Rate" value="24.5%" icon={Users} trend={{ value: 3.2, positive: true }} />
        </BentoGrid>

        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="p-4 rounded-lg border bg-muted/30 grid grid-cols-2 gap-3">
            <Input placeholder="Company name" required />
            <Input placeholder="Contact name" required />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" />
            <Input placeholder="Source" />
            <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
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
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Company / Contact</span>
            <span>Source</span>
            <span>Value</span>
            <span>Score</span>
            <span>Status</span>
          </div>
          {filtered.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{l.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{l.contact}</span>
                  <span>·</span>
                  <Mail className="h-3 w-3" />
                  <Phone className="h-3 w-3" />
                </div>
              </div>
              <span className="text-sm">{l.source}</span>
              <span className="text-sm font-medium">{l.value}</span>
              <span className={`text-sm font-medium ${l.score >= 80 ? "text-emerald-500" : l.score >= 60 ? "text-amber-500" : "text-muted-foreground"}`}>{l.score}</span>
              <Badge variant={statusColor(l.status) as "destructive" | "warning" | "success" | "secondary"}>{l.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
