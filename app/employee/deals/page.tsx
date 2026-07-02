"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, TrendingUp, PieChart, Plus, Search } from "lucide-react";

export default function EmployeeDealsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const deals = [
    { id: 1, title: "Acme Corp - Q2 Platform", company: "Acme Corp", value: "$50,000", stage: "negotiation", probability: 80, expectedClose: "2024-04-15", owner: "Me" },
    { id: 2, title: "TechFlow - Enterprise Plan", company: "TechFlow Inc", value: "$120,000", stage: "proposal", probability: 60, expectedClose: "2024-05-01", owner: "Me" },
    { id: 3, title: "GlobalTech - Consulting", company: "GlobalTech Solutions", value: "$75,000", stage: "qualified", probability: 40, expectedClose: "2024-06-01", owner: "Me" },
    { id: 4, title: "DataFlow - Data Pipeline", company: "DataFlow Corp", value: "$200,000", stage: "lead", probability: 20, expectedClose: "2024-07-01", owner: "Me" },
    { id: 5, title: "StartupXYZ - Basic Plan", company: "StartupXYZ", value: "$25,000", stage: "closed-won", probability: 100, expectedClose: "2024-03-15", owner: "Me" },
  ];

  const filtered = deals.filter((d) => {
    if (filter !== "all" && d.stage !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

  const totalValue = deals.reduce((acc, d) => acc + parseInt(d.value.replace(/[^0-9]/g, "")), 0);
  const weightedValue = deals.reduce((acc, d) => acc + parseInt(d.value.replace(/[^0-9]/g, "")) * d.probability / 100, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Deals</h1>
          <p className="text-muted-foreground">Track your sales pipeline</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Pipeline" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={ShoppingCart} />
          <StatCard title="Weighted Pipeline" value={`$${(weightedValue / 1000).toFixed(0)}K`} icon={PieChart} />
          <StatCard title="Active Deals" value={deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost").length} icon={TrendingUp} />
          <StatCard title="Won This Quarter" value={deals.filter((d) => d.stage === "closed-won").length} icon={DollarSign} trend={{ value: 25, positive: true }} />
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
          {filtered.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex-1">
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.company} · Close: {d.expectedClose}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-semibold">{d.value}</p>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${d.probability}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.probability}%</span>
                  </div>
                </div>
                <Badge variant={stageColor(d.stage) as "destructive" | "warning" | "success" | "secondary" | "default"}>{d.stage}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
