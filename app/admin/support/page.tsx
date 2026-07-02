"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Ticket, Plus, AlertCircle, Clock, CheckCircle2,
  Search, RefreshCw, MessageSquare, UserCheck, Filter,
} from "lucide-react";

interface Ticket {
  id: number;
  contactId: number;
  subject: string;
  status: string;
  priority: string;
  assignedTo?: number;
  createdAt: string;
}

const columns: Column<Ticket>[] = [
  { key: "id", label: "Ticket #", sortable: true, render: (t) => `TKT-${String(t.id).padStart(4, "0")}` },
  { key: "subject", label: "Subject", sortable: true },
  { key: "contactId", label: "Contact", render: (t) => `#${t.contactId}` },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (t) => (
      <Badge variant={
        t.status === "open" ? "warning" :
        t.status === "in_progress" ? "default" :
        t.status === "resolved" ? "success" :
        t.status === "closed" ? "secondary" : "default"
      }>
        {t.status.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (t) => (
      <Badge variant={
        t.priority === "high" ? "destructive" :
        t.priority === "medium" ? "warning" : "default"
      }>
        {t.priority}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Created", sortable: true, render: (t) => new Date(t.createdAt).toLocaleDateString() },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [statusTab, setStatusTab] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ contactId: "", subject: "", priority: "medium", description: "" });

  useEffect(() => {
    fetch("/api/support/tickets").then((r) => r.json()).then(setTickets);
  }, []);

  async function addTicket(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contactId: Number(form.contactId) }),
    });
    if (res.ok) {
      toast.success("Ticket created");
      setShowAdd(false);
      setForm({ contactId: "", subject: "", priority: "medium", description: "" });
      setTickets(await fetch("/api/support/tickets").then((r) => r.json()));
    } else {
      toast.error("Failed to create ticket");
    }
  }

  const filtered = tickets.filter((t) => {
    if (statusTab !== "all" && t.status !== statusTab) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const highPriority = tickets.filter((t) => t.priority === "high" && t.status !== "closed" && t.status !== "resolved").length;
  const resolvedThisMonth = tickets.filter((t) => t.status === "resolved").length;
  const avgResolutionTime = "2.4d";

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
  const closedCount = tickets.filter((t) => t.status === "closed").length;
  const maxCount = Math.max(openCount, inProgressCount, resolvedCount, closedCount, 1);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Customer support management and tracking</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Open Tickets" value={openTickets} icon={Ticket} />
          <StatCard title="High Priority" value={highPriority} icon={AlertCircle} />
          <StatCard title="Resolved" value={resolvedThisMonth} icon={CheckCircle2} />
          <StatCard title="Avg Resolution" value={avgResolutionTime} icon={Clock} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status Distribution</h3>
              <div className="flex items-end gap-4 h-32">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{openCount}</span>
                  <div className="w-full bg-yellow-500/80 rounded-t-md" style={{ height: `${(openCount / maxCount) * 100}%` }} />
                  <span className="text-xs font-medium">Open</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{inProgressCount}</span>
                  <div className="w-full bg-blue-500/80 rounded-t-md" style={{ height: `${(inProgressCount / maxCount) * 100}%` }} />
                  <span className="text-xs font-medium">In Progress</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{resolvedCount}</span>
                  <div className="w-full bg-emerald-500/80 rounded-t-md" style={{ height: `${(resolvedCount / maxCount) * 100}%` }} />
                  <span className="text-xs font-medium">Resolved</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{closedCount}</span>
                  <div className="w-full bg-muted-foreground/40 rounded-t-md" style={{ height: `${(closedCount / maxCount) * 100}%` }} />
                  <span className="text-xs font-medium">Closed</span>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Priority Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "High", count: tickets.filter((t) => t.priority === "high").length, color: "bg-red-500", textColor: "text-red-600" },
                  { label: "Medium", count: tickets.filter((t) => t.priority === "medium").length, color: "bg-yellow-500", textColor: "text-yellow-600" },
                  { label: "Low", count: tickets.filter((t) => t.priority === "low").length, color: "bg-blue-500", textColor: "text-blue-600" },
                ].map((p) => {
                  const pct = tickets.length > 0 ? Math.round((p.count / tickets.length) * 100) : 0;
                  return (
                    <div key={p.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={p.textColor}>{p.label}</span>
                        <span className="font-medium">{p.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>

        {showAdd && (
          <BentoCard>
            <form onSubmit={addTicket} className="space-y-3">
              <h3 className="text-lg font-semibold">Create New Ticket</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} required />
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <textarea
                className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                placeholder="Description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit">Create Ticket</Button>
                <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </BentoCard>
        )}

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border bg-muted p-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusTab(t.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusTab === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline" size="sm" onClick={() => { setStatusTab("all"); setSearch(""); }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <DataTable columns={columns} data={filtered} searchKeys={["subject"]} />
      </div>
    </DashboardShell>
  );
}
