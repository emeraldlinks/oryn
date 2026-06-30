"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, DollarSign, Plus, Tag } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  currency: string;
  stock?: number;
  category?: string;
  isService: boolean;
}

const columns: Column<Product>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "sku", label: "SKU", render: (p) => p.sku || "-" },
  { key: "price", label: "Price", sortable: true, render: (p) => `$${p.price.toFixed(2)}` },
  {
    key: "isService",
    label: "Type",
    render: (p) => p.isService ? <Badge variant="secondary">Service</Badge> : <Badge>Product</Badge>,
  },
  { key: "stock", label: "Stock", render: (p) => p.isService ? "-" : (p.stock ?? 0).toString() },
  { key: "category", label: "Category", render: (p) => p.category || "-" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "", category: "", isService: false });

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: form.stock ? Number(form.stock) : undefined }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", sku: "", price: "", stock: "", category: "", isService: false });
      setProducts(await fetch("/api/products").then((r) => r.json()));
    }
  }

  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price * (p.stock || 1), 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products & Services</h1>
            <p className="text-muted-foreground">Manage your catalog</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Products" value={totalProducts} icon={Package} />
          <StatCard title="Inventory Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addProduct} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <Input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input placeholder="Stock (leave blank for services)" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isService} onChange={(e) => setForm({ ...form, isService: e.target.checked })} />
                This is a service (no stock)
              </label>
            </div>
            <Button type="submit">Save Product</Button>
          </form>
        )}

        <DataTable columns={columns} data={products} searchKeys={["name", "sku", "category"]} />
      </div>
    </DashboardShell>
  );
}
