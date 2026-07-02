"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Plus } from "lucide-react";

interface Invoice {
  id: number;
  contactId: number;
  status: string;
  dueDate: string;
  totalAmount: number;
  paidAt?: string;
}

const columns: Column<Invoice>[] = [
  { key: "id", label: "Invoice #", sortable: true, render: (inv) => `INV-${String(inv.id).padStart(4, "0")}` },
  { key: "contactId", label: "Contact", render: (inv) => `#${inv.contactId}` },
  { key: "totalAmount", label: "Amount", sortable: true, render: (inv) => `$${inv.totalAmount.toFixed(2)}` },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (inv) => (
      <Badge variant={
        inv.status === "paid" ? "success" :
        inv.status === "overdue" ? "destructive" :
        inv.status === "sent" ? "warning" : "secondary"
      }>
        {inv.status}
      </Badge>
    ),
  },
  { key: "dueDate", label: "Due Date", sortable: true, render: (inv) => new Date(inv.dueDate).toLocaleDateString() },
  { key: "paidAt", label: "Paid", render: (inv) => inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "-" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ contactId: "", totalAmount: "", dueDate: "", status: "draft" });

  useEffect(() => {
    fetch("/api/products/invoices").then((r) => r.json()).then(setInvoices);
  }, []);

  async function addInvoice(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contactId: Number(form.contactId), totalAmount: Number(form.totalAmount) }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ contactId: "", totalAmount: "", dueDate: "", status: "draft" });
      setInvoices(await fetch("/api/products/invoices").then((r) => r.json()));
    }
  }

  const totalOutstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Billing and payments</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Outstanding" value={`$${totalOutstanding.toLocaleString()}`} icon={FileText} />
          <StatCard title="Collected" value={`$${totalPaid.toLocaleString()}`} icon={DollarSign} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addInvoice} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} required />
              <Input placeholder="Amount" type="number" step="0.01" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} required />
              <Input placeholder="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </div>
            <Button type="submit">Create Invoice</Button>
          </form>
        )}

        <DataTable columns={columns} data={invoices} searchKeys={["status"]} />
      </div>
    </DashboardShell>
  );
}
