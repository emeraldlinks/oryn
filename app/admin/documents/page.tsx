"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileSignature, FileText, Plus, Download } from "lucide-react";

interface Document {
  id: number;
  title: string;
  type: string;
  status: string;
  contactId?: number;
  dealId?: number;
  signedAt?: string;
  createdAt: string;
}

const columns: Column<Document>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "type", label: "Type", sortable: true, render: (d) => <Badge variant="outline">{d.type}</Badge> },
  { key: "contactId", label: "Contact", render: (d) => d.contactId ? `#${d.contactId}` : "-" },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (d) => (
      <Badge variant={
        d.status === "signed" ? "success" :
        d.status === "sent" ? "warning" :
        d.status === "draft" ? "secondary" : "default"
      }>
        {d.status}
      </Badge>
    ),
  },
  { key: "signedAt", label: "Signed", render: (d) => d.signedAt ? new Date(d.signedAt).toLocaleDateString() : "-" },
  { key: "createdAt", label: "Created", sortable: true, render: (d) => new Date(d.createdAt).toLocaleDateString() },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "proposal", contactId: "", dealId: "", contentJson: "" });

  useEffect(() => {
    fetch("/api/documents").then((r) => r.json()).then(setDocs);
  }, []);

  async function addDocument(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        contactId: form.contactId ? Number(form.contactId) : undefined,
        dealId: form.dealId ? Number(form.dealId) : undefined,
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ title: "", type: "proposal", contactId: "", dealId: "", contentJson: "" });
      setDocs(await fetch("/api/documents").then((r) => r.json()));
    }
  }

  const signed = docs.filter((d) => d.status === "signed").length;
  const pending = docs.filter((d) => d.status === "sent" || d.status === "draft").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents & Proposals</h1>
            <p className="text-muted-foreground">Create, send, and e-sign documents</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> New Document
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Signed" value={signed} icon={FileSignature} />
          <StatCard title="Pending" value={pending} icon={FileText} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addDocument} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Document Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="report">Report</option>
              </select>
              <Input placeholder="Contact ID" type="number" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} />
              <Input placeholder="Deal ID" type="number" value={form.dealId} onChange={(e) => setForm({ ...form, dealId: e.target.value })} />
            </div>
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
              placeholder="Document content (JSON or HTML)"
              value={form.contentJson}
              onChange={(e) => setForm({ ...form, contentJson: e.target.value })}
            />
            <Button type="submit">Create Document</Button>
          </form>
        )}

        <DataTable columns={columns} data={docs} searchKeys={["title", "type"]} />
      </div>
    </DashboardShell>
  );
}
