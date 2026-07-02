"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus } from "lucide-react";

interface InventorySupplier {
  id: number; name: string; code: string; contactPerson?: string; email?: string;
  phone?: string; city?: string; isActive: boolean; rating?: number;
}

const columns: Column<InventorySupplier>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "code", label: "Code", sortable: true },
  { key: "contactPerson", label: "Contact", render: (s) => s.contactPerson || "-" },
  { key: "email", label: "Email", render: (s) => s.email || "-" },
  { key: "phone", label: "Phone", render: (s) => s.phone || "-" },
  { key: "city", label: "City", render: (s) => s.city || "-" },
  { key: "rating", label: "Rating", render: (s) => s.rating ? `${"★".repeat(s.rating)}${"☆".repeat(5 - s.rating)}` : "-" },
  { key: "isActive", label: "Active", render: (s) => <Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? "Yes" : "No"}</Badge> },
];

export default function SuppliersPage() {
  const [data, setData] = useState<InventorySupplier[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", code: "", contactPerson: "", email: "", phone: "", address: "",
    city: "", state: "", country: "", paymentTerms: "", taxId: "", isActive: true, rating: "5",
  });

  useEffect(() => { fetch("/api/admin/inventory/suppliers").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/suppliers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, code: form.code, contactPerson: form.contactPerson || undefined,
        email: form.email || undefined, phone: form.phone || undefined, address: form.address || undefined,
        city: form.city || undefined, state: form.state || undefined, country: form.country || undefined,
        paymentTerms: form.paymentTerms || undefined, taxId: form.taxId || undefined,
        isActive: form.isActive, rating: Number(form.rating),
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", code: "", contactPerson: "", email: "", phone: "", address: "", city: "", state: "", country: "", paymentTerms: "", taxId: "", isActive: true, rating: "5" });
      setData(await fetch("/api/admin/inventory/suppliers").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Suppliers</h1><p className="text-muted-foreground">Manage vendors and partners</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Suppliers" value={data.length} icon={Truck} />
          <StatCard title="Active Suppliers" value={data.filter((s) => s.isActive).length} icon={Truck} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              <Input placeholder="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <Input placeholder="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
              <Input placeholder="Tax ID" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
              <Input placeholder="Rating (1-5)" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit">Save Supplier</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "code", "contactPerson", "email", "city"]} />
      </div>
    </DashboardShell>
  );
}
