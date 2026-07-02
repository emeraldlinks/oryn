"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Badge } from "@/components/ui/badge";
import { FileText, Package } from "lucide-react";
import Link from "next/link";

interface LineItem {
  id: number; itemId: number; itemName?: string; quantity: number; unitPrice: number; totalPrice: number;
}

const statusColors: Record<string, string> = { draft: "secondary", pending: "warning", approved: "default", sent: "outline", received: "default", cancelled: "destructive" };

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const [po, setPo] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    fetch(`/api/admin/inventory/purchase-orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setPo(data.po || data); setLineItems(data.lineItems || []); })
      .catch(() => {});
  }, [params.id]);

  if (!po) return <DashboardShell><div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div></DashboardShell>;

  const liColumns: Column<LineItem>[] = [
    { key: "itemId", label: "Item ID" },
    { key: "itemName", label: "Item", render: (li) => li.itemName || `#${li.itemId}` },
    { key: "quantity", label: "Qty", sortable: true },
    { key: "unitPrice", label: "Unit Price", render: (li) => `$${li.unitPrice.toFixed(2)}` },
    { key: "totalPrice", label: "Total", render: (li) => `$${li.totalPrice.toFixed(2)}` },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/admin/inventory/purchase-orders" className="hover:underline">Purchase Orders</Link>
          <span>/</span><span className="text-foreground font-medium">#{po.orderNumber || po.id}</span>
        </div>
        <BentoGrid>
          <BentoCard>
            <div className="flex items-center gap-3 mb-3"><FileText className="h-6 w-6 text-primary" /><h2 className="text-xl font-bold">{po.orderNumber || `PO #${po.id}`}</h2></div>
            <div className="space-y-1 text-sm">
              <p>Supplier ID: {po.supplierId}</p>
              <p>Status: <Badge variant={(statusColors[po.status] as any) || "default"}>{po.status}</Badge></p>
              <p>Order Date: {new Date(po.orderDate).toLocaleDateString()}</p>
              {po.expectedDate && <p>Expected: {new Date(po.expectedDate).toLocaleDateString()}</p>}
              <p className="text-lg font-bold mt-2">Total: ${po.totalAmount?.toFixed(2)} {po.currency}</p>
              {po.notes && <p className="text-muted-foreground">Notes: {po.notes}</p>}
            </div>
          </BentoCard>
          <BentoCard colSpan={2}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"><Package className="h-4 w-4 inline mr-1" /> Line Items</h3>
            <DataTable columns={liColumns} data={lineItems} searchable={false} />
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
