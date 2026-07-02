"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, TrendingUp, PieChart, Search, Download } from "lucide-react";

export default function ManagerDealsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const deals = [
    { id: 1, title: "Acme Corp - Enterprise", company: "Acme Corp", value: "$50,000", stage: "negotiation", owner: "Alice J.", probability: 80, closeDate: "2024-04-15" },
    { id: 2, title: "TechFlow - Platform", company: "TechFlow Inc", value: "$120,000", stage: "proposal", owner: "Bob S.", probability: 60, closeDate: "2024-05-01" },
    { id: 3, title: "GlobalTech - Consulting", company: "GlobalTech", value: "$75,000", stage: "qualified", owner: "Carol D.", probability: 40, closeDate: "2024-06-01" },
    { id: 4, title: "DataFlow - Pipeline", company: "DataFlow Corp", value: "$200,000", stage: "lead", owner: "David L.", probability: 20, closeDate: "2024-07-01" },
    { id: 5, title: "StartupXYZ - Basic", company: "StartupXYZ", value: "$25,000", stage: "closed-won", owner: "Alice J.", probability: 100, closeDate: "2024-03-15" },
    { id: 6, title: "NexGen - Suite", company: "NexGen Software", value: "$95,000", stage: "proposal", owner: "Carol D.", probability: 55, closeDate: "2024-05-15" },
    { id: 7, title: "CloudBase - Migration", company: "CloudBase Inc", value: "$60,000", stage: "qualified", owner: "David L.", probability: 35, closeDate: "2024-06-15" },
    { id: 8, title: "InnovateLab - Starter", company: "InnovateLab", value: "$30,000", stage: "closed-lost", owner: "Bob S.", probability: 0, closeDate: "2024-03-10" },
  ];

  const filtered = deals.filter((d) => {
    if (filter !== "all" && d.stage !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = deals.reduce((acc, d) => acc + parseInt(d.value.replace(/[^0-9]/g, "")), 0);
  const weightedValue = deals.reduce((acc, d) => acc + parseInt(d.value.replace(/[^0-9]/g, "")) * d.probability / 100, 0);

  const stageColor = (s: string) => {
    switch (s) {
      case "lead": return "secondary";
      case "qualified": return "warning";
      case "proposal": return "default";
      case "negotiation": return "destructive";
      case "closed-won": return "success";
      case "closed-lost": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Deals</h1>
            <p className="text-muted-foreground">Full pipeline overview across the team</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Pipeline" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={ShoppingCart} />
          <StatCard title="Weighted" value={`$${(weightedValue / 1000).toFixed(0)}K`} icon={PieChart} />
          <StatCard title="Active Deals" value={deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost").length} icon={TrendingUp} />
          <StatCard title="Win Rate" value="62.5%" icon={DollarSign} trend={{ value: 5.2, positive: true }} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search deals..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f === "closed-won" ? "Won" : f === "closed-lost" ? "Lost" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Deal / Company</span>
            <span>Owner</span>
            <span>Value</span>
            <span>Prob.</span>
            <span>Stage</span>
          </div>
          {filtered.map((d) => (
            <div key={d.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.company} · Close: {d.closeDate}</p>
              </div>
              <span className="text-sm">{d.owner}</span>
              <span className="text-sm font-medium">{d.value}</span>
              <span className="text-sm">{d.probability}%</span>
              <Badge variant={stageColor(d.stage) as "destructive" | "warning" | "success" | "secondary" | "default"}>{d.stage}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
