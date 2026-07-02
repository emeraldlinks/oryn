"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line,
} from "recharts";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Building2, Users, CreditCard, Activity, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

const platformGrowth = [
  { month: "Jan", workspaces: 850, users: 15200, revenue: 210000 },
  { month: "Feb", workspaces: 920, users: 16800, revenue: 228000 },
  { month: "Mar", workspaces: 980, users: 18200, revenue: 245000 },
  { month: "Apr", workspaces: 1050, users: 19800, revenue: 262000 },
  { month: "May", workspaces: 1120, users: 21500, revenue: 278000 },
  { month: "Jun", workspaces: 1200, users: 23100, revenue: 284000 },
  { month: "Jul", workspaces: 1284, users: 24391, revenue: 284500 },
];

const systemMetrics = [
  { name: "API", latency: 142, errorRate: 0.02, uptime: 99.97 },
  { name: "DB", latency: 8, errorRate: 0.01, uptime: 99.99 },
  { name: "Cache", latency: 2, errorRate: 0, uptime: 100 },
  { name: "Queue", latency: 45, errorRate: 0.15, uptime: 99.85 },
];

export default function SuperAdminPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground">Super admin control panel</p>
        </div>

        <BentoGrid>
          <StatCard
            title="Total Workspaces"
            value="1,284"
            icon={Building2}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Active Users"
            value="24,391"
            icon={Users}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="MRR"
            value="$284,500"
            icon={CreditCard}
            trend={{ value: 15, positive: true }}
          />
          <StatCard
            title="Churn Rate"
            value="2.1%"
            icon={TrendingUp}
            trend={{ value: 0.3, positive: false }}
          />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Platform Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platformGrowth}>
                  <defs>
                    <linearGradient id="wsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="workspaces" stroke="#3b82f6" fill="url(#wsGrad)" strokeWidth={2} name="Workspaces" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemMetrics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="latency" name="Latency (ms)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="errorRate" name="Error Rate (%)" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "New workspace created", user: "Acme Corp", time: "2 min ago", type: "create" },
                { action: "Plan upgraded to Scale", user: "TechFlow Inc", time: "15 min ago", type: "upgrade" },
                { action: "User suspended", user: "jane@example.com", time: "1 hour ago", type: "alert" },
                { action: "Payment failed", user: "StartupXYZ", time: "3 hours ago", type: "error" },
                { action: "New integration installed", user: "GlobalTech", time: "5 hours ago", type: "create" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.type === "error"
                          ? "bg-red-500"
                          : item.type === "alert"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
