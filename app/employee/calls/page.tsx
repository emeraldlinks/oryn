"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, Search, Clock, Loader2 } from "lucide-react";

export default function EmployeeCallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadCalls(); }, []);

  async function loadCalls() {
    try {
      const res = await fetch("/api/employee/calls");
      if (res.ok) setCalls(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const filtered = calls.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.contact?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDuration = calls.filter((c) => c.status === "completed").reduce((acc: number, c) => acc + (c.duration || 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;

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
            <h1 className="text-3xl font-bold">Call Log</h1>
            <p className="text-muted-foreground">Track your calls and follow-ups</p>
          </div>
          <Button>
            <PhoneCall className="mr-2 h-4 w-4" /> Log Call
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Calls" value={calls.length} icon={Phone} />
          <StatCard title="Outgoing" value={calls.filter((c) => c.direction === "outgoing" && c.status === "completed").length} icon={PhoneOutgoing} />
          <StatCard title="Incoming" value={calls.filter((c) => c.direction === "incoming" && c.status === "completed").length} icon={PhoneIncoming} />
          <StatCard title="Talk Time" value={`${hours}h ${mins}m`} icon={Clock} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search calls..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "missed"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No calls found.</p>
          ) : filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  c.direction === "incoming" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-blue-100 dark:bg-blue-900"
                }`}>
                  {c.status === "missed" ? (
                    <PhoneMissed className="h-5 w-5 text-red-500" />
                  ) : c.direction === "incoming" ? (
                    <PhoneIncoming className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <PhoneOutgoing className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{c.contact || c.contactName || "Unknown"}</p>
                  {c.notes && <p className="text-xs text-muted-foreground mt-0.5">{c.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-sm">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</p>
                  <p className="text-xs text-muted-foreground">{c.duration ? `${c.duration} min` : ""}</p>
                </div>
                {c.status === "missed" ? (
                  <Badge variant="destructive">Missed</Badge>
                ) : (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
