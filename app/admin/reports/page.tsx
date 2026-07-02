"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3, TrendingUp, DollarSign, Users, Target,
  Download, FileText, Calendar, Clock, PieChart,
  LineChart, Activity, Mail, ShoppingCart, Ticket,
  Phone, MessageSquare, Save, Plus, X, ChevronDown,
} from "lucide-react";

const reportTypes = [
  { key: "pipeline", label: "Pipeline", icon: Target },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "performance", label: "Performance", icon: TrendingUp },
  { key: "contacts", label: "Contacts", icon: Users },
  { key: "activities", label: "Activities", icon: Activity },
  { key: "support", label: "Support", icon: Ticket },
  { key: "email", label: "Email", icon: Mail },
];

const monthlyData: Record<string, { label: string; value: number; prevValue: number }[]> = {
  pipeline: [
    { label: "Jan", value: 450000, prevValue: 380000 },
    { label: "Feb", value: 520000, prevValue: 410000 },
    { label: "Mar", value: 480000, prevValue: 440000 },
    { label: "Apr", value: 610000, prevValue: 470000 },
    { label: "May", value: 580000, prevValue: 500000 },
    { label: "Jun", value: 720000, prevValue: 530000 },
  ],
  revenue: [
    { label: "Jan", value: 42000, prevValue: 38000 },
    { label: "Feb", value: 48000, prevValue: 40000 },
    { label: "Mar", value: 45000, prevValue: 41000 },
    { label: "Apr", value: 51000, prevValue: 43000 },
    { label: "May", value: 55000, prevValue: 46000 },
    { label: "Jun", value: 62000, prevValue: 49000 },
  ],
  contacts: [
    { label: "Jan", value: 180, prevValue: 120 },
    { label: "Feb", value: 220, prevValue: 150 },
    { label: "Mar", value: 260, prevValue: 190 },
    { label: "Apr", value: 300, prevValue: 230 },
    { label: "May", value: 340, prevValue: 260 },
    { label: "Jun", value: 410, prevValue: 300 },
  ],
  activities: [
    { label: "Jan", value: 420, prevValue: 350 },
    { label: "Feb", value: 480, prevValue: 380 },
    { label: "Mar", value: 520, prevValue: 410 },
    { label: "Apr", value: 580, prevValue: 440 },
    { label: "May", value: 610, prevValue: 490 },
    { label: "Jun", value: 680, prevValue: 520 },
  ],
  support: [
    { label: "Jan", value: 85, prevValue: 72 },
    { label: "Feb", value: 78, prevValue: 68 },
    { label: "Mar", value: 92, prevValue: 80 },
    { label: "Apr", value: 70, prevValue: 75 },
    { label: "May", value: 65, prevValue: 70 },
    { label: "Jun", value: 58, prevValue: 62 },
  ],
  email: [
    { label: "Jan", value: 1200, prevValue: 900 },
    { label: "Feb", value: 1500, prevValue: 1100 },
    { label: "Mar", value: 1800, prevValue: 1400 },
    { label: "Apr", value: 2100, prevValue: 1600 },
    { label: "May", value: 2400, prevValue: 1900 },
    { label: "Jun", value: 2800, prevValue: 2200 },
  ],
};

const metrics: Record<string, Record<string, { value: string; trend?: { value: number; positive: boolean } }>> = {
  pipeline: {
    totalPipeline: { value: "$874,000", trend: { value: 12, positive: true } },
    weightedPipeline: { value: "$521,000", trend: { value: 8, positive: true } },
    wonThisQuarter: { value: "$412,000", trend: { value: 22, positive: true } },
    avgDealSize: { value: "$24,500", trend: { value: 5, positive: true } },
  },
  revenue: {
    monthlyRecurring: { value: "$48,200", trend: { value: 15, positive: true } },
    annualRunRate: { value: "$578,400", trend: { value: 15, positive: true } },
    growthRate: { value: "15.3%", trend: { value: 3.2, positive: true } },
    churnRate: { value: "2.1%", trend: { value: 0.5, positive: true } },
  },
  performance: {
    dealsClosed: { value: "24", trend: { value: 18, positive: true } },
    leadsGenerated: { value: "142", trend: { value: 12, positive: true } },
    conversionRate: { value: "23.4%", trend: { value: 4.5, positive: true } },
    avgResponseTime: { value: "4.2h", trend: { value: 8, positive: true } },
  },
  contacts: {
    totalContacts: { value: "1,847", trend: { value: 22, positive: true } },
    newThisMonth: { value: "142", trend: { value: 15, positive: true } },
    activeLeads: { value: "324", trend: { value: 8, positive: true } },
    conversionRate: { value: "18.7%", trend: { value: 2.3, positive: true } },
  },
  activities: {
    totalCalls: { value: "847", trend: { value: 12, positive: true } },
    emailsSent: { value: "2,341", trend: { value: 18, positive: true } },
    meetingsHeld: { value: "124", trend: { value: 8, positive: true } },
    tasksCompleted: { value: "1,562", trend: { value: 24, positive: true } },
  },
  support: {
    openTickets: { value: "18", trend: { value: 12, positive: true } },
    resolvedThisWeek: { value: "42", trend: { value: 8, positive: true } },
    avgResponseTime: { value: "3.2h", trend: { value: 15, positive: true } },
    satisfactionRate: { value: "94%", trend: { value: 2, positive: true } },
  },
  email: {
    campaignsSent: { value: "12", trend: { value: 25, positive: true } },
    avgOpenRate: { value: "24.8%", trend: { value: 3.5, positive: true } },
    avgClickRate: { value: "4.2%", trend: { value: 1.2, positive: true } },
    totalRecipients: { value: "18,420" },
  },
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState("pipeline");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [reportName, setReportName] = useState("");

  const currentMetrics = metrics[reportType] || metrics.pipeline;
  const currentChartData = monthlyData[reportType] || monthlyData.pipeline;

  function exportReport() {
    toast.success("Report exported as PDF");
  }

  function saveReport() {
    if (!reportName.trim()) return;
    toast.success(`Report "${reportName}" saved`);
    setShowSaveDialog(false);
    setReportName("");
  }

  const maxValue = Math.max(...currentChartData.map((d) => Math.max(d.value, d.prevValue)));

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
          {Object.entries(currentMetrics).map(([key, metric]) => (
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
                {currentChartData.map((d) => (
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

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Insights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Top Performing</p>
                  <p className="text-sm font-medium mt-1">Q2 pipeline grew 24%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Driven by enterprise deals</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Needs Attention</p>
                  <p className="text-sm font-medium mt-1">Lead response time up</p>
                  <p className="text-xs text-muted-foreground mt-0.5">4.2h avg - target is under 2h</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Opportunity</p>
                  <p className="text-sm font-medium mt-1">Email campaigns growing</p>
                  <p className="text-xs text-muted-foreground mt-0.5">25% more sends this quarter</p>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Won</span>
                    <span className="font-medium">47%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "47%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Progress</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: "32%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lost</span>
                    <span className="font-medium">21%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: "21%" }} />
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
