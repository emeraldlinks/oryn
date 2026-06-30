"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Target, DollarSign, Users, TrendingUp, Activity, Loader2 } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 42000, costs: 28000 },
  { month: "Feb", revenue: 45000, costs: 29000 },
  { month: "Mar", revenue: 48000, costs: 30000 },
  { month: "Apr", revenue: 52000, costs: 31000 },
  { month: "May", revenue: 58000, costs: 32000 },
  { month: "Jun", revenue: 65000, costs: 34000 },
  { month: "Jul", revenue: 72000, costs: 36000 },
  { month: "Aug", revenue: 84000, costs: 38000 },
  { month: "Sep", revenue: 78000, costs: 37000 },
  { month: "Oct", revenue: 82000, costs: 39000 },
  { month: "Nov", revenue: 86000, costs: 40000 },
  { month: "Dec", revenue: 91000, costs: 42000 },
];

const pipelineData = [
  { name: "Lead", value: 48 },
  { name: "Qualified", value: 32 },
  { name: "Proposal", value: 18 },
  { name: "Negotiation", value: 12 },
  { name: "Closed Won", value: 24 },
];

const pieColors = ["#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b", "#10b981"];

const leadSources = [
  { source: "Website", value: 45 },
  { source: "Referral", value: 25 },
  { source: "Social", value: 18 },
  { source: "Email", value: 12 },
];

const weeklyActivity = [
  { day: "Mon", calls: 12, emails: 24, meetings: 4 },
  { day: "Tue", calls: 15, emails: 20, meetings: 6 },
  { day: "Wed", calls: 18, emails: 28, meetings: 5 },
  { day: "Thu", calls: 10, emails: 22, meetings: 3 },
  { day: "Fri", calls: 14, emails: 18, meetings: 7 },
  { day: "Sat", calls: 5, emails: 8, meetings: 1 },
  { day: "Sun", calls: 2, emails: 4, meetings: 0 },
];

export default function AdminPage() {
  const [stats, setStats] = useState({ deals: 0, contacts: 0, revenue: 0, rate: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [dealsRes, contactsRes] = await Promise.all([
          fetch("/api/crm/deals"),
          fetch("/api/crm/contacts"),
        ]);
        const deals = await dealsRes.json();
        const contacts = await contactsRes.json();
        const activeDeals = deals.filter((d: any) => d.stage !== "closed-lost" && d.stage !== "closed-won");
        const won = deals.filter((d: any) => d.stage === "closed-won");
        const totalRevenue = won.reduce((s: number, d: any) => s + d.value, 0);
        const totalDeals = deals.length;
        const rate = totalDeals > 0 ? Math.round((won.length / totalDeals) * 100) : 0;
        setStats({
          deals: activeDeals.length,
          contacts: contacts.length,
          revenue: totalRevenue,
          rate,
        });
      } catch {}
    }
    load();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your workspace at a glance</p>
        </div>

        <BentoGrid>
          <StatCard title="Active Deals" value={stats.deals} icon={Target} />
          <StatCard title="Revenue (YTD)" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Total Contacts" value={stats.contacts} icon={Users} />
          <StatCard title="Win Rate" value={`${stats.rate}%`} icon={TrendingUp} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Pipeline</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pipelineData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="source" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>
        </BentoGrid>

        <BentoCard colSpan={4}>
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="calls" name="Calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="emails" name="Emails" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meetings" name="Meetings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
