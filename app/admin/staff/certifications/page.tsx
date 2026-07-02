"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Award, Plus } from "lucide-react";

interface Certification {
  id: number;
  employeeId: number;
  name: string;
  issuingBody?: string;
  issueDate?: string;
  expiryDate?: string;
  isVerified: boolean;
}

const columns: Column<Certification>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (c) => `#${c.employeeId}` },
  { key: "name", label: "Name", sortable: true },
  { key: "issuingBody", label: "Issuer", render: (c) => c.issuingBody || "-" },
  { key: "issueDate", label: "Issued", render: (c) => c.issueDate ? new Date(c.issueDate).toLocaleDateString() : "-" },
  { key: "expiryDate", label: "Expires", render: (c) => c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "-" },
  { key: "isVerified", label: "Verified", render: (c) => <Badge variant={c.isVerified ? "default" : "secondary"}>{c.isVerified ? "Yes" : "No"}</Badge> },
];

export default function CertificationsPage() {
  const [data, setData] = useState<Certification[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", name: "", issuingBody: "", certificateNumber: "", issueDate: "", expiryDate: "", isVerified: "false" });

  useEffect(() => {
    fetch("/api/admin/staff/certifications").then((r) => r.json()).then(setData);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(form.employeeId), name: form.name, issuingBody: form.issuingBody || undefined, certificateNumber: form.certificateNumber || undefined, issueDate: form.issueDate || undefined, expiryDate: form.expiryDate || undefined, isVerified: form.isVerified === "true" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", name: "", issuingBody: "", certificateNumber: "", issueDate: "", expiryDate: "", isVerified: "false" });
      setData(await fetch("/api/admin/staff/certifications").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p className="text-muted-foreground">Manage employee certifications</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Certification
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Certifications" value={data.length} icon={Award} />
          <StatCard title="Expiring Soon" value="-" icon={Award} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Issuing Body" value={form.issuingBody} onChange={(e) => setForm({ ...form, issuingBody: e.target.value })} />
              <Input placeholder="Certificate Number" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} />
              <Input placeholder="Issue Date" type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
              <Input placeholder="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isVerified === "true"} onChange={(e) => setForm({ ...form, isVerified: e.target.checked ? "true" : "false" })} />
                Verified
              </label>
            </div>
            <Button type="submit">Save Certification</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["name", "issuingBody"]} />
      </div>
    </DashboardShell>
  );
}
