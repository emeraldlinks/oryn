"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";

interface Document {
  id: number;
  employeeId: number;
  type: string;
  name: string;
  fileUrl?: string;
  status: string;
  expiryDate?: string;
}

const columns: Column<Document>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (d) => `#${d.employeeId}` },
  { key: "type", label: "Type", render: (d) => <Badge>{d.type}</Badge> },
  { key: "name", label: "Name", sortable: true },
  { key: "status", label: "Status", render: (d) => <Badge>{d.status}</Badge> },
  { key: "expiryDate", label: "Expires", render: (d) => d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : "-" },
];

export default function DocumentsPage() {
  const [data, setData] = useState<Document[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", type: "contract", name: "", fileUrl: "", status: "active", expiryDate: "" });

  useEffect(() => {
    fetch("/api/admin/staff/documents").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), type: form.type, name: form.name, fileUrl: form.fileUrl || undefined, status: form.status, expiryDate: form.expiryDate || undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", type: "contract", name: "", fileUrl: "", status: "active", expiryDate: "" });
      setData(await fetch("/api/admin/staff/documents").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage employee documents</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Document
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Documents" value={data.length} icon={FileText} />
          <StatCard title="Active Documents" value={data.filter((d) => d.status === "active").length} icon={FileText} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="contract">Contract</option>
                <option value="nda">NDA</option>
                <option value="policy">Policy</option>
                <option value="identification">Identification</option>
                <option value="certification">Certification</option>
                <option value="other">Other</option>
              </select>
              <Input placeholder="Document Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="File URL" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
              <Input placeholder="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
            <Button type="submit">Save Document</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["name", "type", "status"]} />
      </div>
    </DashboardShell>
  );
}
