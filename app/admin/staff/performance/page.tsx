"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";

interface Review {
  id: number;
  employeeId: number;
  reviewerId?: number;
  reviewDate: string;
  period?: string;
  rating?: number;
  overallRating?: number;
  status: string;
}

const columns: Column<Review>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (r) => `#${r.employeeId}` },
  { key: "reviewerId", label: "Reviewer", render: (r) => r.reviewerId ? `#${r.reviewerId}` : "-" },
  { key: "reviewDate", label: "Date", render: (r) => new Date(r.reviewDate).toLocaleDateString() },
  { key: "period", label: "Period", render: (r) => r.period || "-" },
  { key: "rating", label: "Rating", render: (r) => r.rating ?? "-" },
  { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
];

export default function PerformancePage() {
  const [data, setData] = useState<Review[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", reviewerId: "", reviewDate: "", period: "", rating: "", goals: "", achievements: "", areasForImprovement: "", status: "draft" });

  useEffect(() => {
    fetch("/api/admin/staff/performance").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), reviewerId: form.reviewerId ? Number(form.reviewerId) : undefined, reviewDate: form.reviewDate, period: form.period || undefined, rating: form.rating ? Number(form.rating) : undefined, goals: form.goals || undefined, achievements: form.achievements || undefined, areasForImprovement: form.areasForImprovement || undefined, status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", reviewerId: "", reviewDate: "", period: "", rating: "", goals: "", achievements: "", areasForImprovement: "", status: "draft" });
      setData(await fetch("/api/admin/staff/performance").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Reviews</h1>
            <p className="text-muted-foreground">Manage staff performance reviews</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Review
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Reviews" value={data.length} icon={Star} />
          <StatCard title="Avg Rating" value={data.length > 0 ? (data.reduce((a, r) => a + (r.rating || 0), 0) / data.length).toFixed(1) : "-"} icon={Star} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Reviewer ID" type="number" value={form.reviewerId} onChange={(e) => setForm({ ...form, reviewerId: e.target.value })} />
              <Input placeholder="Review Date" type="date" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} required />
              <Input placeholder="Period (e.g. Q1 2025)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
              <Input placeholder="Rating (1-5)" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
              </select>
              <textarea placeholder="Goals" className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
              <textarea placeholder="Achievements" className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
              <textarea placeholder="Areas for Improvement" className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.areasForImprovement} onChange={(e) => setForm({ ...form, areasForImprovement: e.target.value })} />
            </div>
            <Button type="submit">Save Review</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId", "status"]} />
      </div>
    </DashboardShell>
  );
}
