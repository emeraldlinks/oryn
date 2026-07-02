"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft, Layout, TrendingUp, TrendingDown, Activity, Clock,
  CheckCircle, XCircle, AlertCircle, Loader2, BarChart3, Send,
} from "lucide-react";

interface StatsSection {
  type: "stats";
  title?: string;
  stats: Array<{ label: string; value: string; change?: string; icon?: string }>;
}

interface TableSection {
  type: "table";
  title?: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string>>;
}

interface ChartSection {
  type: "chart";
  title?: string;
  chartType: "bar" | "line" | "pie" | "area";
  labels?: string[];
  datasets?: Array<{ label: string; data: number[]; color?: string }>;
}

interface FormSection {
  type: "form";
  title?: string;
  formFields: Array<{ name: string; label: string; type: string; required?: boolean; options?: string[] }>;
}

interface ListSection {
  type: "list" | "activity";
  title?: string;
  items: Array<{ title: string; description: string; status?: string; date?: string }>;
}

interface HeroSection {
  type: "hero";
  title?: string;
  items?: Array<{ title: string; description: string }>;
}

type Section = StatsSection | TableSection | ChartSection | FormSection | ListSection | HeroSection;

interface PageConfig {
  title?: string;
  description?: string;
  sections?: Section[];
}

function StatIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  const icons: Record<string, React.ReactNode> = {
    Activity: <Activity className="h-5 w-5" />,
    Clock: <Clock className="h-5 w-5" />,
    CheckCircle: <CheckCircle className="h-5 w-5" />,
    XCircle: <XCircle className="h-5 w-5" />,
    AlertCircle: <AlertCircle className="h-5 w-5" />,
    TrendingUp: <TrendingUp className="h-5 w-5" />,
    TrendingDown: <TrendingDown className="h-5 w-5" />,
    BarChart3: <BarChart3 className="h-5 w-5" />,
    Send: <Send className="h-5 w-5" />,
  };
  return <>{icons[icon] || null}</>;
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const variantMap: Record<string, string> = {
    completed: "success",
    resolved: "success",
    published: "success",
    sent: "default",
    scheduled: "warning",
    pending: "warning",
    "in progress": "warning",
    draft: "secondary",
    open: "default",
    failed: "destructive",
  };
  const variant = variantMap[status.toLowerCase()] || "secondary";
  return <Badge variant={variant as any}>{status}</Badge>;
}

function renderChartBars(section: ChartSection) {
  const { datasets, labels } = section;
  if (!datasets?.length) return <p className="text-sm text-muted-foreground">No chart data available.</p>;
  const data = datasets[0].data;
  const maxVal = Math.max(...data, 1);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BarChart3 className="h-4 w-4" />
        <span>(Chart visualization requires recharts)</span>
      </div>
      <div className="space-y-2">
        {data.map((val, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-16 text-right text-xs text-muted-foreground shrink-0">
              {labels?.[i] || ""}
            </span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(val / maxVal) * 100}%`,
                  backgroundColor: datasets[0].color || "#6366f1",
                }}
              />
            </div>
            <span className="w-12 text-xs font-medium text-right">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(section: Section, idx: number) {
  switch (section.type) {
    case "stats": {
      const s = section as StatsSection;
      return (
        <BentoCard key={idx} colSpan={4}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {s.stats.map((stat, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                  <span className="text-muted-foreground">
                    <StatIcon icon={stat.icon} />
                  </span>
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
                {stat.change && (
                  <span className={`text-xs flex items-center gap-1 ${stat.change.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}>
                    {stat.change.startsWith("-") ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {stat.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </BentoCard>
      );
    }

    case "table": {
      const s = section as TableSection;
      if (!s.columns?.length) return null;
      return (
        <BentoCard key={idx} colSpan={4}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  {s.columns.map((col) => (
                    <th key={col.key} className="text-left p-3 font-medium text-muted-foreground">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    {s.columns.map((col) => (
                      <td key={col.key} className="p-3">{row[col.key] || ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>
      );
    }

    case "chart": {
      const s = section as ChartSection;
      return (
        <BentoCard key={idx} colSpan={4}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          {renderChartBars(s)}
        </BentoCard>
      );
    }

    case "form": {
      const s = section as FormSection;
      if (!s.formFields?.length) return null;
      return (
        <BentoCard key={idx} colSpan={2}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          <div className="space-y-4">
            {s.formFields.map((field, i) => (
              <div key={i}>
                <label className="text-sm font-medium mb-1 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "select" && field.options ? (
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <Input type={field.type} placeholder={field.label} />
                )}
              </div>
            ))}
            <Button
              onClick={() => toast.success("Form submitted (demo)")}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </BentoCard>
      );
    }

    case "list":
    case "activity": {
      const s = section as ListSection;
      if (!s.items?.length) return null;
      return (
        <BentoCard key={idx} colSpan={2}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          <div className="space-y-0">
            {s.items.map((item, i) => (
              <div key={i} className="relative pl-6 pb-5 last:pb-0">
                <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
                {i < s.items.length - 1 && (
                  <div className="absolute left-[4px] top-4 bottom-0 w-px bg-border" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.title}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      );
    }

    case "hero": {
      const s = section as HeroSection;
      return (
        <BentoCard key={idx} colSpan={4}>
          {s.title && <h3 className="text-lg font-semibold mb-4">{s.title}</h3>}
          <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            {s.items?.map((item, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </BentoCard>
      );
    }

    default:
      return null;
  }
}

export default function PluginPageRenderer() {
  const params = useParams();
  const name = params.name as string;
  const pageName = params.page as string;

  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageConfig();
  }, [name, pageName]);

  async function fetchPageConfig() {
    try {
      const pluginsRes = await fetch("/api/admin/plugins");
      if (!pluginsRes.ok) throw new Error("Failed to fetch plugins");
      const plugins: { id: number; name: string }[] = await pluginsRes.json();
      const plugin = plugins.find((p) => p.name === name);
      if (!plugin) { setLoading(false); return; }

      const extRes = await fetch(
        `/api/admin/plugin-extensions?pluginId=${plugin.id}&type=Page&name=${pageName}`
      );
      if (extRes.ok) {
        const extensions = await extRes.json();
        if (extensions.length > 0) {
          setConfig(extensions[0].config || null);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  const pageTitle = config?.title || pageName;
  const sections = config?.sections || [];
  const hasSections = sections.length > 0;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Link href={`/admin/plugins/${name}`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plugin
          </Button>
        </Link>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : hasSections ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
            </div>
            <BentoGrid>
              {sections.map((section, idx) => renderSection(section, idx))}
            </BentoGrid>
          </div>
        ) : config?.url && config?.iframe ? (
          <iframe
            src={config.url as string}
            className="w-full h-[calc(100vh-12rem)] rounded-xl border"
            title={pageName}
          />
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center">
            <Layout className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">{pageName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {config?.description
                ? (config.description as string)
                : "No configuration available for this page."}
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
