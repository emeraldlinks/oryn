"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  HardDrive, Loader2, RefreshCw, Database, Users, Package,
  FileText, FolderOpen, TrendingUp, AlertTriangle, BarChart3,
} from "lucide-react";

interface StorageData {
  usedGB: number;
  totalGB: number;
  entities: {
    contacts: number;
    deals: number;
    products: number;
    projects: number;
    documents: number;
  };
}

const ENTITY_ICONS: Record<string, any> = {
  contacts: Users,
  deals: Database,
  products: Package,
  projects: FolderOpen,
  documents: FileText,
};

const ENTITY_COLORS: Record<string, string> = {
  contacts: "bg-blue-500",
  deals: "bg-emerald-500",
  products: "bg-purple-500",
  projects: "bg-amber-500",
  documents: "bg-rose-500",
};

const monthlyUsage = [
  { label: "Jan", value: 12.4 },
  { label: "Feb", value: 14.8 },
  { label: "Mar", value: 16.2 },
  { label: "Apr", value: 18.5 },
  { label: "May", value: 21.1 },
  { label: "Jun", value: 24.3 },
];

export default function StoragePage() {
  const [data, setData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStorage(); }, []);

  async function loadStorage() {
    try {
      const res = await fetch("/api/admin/storage");
      if (res.ok) setData(await res.json());
    } catch {} finally { setLoading(false); }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const usedGB = data?.usedGB ?? 0;
  const totalGB = data?.totalGB ?? 100;
  const percentage = totalGB > 0 ? Math.round((usedGB / totalGB) * 100) : 0;

  const entities = data?.entities ?? {};
  const entityTotal = Object.values(entities).reduce((s, v) => s + v, 0);
  const maxEntityValue = Math.max(...Object.values(entities), 1);

  const maxMonthlyValue = Math.max(...monthlyUsage.map((m) => m.value), 1);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Storage Usage</h1>
            <p className="text-muted-foreground">Monitor storage consumption and entity growth</p>
          </div>
          <Button variant="outline" onClick={loadStorage}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
        </div>

        <BentoGrid>
          <StatCard title="Used Storage" value={`${usedGB.toFixed(1)} GB`} icon={HardDrive} trend={{ value: percentage, positive: percentage < 80 }} />
          <StatCard title="Total Capacity" value={`${totalGB} GB`} icon={Database} />
          <StatCard title="Usage" value={`${percentage}%`} icon={BarChart3} />
          <StatCard title="Total Records" value={entityTotal} icon={FileText} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Storage Overview</h3>
                <span className="text-sm text-muted-foreground">{usedGB.toFixed(1)} GB / {totalGB} GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${percentage > 80 ? "bg-red-500" : percentage > 60 ? "bg-yellow-500" : "bg-primary"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {percentage}% used
                {percentage > 80 && <span className="text-red-500 ml-2 inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Approaching capacity</span>}
                {percentage > 60 && percentage <= 80 && <span className="text-yellow-500 ml-2 inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Consider upgrading soon</span>}
              </p>
            </div>
          </BentoCard>

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Monthly Growth (GB)</h3>
              <div className="flex items-end gap-2 h-32">
                {monthlyUsage.map((m) => (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{m.value.toFixed(1)}</span>
                    <div
                      className="w-full bg-primary rounded-t-sm"
                      style={{ height: `${(m.value / maxMonthlyValue) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>

        {entityTotal > 0 && (
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Entity Record Distribution</h3>
              <div className="space-y-3">
                {Object.entries(entities).map(([key, count]) => {
                  const pct = Math.round((count / entityTotal) * 100);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ENTITY_COLORS[key] || "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BentoCard>
        )}

        {data?.entities && (
          <BentoGrid>
            {Object.entries(data.entities).map(([key, count]) => {
              const Icon = ENTITY_ICONS[key] || Database;
              return (
                <BentoCard key={key}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${ENTITY_COLORS[key] || "bg-primary"}/10 flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{key}</p>
                      <p className="text-2xl font-bold">{count as number}</p>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </BentoGrid>
        )}
      </div>
    </DashboardShell>
  );
}
