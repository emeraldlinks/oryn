"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Plus } from "lucide-react";

interface InventoryWarehouse {
  id: number; name: string; code: string; city?: string; state?: string; country?: string;
  isActive: boolean; isPrimary: boolean;
}

const columns: Column<InventoryWarehouse>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "code", label: "Code", sortable: true },
  { key: "city", label: "City", render: (w) => w.city || "-" },
  { key: "state", label: "State", render: (w) => w.state || "-" },
  { key: "country", label: "Country", render: (w) => w.country || "-" },
  { key: "isActive", label: "Active", render: (w) => <Badge variant={w.isActive ? "default" : "secondary"}>{w.isActive ? "Yes" : "No"}</Badge> },
  { key: "isPrimary", label: "Primary", render: (w) => <Badge variant={w.isPrimary ? "default" : "outline"}>{w.isPrimary ? "Yes" : "No"}</Badge> },
];

export default function WarehousesPage() {
  const [data, setData] = useState<InventoryWarehouse[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", address: "", city: "", state: "", country: "", phone: "", email: "", isActive: true, isPrimary: false });

  useEffect(() => { fetch("/api/admin/inventory/warehouses").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/inventory/warehouses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, address: form.address || undefined, phone: form.phone || undefined, email: form.email || undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", code: "", address: "", city: "", state: "", country: "", phone: "", email: "", isActive: true, isPrimary: false });
      setData(await fetch("/api/admin/inventory/warehouses").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Warehouses</h1><p className="text-muted-foreground">Manage inventory locations</p></div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Add Warehouse</Button>
        </div>
        <BentoGrid>
          <StatCard title="Total Warehouses" value={data.length} icon={Warehouse} />
          <StatCard title="Active Warehouses" value={data.filter((w) => w.isActive).length} icon={Warehouse} />
        </BentoGrid>
        {showAdd && (
          <form onSubmit={handleSubmit} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPrimary} onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })} /> Primary</label>
            </div>
            <Button type="submit">Save Warehouse</Button>
          </form>
        )}
        <DataTable columns={columns} data={data} searchKeys={["name", "code", "city", "country"]} />
      </div>
    </DashboardShell>
  );
}
