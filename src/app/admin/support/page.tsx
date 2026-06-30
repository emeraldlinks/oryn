"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, AlertCircle } from "lucide-react";

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
        t.status === "resolved" ? "success" :
        t.status === "closed" ? "secondary" : "default"
      }>
        {t.status}
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

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ contactId: "", subject: "", priority: "medium" });

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
      setShowAdd(false);
      setForm({ contactId: "", subject: "", priority: "medium" });
      setTickets(await fetch("/api/support/tickets").then((r) => r.json()));
    }
  }

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const highPriority = tickets.filter((t) => t.priority === "high" && t.status !== "resolved").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Customer support management</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Open Tickets" value={openTickets} icon={Ticket} />
          <StatCard title="High Priority" value={highPriority} icon={AlertCircle} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addTicket} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} required />
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Button type="submit">Create Ticket</Button>
          </form>
        )}

        <DataTable columns={columns} data={tickets} searchKeys={["subject"]} />
      </div>
    </DashboardShell>
  );
}
