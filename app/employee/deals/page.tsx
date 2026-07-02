"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, TrendingUp, PieChart, Search, Loader2 } from "lucide-react";

export default function EmployeeDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadDeals(); }, []);

  async function loadDeals() {
    try {
      const res = await fetch("/api/employee/deals");
      if (res.ok) setDeals(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const filtered = deals.filter((d) => {
    if (filter !== "all" && d.stage !== filter) return false;
    if (search && !d.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stageColor = (s: string) => {
    switch (s) {
      case "lead": return "secondary" as const;
      case "qualified": return "warning" as const;
      case "proposal": return "default" as const;
      case "negotiation": return "destructive" as const;
      case "closed-won": return "success" as const;
      case "closed-lost": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  const totalValue = deals.reduce((acc: number, d) => acc + (Number(d.value) || 0), 0);
  const weightedValue = deals.reduce((acc: number, d) => acc + (Number(d.value) || 0) * (d.probability || 0) / 100, 0);

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
          <h1 className="text-3xl font-bold">My Deals</h1>
          <p className="text-muted-foreground">Track your sales pipeline</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Pipeline" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={ShoppingCart} />
          <StatCard title="Weighted Pipeline" value={`$${(weightedValue / 1000).toFixed(0)}K`} icon={PieChart} />
          <StatCard title="Active Deals" value={deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost").length} icon={TrendingUp} />
          <StatCard title="Won" value={deals.filter((d) => d.stage === "closed-won").length} icon={DollarSign} />
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
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No deals found.</p>
          ) : filtered.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex-1">
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">
                  {d.expectedClose ? new Date(d.expectedClose).toLocaleDateString() : "No close date"}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-semibold">${Number(d.value || 0).toLocaleString()}</p>
                  {d.probability && (
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${d.probability}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.probability}%</span>
                    </div>
                  )}
                </div>
                <Badge variant={stageColor(d.stage)}>{d.stage}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
