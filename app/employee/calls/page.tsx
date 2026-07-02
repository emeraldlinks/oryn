"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, Plus, Search, Clock } from "lucide-react";

export default function EmployeeCallsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const calls = [
    { id: 1, contact: "John Smith", company: "Acme Corp", phone: "+1-555-0101", direction: "outgoing", duration: "12:34", date: "Today, 10:30 AM", status: "completed", notes: "Discussed Q2 proposal, follow-up meeting scheduled" },
    { id: 2, contact: "Sarah Johnson", company: "TechFlow Inc", phone: "+1-555-0102", direction: "incoming", duration: "8:15", date: "Today, 9:00 AM", status: "completed", notes: "Product demo request, sent calendar invite" },
    { id: 3, contact: "Mike Chen", company: "GlobalTech Solutions", phone: "+1-555-0103", direction: "outgoing", duration: "0:00", date: "Today, 11:00 AM", status: "missed", notes: "" },
    { id: 4, contact: "Emily Davis", company: "StartupXYZ", phone: "+1-555-0104", direction: "incoming", duration: "5:22", date: "Yesterday, 3:15 PM", status: "completed", notes: "Onboarding questions answered" },
    { id: 5, contact: "Robert Wilson", company: "DataFlow Corp", phone: "+1-555-0105", direction: "outgoing", duration: "18:45", date: "Yesterday, 1:00 PM", status: "completed", notes: "Requirements gathering, sent proposal" },
    { id: 6, contact: "Lisa Park", company: "InnovateLab", phone: "+1-555-0106", direction: "outgoing", duration: "0:00", date: "Mar 17, 4:00 PM", status: "missed", notes: "" },
  ];

  const filtered = calls.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.contact.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDuration = calls.filter((c) => c.status === "completed").reduce((acc, c) => {
    const [m, s] = c.duration.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);
  const hours = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);

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
          <StatCard title="Talk Time" value={`${hours}h ${mins}m`} icon={Clock} trend={{ value: 8, positive: true }} />
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
          {filtered.map((c) => (
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
                  <p className="font-medium">{c.contact}</p>
                  <p className="text-xs text-muted-foreground">{c.company} · {c.phone}</p>
                  {c.notes && <p className="text-xs text-muted-foreground mt-0.5">{c.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-sm">{c.date}</p>
                  <p className="text-xs text-muted-foreground">{c.duration}</p>
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
