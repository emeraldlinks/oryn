"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Package, DollarSign, Plus, Percent, Trash2,
  X, Loader2,
} from "lucide-react";

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

interface Discount {
  id: number;
  name: string;
  discountType: string;
  discountValue: number;
  productId?: number;
  productName?: string;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

const productColumns: Column<Product>[] = [
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

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showNewDiscount, setShowNewDiscount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    name: "", discountType: "percentage", discountValue: "", productId: "",
    minQuantity: "", maxQuantity: "", startDate: "", endDate: "", active: true,
  });

  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    loadDiscounts();
  }, []);

  async function loadDiscounts() {
    try {
      const res = await fetch("/api/products/discounts");
      if (res.ok) setDiscounts(await res.json());
    } catch {}
  }

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
      toast.success("Product added");
    }
  }

  async function createDiscount(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const body: Record<string, any> = {
      name: discountForm.name,
      discountType: discountForm.discountType,
      discountValue: Number(discountForm.discountValue),
      active: discountForm.active,
    };
    if (discountForm.productId) body.productId = Number(discountForm.productId);
    if (discountForm.minQuantity) body.minQuantity = Number(discountForm.minQuantity);
    if (discountForm.maxQuantity) body.maxQuantity = Number(discountForm.maxQuantity);
    if (discountForm.startDate) body.startDate = discountForm.startDate;
    if (discountForm.endDate) body.endDate = discountForm.endDate;

    const res = await fetch("/api/products/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewDiscount(false);
      setDiscountForm({
        name: "", discountType: "percentage", discountValue: "", productId: "",
        minQuantity: "", maxQuantity: "", startDate: "", endDate: "", active: true,
      });
      await loadDiscounts();
      toast.success("Discount created");
    }
  }

  async function toggleDiscount(d: Discount) {
    await fetch(`/api/products/discounts?id=${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...d, active: !d.active }),
    });
    await loadDiscounts();
    toast.success(d.active ? "Discount deactivated" : "Discount activated");
  }

  async function deleteDiscount(id: number) {
    await fetch(`/api/products/discounts?id=${id}`, { method: "DELETE" });
    await loadDiscounts();
    toast.success("Discount deleted");
  }

  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price * (p.stock || 1), 0);

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "discounts", label: "Discounts", icon: Percent },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Products & Services</h1>
          <p className="text-muted-foreground">Manage your catalog and discounts</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "products" && (
          <>
            <div className="flex justify-end">
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

            <DataTable columns={productColumns} data={products} searchKeys={["name", "sku", "category"]} />
          </>
        )}

        {activeTab === "discounts" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewDiscount(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Discount
              </Button>
            </div>
            <div className="space-y-3">
              {discounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No discounts yet.</p>
              ) : discounts.map((d) => (
                <BentoCard key={d.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{d.name}</h4>
                        <Badge variant={d.discountType === "percentage" ? "secondary" : "default"}>
                          {d.discountType === "percentage" ? "%" : "$"}
                        </Badge>
                        <Badge variant="outline">
                          {d.discountType === "percentage" ? `${d.discountValue}%` : `$${d.discountValue}`}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {d.productName && <span>Product: {d.productName}</span>}
                        {d.minQuantity != null && <span>Min qty: {d.minQuantity}</span>}
                        {d.maxQuantity != null && <span>Max qty: {d.maxQuantity}</span>}
                        {d.startDate && <span>From: {new Date(d.startDate).toLocaleDateString()}</span>}
                        {d.endDate && <span>To: {new Date(d.endDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDiscount(d)}
                      >
                        <Badge variant={d.active ? "success" : "secondary"} className="cursor-pointer">
                          {d.active ? "Active" : "Inactive"}
                        </Badge>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteDiscount(d.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewDiscount} onClose={() => setShowNewDiscount(false)} title="New Discount">
              <form onSubmit={createDiscount} className="space-y-3">
                <Input placeholder="Discount Name" value={discountForm.name} onChange={(e) => setDiscountForm({ ...discountForm, name: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      value={discountForm.discountType}
                      onChange={(e) => setDiscountForm({ ...discountForm, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed_amount">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Value</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={discountForm.discountType === "percentage" ? "10" : "5.00"}
                      value={discountForm.discountValue}
                      onChange={(e) => setDiscountForm({ ...discountForm, discountValue: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Product ID (optional)</label>
                  <Input
                    type="number"
                    placeholder="Leave empty for all products"
                    value={discountForm.productId}
                    onChange={(e) => setDiscountForm({ ...discountForm, productId: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Min Quantity</label>
                    <Input type="number" value={discountForm.minQuantity} onChange={(e) => setDiscountForm({ ...discountForm, minQuantity: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Quantity</label>
                    <Input type="number" value={discountForm.maxQuantity} onChange={(e) => setDiscountForm({ ...discountForm, maxQuantity: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                    <Input type="date" value={discountForm.startDate} onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">End Date</label>
                    <Input type="date" value={discountForm.endDate} onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Active</label>
                  <button
                    type="button"
                    onClick={() => setDiscountForm({ ...discountForm, active: !discountForm.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${discountForm.active ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${discountForm.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Discount
                </Button>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
