"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Activity } from "lucide-react";

interface InventoryMovement {
  id: number; itemId: number; type: string; quantity: number;
  reference?: string; performedAt: string; notes?: string;
}

const columns: Column<InventoryMovement>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "itemId", label: "Item ID", sortable: true },
  { key: "type", label: "Type", sortable: true, render: (m) => <Badge variant={m.type === "in" ? "default" : "destructive"}>{m.type}</Badge> },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "reference", label: "Reference", render: (m) => m.reference || "-" },
  { key: "notes", label: "Notes", render: (m) => m.notes || "-" },
  { key: "performedAt", label: "Date", sortable: true, render: (m) => new Date(m.performedAt).toLocaleString() },
];

export default function MovementsPage() {
  const [data, setData] = useState<InventoryMovement[]>([]);

  useEffect(() => { fetch("/api/admin/inventory/movements").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  const inCount = data.filter((m) => m.type === "in").length;
  const outCount = data.filter((m) => m.type === "out").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">Audit log of inventory changes</p>
        </div>
        <BentoGrid>
          <StatCard title="Total Movements" value={data.length} icon={ArrowLeftRight} />
          <StatCard title="Stock In" value={inCount} icon={Activity} />
          <StatCard title="Stock Out" value={outCount} icon={Activity} />
        </BentoGrid>
        <DataTable columns={columns} data={data} searchKeys={["type", "reference", "notes"]} />
      </div>
    </DashboardShell>
  );
}
