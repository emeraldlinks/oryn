"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Phone, Mail, Calendar, FileText, MessageSquare } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  subject: string;
  body?: string;
  contactId?: number;
  dealId?: number;
  userId: number;
  dueAt?: string;
  completedAt?: string;
  createdAt: string;
}

const typeIcons: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  message: MessageSquare,
};

const columns: Column<Activity>[] = [
  {
    key: "type",
    label: "Type",
    render: (a) => {
      const Icon = typeIcons[a.type] || FileText;
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{a.type}</span>
        </div>
      );
    },
  },
  { key: "subject", label: "Subject", sortable: true },
  { key: "contactId", label: "Contact ID", render: (a) => a.contactId ? `#${a.contactId}` : "-" },
  {
    key: "completedAt",
    label: "Status",
    render: (a) => a.completedAt ? (
      <Badge variant="success">Completed</Badge>
    ) : (
      <Badge variant="warning">Pending</Badge>
    ),
  },
  { key: "dueAt", label: "Due", render: (a) => a.dueAt ? new Date(a.dueAt).toLocaleDateString() : "-" },
  { key: "createdAt", label: "Created", sortable: true, render: (a) => new Date(a.createdAt).toLocaleDateString() },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "note", subject: "", body: "", contactId: "", dealId: "", dueAt: "" });

  useEffect(() => {
    fetch("/api/crm/activities").then((r) => r.json()).then(setActivities);
  }, []);

  async function addActivity(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contactId: form.contactId ? Number(form.contactId) : undefined, dealId: form.dealId ? Number(form.dealId) : undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ type: "note", subject: "", body: "", contactId: "", dealId: "", dueAt: "" });
      const updated = await fetch("/api/crm/activities").then((r) => r.json());
      setActivities(updated);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground">Track calls, emails, meetings, and notes</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Log Activity
          </Button>
        </div>

        {showAdd && (
          <form onSubmit={addActivity} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="message">Message</option>
              </select>
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} />
              <Input placeholder="Deal ID" type="number" value={form.dealId} onChange={(e) => setForm({ ...form, dealId: e.target.value })} />
            </div>
            <Input placeholder="Body / Description" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Input placeholder="Due date (ISO)" type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
            <Button type="submit">Save Activity</Button>
          </form>
        )}

        <DataTable columns={columns} data={activities} searchKeys={["subject", "type", "body"]} />
      </div>
    </DashboardShell>
  );
}
