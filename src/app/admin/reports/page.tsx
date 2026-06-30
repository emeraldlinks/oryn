"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3, TrendingUp, DollarSign, Users, Target,
  Download, FileText,
} from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("pipeline");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const mockData = {
    pipeline: {
      total: "$874,000",
      won: "$412,000",
      avgDealSize: "$24,500",
      velocity: "18 days",
    },
    revenue: {
      mrr: "$48,200",
      arr: "$578,400",
      growth: "15.3%",
      churn: "2.1%",
    },
    performance: {
      dealsClosed: "24",
      leadsGenerated: "142",
      conversionRate: "23.4%",
      avgResponseTime: "4.2h",
    },
  };

  const data = mockData[reportType as keyof typeof mockData];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Custom report builder and dashboards</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "pipeline", label: "Pipeline", icon: Target },
            { key: "revenue", label: "Revenue", icon: DollarSign },
            { key: "performance", label: "Performance", icon: TrendingUp },
          ].map((r) => {
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
          <Button variant="outline">Apply</Button>
          <Button variant="outline" className="ml-auto">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>

        <BentoGrid>
          {data && Object.entries(data).map(([key, value]) => (
            <StatCard
              key={key}
              title={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              value={value}
              icon={BarChart3}
            />
          ))}
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
      </div>
    </DashboardShell>
  );
}
