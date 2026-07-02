"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, MessageSquare } from "lucide-react";

export default function ClientTicketsPage() {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "" });
  const tickets = [
    { id: "TKT-001", subject: "Billing question", status: "open", priority: "medium", created: "Mar 15" },
    { id: "TKT-002", subject: "Feature request: Export to PDF", status: "closed", priority: "low", created: "Mar 10" },
  ];

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    setShowNew(false);
    setForm({ subject: "", body: "" });
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Get help from our team</p>
          </div>
          <Button onClick={() => setShowNew(!showNew)}>
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Open Tickets" value={tickets.filter((t) => t.status === "open").length} icon={Ticket} />
          <StatCard title="Resolved" value={tickets.filter((t) => t.status === "closed").length} icon={MessageSquare} />
        </BentoGrid>

        {showNew && (
          <form onSubmit={submitTicket} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              placeholder="Describe your issue..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
            <Button type="submit">Submit Ticket</Button>
          </form>
        )}

        <div className="rounded-lg border overflow-hidden">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">{t.id} · {t.created}</p>
              </div>
              <Badge variant={t.status === "open" ? "warning" : "success"}>{t.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
