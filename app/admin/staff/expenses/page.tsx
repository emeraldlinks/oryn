"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus } from "lucide-react";

interface Expense {
  id: number;
  employeeId: number;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  status: string;
}

const columns: Column<Expense>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (e) => `#${e.employeeId}` },
  { key: "title", label: "Title", sortable: true },
  { key: "amount", label: "Amount", render: (e) => `$${e.amount.toLocaleString()}` },
  { key: "category", label: "Category", render: (e) => e.category || "-" },
  { key: "status", label: "Status", render: (e) => <Badge>{e.status}</Badge> },
];

export default function ExpensesPage() {
  const [data, setData] = useState<Expense[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", title: "", description: "", amount: "", category: "travel", status: "pending" });

  useEffect(() => {
    fetch("/api/admin/staff/expenses").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), title: form.title, description: form.description || undefined, amount: Number(form.amount), category: form.category, status: form.status }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", title: "", description: "", amount: "", category: "travel", status: "pending" });
      setData(await fetch("/api/admin/staff/expenses").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Manage expense reports</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Expenses" value={data.length} icon={DollarSign} />
          <StatCard title="Pending" value={data.filter((e) => e.status === "pending").length} icon={DollarSign} />
          <StatCard title="Approved" value={data.filter((e) => e.status === "approved").length} icon={DollarSign} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="travel">Travel</option>
                <option value="supplies">Supplies</option>
                <option value="meals">Meals</option>
                <option value="equipment">Equipment</option>
                <option value="training">Training</option>
                <option value="other">Other</option>
              </select>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="reimbursed">Reimbursed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button type="submit">Save Expense</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["title", "category", "status"]} />
      </div>
    </DashboardShell>
  );
}
