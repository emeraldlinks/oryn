"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Layers, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

interface Variant { id: number; name: string; sku: string; price: number; isActive: boolean; }
interface Stock { id: number; warehouseId: number; quantity: number; reservedQuantity: number; }
interface Movement { id: number; type: string; quantity: number; performedAt: string; }

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    const id = params.id;
    fetch(`/api/admin/inventory/items/${id}`).then((r) => r.json()).then(setItem).catch(() => {});
    fetch(`/api/admin/inventory/variants?itemId=${id}`).then((r) => r.json()).then(setVariants).catch(() => {});
    fetch(`/api/admin/inventory/stock?itemId=${id}`).then((r) => r.json()).then(setStock).catch(() => {});
    fetch(`/api/admin/inventory/movements?itemId=${id}`).then((r) => r.json()).then(setMovements).catch(() => {});
  }, [params.id]);

  if (!item) return <DashboardShell><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div></DashboardShell>;

  const stockColumns: Column<Stock>[] = [
    { key: "warehouseId", label: "Warehouse ID" },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "reservedQuantity", label: "Reserved" },
  ];

  const varColumns: Column<Variant>[] = [
    { key: "name", label: "Name" }, { key: "sku", label: "SKU" },
    { key: "price", label: "Price", render: (v) => `$${v.price.toFixed(2)}` },
    { key: "isActive", label: "Active", render: (v) => <Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Yes" : "No"}</Badge> },
  ];

  const movColumns: Column<Movement>[] = [
    { key: "type", label: "Type", render: (m) => <Badge variant={m.type === "in" ? "default" : "destructive"}>{m.type}</Badge> },
    { key: "quantity", label: "Qty", sortable: true },
    { key: "performedAt", label: "Date", render: (m) => new Date(m.performedAt).toLocaleDateString() },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/admin/inventory/items" className="hover:underline">Items</Link>
          <span>/</span><span className="text-foreground font-medium">{item.name}</span>
        </div>
        <BentoGrid>
          <BentoCard>
            <div className="flex items-center gap-3 mb-3"><Package className="h-6 w-6 text-primary" /><h2 className="text-xl font-bold">{item.name}</h2></div>
            <div className="space-y-1 text-sm"><p>SKU: <span className="font-mono">{item.sku}</span></p>{item.barcode && <p>Barcode: {item.barcode}</p>}<p>Price: <strong>${item.price?.toFixed(2)}</strong></p>{item.cost != null && <p>Cost: ${item.cost.toFixed(2)}</p>}<Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge></div>
          </BentoCard>
          <BentoCard>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"><Layers className="h-4 w-4 inline mr-1" /> Stock Levels</h3>
            <DataTable columns={stockColumns} data={stock} searchable={false} pageSize={5} />
          </BentoCard>
          <BentoCard>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"><DollarSign className="h-4 w-4 inline mr-1" /> Variants ({variants.length})</h3>
            <DataTable columns={varColumns} data={variants} searchable={false} pageSize={5} />
          </BentoCard>
          <BentoCard colSpan={2}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"><ArrowLeftRight className="h-4 w-4 inline mr-1" /> Movements</h3>
            <DataTable columns={movColumns} data={movements} searchable={false} pageSize={5} />
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
