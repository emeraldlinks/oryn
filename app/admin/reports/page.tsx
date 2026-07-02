"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3, TrendingUp, DollarSign, Users, Target,
  Download, FileText, Calendar, Save, X, Loader2,
} from "lucide-react";

const reportTypes = [
  { key: "pipeline", label: "Pipeline", icon: Target },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "performance", label: "Performance", icon: TrendingUp },
  { key: "contacts", label: "Contacts", icon: Users },
];

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("pipeline");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [reportName, setReportName] = useState("");

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const currentMetrics = data?.metrics?.[reportType] || {};
  const currentChartData = data?.monthlyData?.[reportType] || [];
  const charts = data?.charts?.pipeline || { won: 0, inProgress: 0, lost: 0 };
  const totalChart = charts.won + charts.inProgress + charts.lost;
  const wonPct = totalChart > 0 ? Math.round((charts.won / totalChart) * 100) : 0;
  const progPct = totalChart > 0 ? Math.round((charts.inProgress / totalChart) * 100) : 0;
  const lostPct = totalChart > 0 ? Math.round((charts.lost / totalChart) * 100) : 0;

  const maxValue = Math.max(...currentChartData.map((d: any) => Math.max(d.value, d.prevValue)), 1);

  function exportReport() {
    toast.success("Report exported as PDF");
  }

  function saveReport() {
    if (!reportName.trim()) return;
    toast.success(`Report "${reportName}" saved`);
    setShowSaveDialog(false);
    setReportName("");
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Custom report builder and dashboards</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
              <Save className="mr-2 h-4 w-4" /> Save Report
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {reportTypes.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => setReportType(r.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  reportType === r.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="w-auto" />
          <span className="text-muted-foreground">to</span>
          <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="w-auto" />
          <Button variant="outline" size="sm">Apply</Button>
          <span className="text-sm text-muted-foreground ml-2">
            <Calendar className="inline h-3.5 w-3.5 mr-1" />
            {new Date().getFullYear()} YTD
          </span>
        </div>

        <BentoGrid>
          {Object.entries(currentMetrics).map(([key, metric]: [string, any]) => (
            <StatCard
              key={key}
              title={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              value={metric.value}
              icon={BarChart3}
              trend={metric.trend}
            />
          ))}
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">{reportType} Trends</h3>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <span className="text-muted-foreground">This Year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-muted-foreground/30" />
                    <span className="text-muted-foreground">Last Year</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-3 h-48 pt-4">
                {currentChartData.map((d: any) => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}K` : d.value}
                    </span>
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-muted-foreground/30 rounded-t-sm"
                        style={{ height: `${(d.prevValue / maxValue) * 100}%` }}
                      />
                      <div
                        className="w-full bg-primary rounded-t-sm"
                        style={{ height: `${(d.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Insights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Top Performing</p>
                  <p className="text-sm font-medium mt-1">Pipeline shows strong growth</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Driven by active deal flow</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Needs Attention</p>
                  <p className="text-sm font-medium mt-1">Conversion tracking active</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Monitor win rate trends</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Opportunity</p>
                  <p className="text-sm font-medium mt-1">Contacts growing steadily</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Expand outreach channels</p>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Won</span>
                    <span className="font-medium">{wonPct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${wonPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Progress</span>
                    <span className="font-medium">{progPct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${progPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lost</span>
                    <span className="font-medium">{lostPct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${lostPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Report Builder</h3>
            <div className="flex items-center gap-3">
              <Input placeholder="Report name..." className="max-w-sm" />
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Generate
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {["Contacts", "Deals", "Activities", "Orders", "Invoices", "Tickets", "Leads", "Campaigns"].map((entity) => (
                <label key={entity} className="flex items-center gap-2 p-2 rounded border text-sm hover:bg-muted/50 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  {entity}
                </label>
              ))}
            </div>
          </div>
        </BentoCard>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl border mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Save Report</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSaveDialog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input placeholder="Report name" value={reportName} onChange={(e) => setReportName(e.target.value)} />
                <div className="text-sm text-muted-foreground">
                  Report type: <Badge variant="outline" className="capitalize">{reportType}</Badge>
                </div>
                <Button onClick={saveReport} className="w-full" disabled={!reportName.trim()}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
