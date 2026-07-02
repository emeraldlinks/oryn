"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Warehouse, Truck, AlertTriangle, FileText, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InventoryStats {
  totalItems: number;
  totalWarehouses: number;
  totalSuppliers: number;
  lowStockItems: number;
  pendingPOs: number;
  activeTransfers: number;
}

const navLinks = [
  { href: "/admin/inventory/warehouses", label: "Warehouses", icon: Warehouse },
  { href: "/admin/inventory/categories", label: "Categories", icon: Package },
  { href: "/admin/inventory/brands", label: "Brands", icon: Package },
  { href: "/admin/inventory/items", label: "Items", icon: Package },
  { href: "/admin/inventory/variants", label: "Variants", icon: Package },
  { href: "/admin/inventory/stock", label: "Stock Levels", icon: Package },
  { href: "/admin/inventory/movements", label: "Movements", icon: Package },
  { href: "/admin/inventory/suppliers", label: "Suppliers", icon: Truck },
  { href: "/admin/inventory/purchase-orders", label: "Purchase Orders", icon: FileText },
  { href: "/admin/inventory/goods-received", label: "Goods Received", icon: Package },
  { href: "/admin/inventory/transfers", label: "Transfers", icon: RefreshCw },
  { href: "/admin/inventory/stock-counts", label: "Stock Counts", icon: Package },
  { href: "/admin/inventory/reorder-rules", label: "Reorder Rules", icon: Package },
  { href: "/admin/inventory/batches", label: "Batches", icon: Package },
  { href: "/admin/inventory/returns", label: "Returns", icon: Package },
];

export default function InventoryPage() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0, totalWarehouses: 0, totalSuppliers: 0,
    lowStockItems: 0, pendingPOs: 0, activeTransfers: 0,
  });

  useEffect(() => {
    fetch("/api/admin/inventory/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage stock, warehouses, suppliers, and more</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Items" value={stats.totalItems} icon={Package} />
          <StatCard title="Warehouses" value={stats.totalWarehouses} icon={Warehouse} />
          <StatCard title="Suppliers" value={stats.totalSuppliers} icon={Truck} />
          <StatCard title="Low Stock Items" value={stats.lowStockItems} icon={AlertTriangle} />
          <StatCard title="Pending POs" value={stats.pendingPOs} icon={FileText} />
          <StatCard title="Active Transfers" value={stats.activeTransfers} icon={RefreshCw} />
        </BentoGrid>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
