"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Puzzle, Globe, Zap, Database, Webhook, Brain, Layout, Play, ExternalLink } from "lucide-react";

interface Plugin {
  id: number;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
  entryPoint?: string;
  permissions?: string[];
}

interface Extension {
  id: number;
  pluginId: number;
  pluginName?: string;
  type: string;
  name: string;
  active: boolean;
  config?: Record<string, unknown>;
}

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;

  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Page");
  const [toggling, setToggling] = useState(false);

  useEffect(() => { loadData(); }, [name]);

  async function loadData() {
    try {
      const pluginsRes = await fetch("/api/admin/plugins");
      if (!pluginsRes.ok) throw new Error("Failed to fetch plugins");
      const plugins: Plugin[] = await pluginsRes.json();
      const found = plugins.find((p) => p.name === name);
      if (!found) { setLoading(false); return; }
      setPlugin(found);
      const extRes = await fetch(`/api/admin/plugin-extensions?pluginId=${found.id}`);
      if (extRes.ok) setExtensions(await extRes.json());
    } catch {
      toast.error("Failed to load plugin data");
    } finally {
      setLoading(false);
    }
  }

  async function togglePlugin(enabled: boolean) {
    if (!plugin) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/admin/plugins?id=${plugin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) {
        setPlugin({ ...plugin, enabled: !enabled });
        toast.success(`Plugin ${!enabled ? "enabled" : "disabled"}`);
      } else {
        toast.error("Failed to toggle plugin");
      }
    } catch {
      toast.error("Failed to toggle plugin");
    } finally {
      setToggling(false);
    }
  }

  async function runAction(ext: Extension) {
    try {
      const res = await fetch(`/api/plugins/${name}/actions/${ext.name}`, { method: "POST" });
      if (res.ok) toast.success(`Action "${ext.name}" executed`);
      else toast.error("Action failed");
    } catch {
      toast.error("Failed to run action");
    }
  }

  const tabTypes = [
    { id: "Page", label: "Pages", icon: Layout },
    { id: "Action", label: "Actions", icon: Zap },
    { id: "Model", label: "Models", icon: Database },
    { id: "Webhook", label: "Webhooks", icon: Globe },
    { id: "AiTool", label: "AI Tools", icon: Brain },
    { id: "Widget", label: "Widgets", icon: Puzzle },
  ];

  const filteredExtensions = extensions.filter((ext) => ext.type === activeTab);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  if (!plugin) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => router.push("/admin/plugins")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plugins
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Plugin not found.</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/admin/plugins")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plugins
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Puzzle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{plugin.name}</h1>
              <p className="text-sm text-muted-foreground">
                v{plugin.version} by {plugin.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {plugin.enabled ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={() => togglePlugin(plugin.enabled)}
              disabled={toggling}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                plugin.enabled ? "bg-primary" : "bg-muted"
              } disabled:opacity-50`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  plugin.enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {plugin.description && (
          <p className="text-muted-foreground">{plugin.description}</p>
        )}

        {plugin.permissions && plugin.permissions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {plugin.permissions.map((perm) => (
              <Badge key={perm} variant="secondary">
                {perm}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabTypes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <BentoCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium">Name</th>
                  <th className="text-center py-2 px-2 font-medium">Active</th>
                  <th className="text-right py-2 pl-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExtensions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                      No {activeTab.toLowerCase()} extensions found.
                    </td>
                  </tr>
                ) : (
                  filteredExtensions.map((ext) => (
                    <tr key={ext.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{ext.name}</td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            ext.active ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                      </td>
                      <td className="py-3 pl-4 text-right">
                        {ext.type === "Page" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/plugins/${name}/${ext.name}`)
                            }
                          >
                            <ExternalLink className="mr-1 h-3 w-3" /> View Page
                          </Button>
                        )}
                        {ext.type === "Action" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runAction(ext)}
                          >
                            <Play className="mr-1 h-3 w-3" /> Run Action
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
