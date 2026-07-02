"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
  Puzzle, Plus, Trash2, Save, Loader2, X, Check, Edit3,
  FolderOpen, Upload, Store, Globe, ExternalLink, Play,
  Package, Download, Box, ToggleLeft, ToggleRight,
} from "lucide-react";

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
  config?: string;
}

interface MarketplaceListing {
  id: string;
  name: string;
  type: string;
  version: string;
  author: string;
  description: string;
  installed?: boolean;
}

const EXTENSION_TYPES = ["page", "action", "model", "webhook", "ai_tool", "widget"];

const MARKETPLACE_TYPES = ["app", "connector", "theme", "workflow-pack", "extension"];

const typeColors: Record<string, string> = {
  app: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  connector: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  theme: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
  "workflow-pack": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  extension: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
};

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState("plugins");
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
  const [editForm, setEditForm] = useState({ name: "", version: "", author: "", description: "", enabled: true });

  const [storeListings, setStoreListings] = useState<MarketplaceListing[]>([]);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeTypeFilter, setStoreTypeFilter] = useState("all");
  const [installingId, setInstallingId] = useState<string | null>(null);

  const [manifestJson, setManifestJson] = useState("");
  const [extensionsJson, setExtensionsJson] = useState("");
  const [uploading, setUploading] = useState(false);

  const [addingExtension, setAddingExtension] = useState<Plugin | null>(null);
  const [extForm, setExtForm] = useState({ type: "page", name: "", config: "{}" });
  const [extSaving, setExtSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pluginsRes, extRes] = await Promise.all([
        fetch("/api/admin/plugins"),
        fetch("/api/admin/plugin-extensions"),
      ]);
      if (pluginsRes.ok) setPlugins(await pluginsRes.json());
      if (extRes.ok) setExtensions(await extRes.json());
    } catch {
      toast.error("Failed to load plugins");
    } finally {
      setLoading(false);
    }
  }

  async function updatePlugin(id: number, data: Partial<Plugin>) {
    try {
      const res = await fetch(`/api/admin/plugins?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Plugin updated");
        setEditingPlugin(null);
        loadData();
      } else {
        toast.error("Failed to update plugin");
      }
    } catch {
      toast.error("Failed to update plugin");
    }
  }

  async function deletePlugin(id: number) {
    try {
      const res = await fetch(`/api/admin/plugins?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Plugin deleted");
        loadData();
      } else {
        toast.error("Failed to delete plugin");
      }
    } catch {
      toast.error("Failed to delete plugin");
    }
  }

  async function togglePlugin(id: number, enabled: boolean) {
    await updatePlugin(id, { enabled: !enabled });
  }

  function openEdit(p: Plugin) {
    setEditingPlugin(p);
    setEditForm({
      name: p.name,
      version: p.version,
      author: p.author,
      description: p.description || "",
      enabled: p.enabled,
    });
  }

  async function loadStore() {
    setStoreLoading(true);
    try {
      const res = await fetch("/api/admin/marketplace");
      if (res.ok) {
        setStoreListings(await res.json());
      } else {
        toast.error("Failed to load marketplace");
      }
    } catch {
      toast.error("Failed to load marketplace");
    } finally {
      setStoreLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "store" && storeListings.length === 0 && !storeLoading) {
      loadStore();
    }
  }, [activeTab]);

  async function installFromStore(listingId: string) {
    setInstallingId(listingId);
    try {
      const res = await fetch("/api/admin/installed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        toast.success("Plugin installed");
        setStoreListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, installed: true } : l))
        );
        loadData();
      } else {
        toast.error("Failed to install plugin");
      }
    } catch {
      toast.error("Failed to install plugin");
    } finally {
      setInstallingId(null);
    }
  }

  async function uploadPlugin() {
    setUploading(true);
    try {
      const body: Record<string, unknown> = {};
      if (manifestJson.trim()) {
        try { body.manifest = JSON.parse(manifestJson); } catch { toast.error("Invalid manifest JSON"); setUploading(false); return; }
      }
      if (extensionsJson.trim()) {
        try { body.extensions = JSON.parse(extensionsJson); } catch { toast.error("Invalid extensions JSON"); setUploading(false); return; }
      }
      const res = await fetch("/api/plugins/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Plugin uploaded successfully");
        setManifestJson("");
        setExtensionsJson("");
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to upload plugin");
      }
    } catch {
      toast.error("Failed to upload plugin");
    } finally {
      setUploading(false);
    }
  }

  async function saveExtension() {
    if (!addingExtension) return;
    setExtSaving(true);
    try {
      let parsedConfig: Record<string, unknown> = {};
      try {
        parsedConfig = JSON.parse(extForm.config);
      } catch {
        toast.error("Invalid config JSON");
        setExtSaving(false);
        return;
      }
      const res = await fetch("/api/admin/plugin-extensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pluginId: addingExtension.id,
          type: extForm.type,
          name: extForm.name,
          config: parsedConfig,
        }),
      });
      if (res.ok) {
        toast.success("Extension added");
        setAddingExtension(null);
        setExtForm({ type: "page", name: "", config: "{}" });
        loadData();
      } else {
        toast.error("Failed to add extension");
      }
    } catch {
      toast.error("Failed to add extension");
    } finally {
      setExtSaving(false);
    }
  }

  const extensionsByPlugin = extensions.reduce((acc, ext) => {
    const key = ext.pluginName || `plugin-${ext.pluginId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ext);
    return acc;
  }, {} as Record<string, Extension[]>);

  const filteredStoreListings =
    storeTypeFilter === "all"
      ? storeListings
      : storeListings.filter((l) => l.type === storeTypeFilter);

  const installedCount = plugins.length;
  const extensionCount = extensions.length;

  const tabs = [
    { id: "plugins", label: "Installed Plugins", icon: Puzzle },
    { id: "store", label: "Plugin Store", icon: Store },
    { id: "upload", label: "Upload Plugin", icon: Upload },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Plugins</h1>
            <p className="text-muted-foreground">
              Manage plugins, browse the store, and upload new plugins
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" /> {installedCount} installed
            </span>
            <span className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" /> {extensionCount} extensions
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
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

        {activeTab === "plugins" && (
          <div className="space-y-6">
            <BentoCard>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Puzzle className="h-5 w-5" /> Installed Plugins
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-medium pl-4">Name</th>
                      <th className="text-left py-3 px-2 font-medium">Version</th>
                      <th className="text-left py-3 px-2 font-medium">Author</th>
                      <th className="text-left py-3 px-2 font-medium">Permissions</th>
                      <th className="text-center py-3 px-2 font-medium">Enabled</th>
                      <th className="text-right py-3 pl-4 pr-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                        </td>
                      </tr>
                    ) : plugins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                          No plugins installed. Browse the store or upload one.
                        </td>
                      </tr>
                    ) : (
                      plugins.map((p) => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                          <td className="py-3 pr-4 pl-4">
                            <Link
                              href={`/admin/plugins/${p.name}`}
                              className="font-medium hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              {p.name}
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </Link>
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground">v{p.version}</td>
                          <td className="py-3 px-2 text-xs text-muted-foreground">{p.author}</td>
                          <td className="py-3 px-2">
                            <div className="flex flex-wrap gap-1">
                              {p.permissions && p.permissions.length > 0 ? (
                                p.permissions.map((perm) => (
                                  <Badge key={perm} variant="outline" className="text-[10px] px-1.5 py-0">
                                    {perm}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => togglePlugin(p.id, p.enabled)}
                              className={`relative w-9 h-5 rounded-full transition-colors ${
                                p.enabled ? "bg-primary" : "bg-muted"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                  p.enabled ? "translate-x-4" : ""
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-3 pl-4 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEdit(p)}
                                title="Edit plugin"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => deletePlugin(p.id)}
                                title="Delete plugin"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setAddingExtension(p);
                                  setExtForm({ type: "page", name: "", config: "{}" });
                                }}
                                title="Add extension"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </BentoCard>

            {Object.keys(extensionsByPlugin).length > 0 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" /> Extensions by Plugin
                </h2>
                {Object.entries(extensionsByPlugin).map(([pluginName, exts]) => {
                  const plugin = plugins.find(
                    (p) => p.name === pluginName || `plugin-${p.id}` === pluginName
                  );
                  return (
                    <BentoCard key={pluginName}>
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold">{pluginName}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const target = plugin || plugins.find((p) => p.name === pluginName);
                            if (target) {
                              setAddingExtension(target);
                              setExtForm({ type: "page", name: "", config: "{}" });
                            }
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Extension
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4 font-medium pl-4">Type</th>
                              <th className="text-left py-2 px-2 font-medium">Name</th>
                              <th className="text-center py-2 px-2 font-medium">Active</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exts.map((ext) => (
                              <tr key={ext.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                                <td className="py-3 pr-4 pl-4">
                                  <Badge variant="secondary" className="capitalize">{ext.type}</Badge>
                                </td>
                                <td className="py-3 px-2">{ext.name}</td>
                                <td className="py-3 px-2 text-center">
                                  {ext.active ? (
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "store" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Store className="h-5 w-5" /> Plugin Store
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setStoreTypeFilter("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    storeTypeFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {MARKETPLACE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setStoreTypeFilter(type)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                      storeTypeFilter === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {storeLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStoreListings.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                {storeListings.length === 0
                  ? "No marketplace listings available."
                  : "No listings match the selected type."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStoreListings.map((listing) => (
                  <BentoCard key={listing.id} className="flex flex-col">
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{listing.name}</h3>
                        </div>
                        <Badge className={`text-[10px] ${typeColors[listing.type] || ""}`}>
                          {listing.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>v{listing.version}</span>
                        <span>by {listing.author}</span>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1 line-clamp-3">
                        {listing.description || "No description provided."}
                      </p>
                      <div className="mt-4 pt-3 border-t border-border">
                        {listing.installed ? (
                          <Badge variant="success" className="w-full justify-center">
                            <Check className="h-3 w-3 mr-1" /> Installed
                          </Badge>
                        ) : (
                          <Button
                            className="w-full"
                            size="sm"
                            onClick={() => installFromStore(listing.id)}
                            disabled={installingId === listing.id}
                          >
                            {installingId === listing.id ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Installing
                              </>
                            ) : (
                              <>
                                <Download className="mr-1 h-3 w-3" /> Install
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="max-w-2xl">
            <BentoCard>
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Upload Plugin
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide manifest and/or extensions JSON to upload a new plugin.
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Manifest JSON</label>
                  <textarea
                    value={manifestJson}
                    onChange={(e) => setManifestJson(e.target.value)}
                    placeholder='{"name": "MyPlugin", "version": "1.0.0", "author": "You", "entryPoint": "index.ts"}'
                    className="w-full h-40 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Extensions JSON</label>
                  <textarea
                    value={extensionsJson}
                    onChange={(e) => setExtensionsJson(e.target.value)}
                    placeholder='[{ "type": "page", "name": "my-page", "config": {} }]'
                    className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={uploadPlugin} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Upload Plugin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </BentoCard>
          </div>
        )}

        {editingPlugin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Plugin</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPlugin(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Version</label>
                  <Input
                    value={editForm.version}
                    onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Author</label>
                  <Input
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Enabled</label>
                  <button
                    onClick={() => setEditForm({ ...editForm, enabled: !editForm.enabled })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      editForm.enabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        editForm.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingPlugin(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updatePlugin(editingPlugin.id, editForm)}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {addingExtension && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Add Extension to <span className="text-primary">{addingExtension.name}</span>
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAddingExtension(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Extension Type</label>
                  <select
                    value={extForm.type}
                    onChange={(e) => setExtForm({ ...extForm, type: e.target.value })}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  >
                    {EXTENSION_TYPES.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={extForm.name}
                    onChange={(e) => setExtForm({ ...extForm, name: e.target.value })}
                    placeholder="my-extension"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Config (JSON)</label>
                  <textarea
                    value={extForm.config}
                    onChange={(e) => setExtForm({ ...extForm, config: e.target.value })}
                    placeholder='{"key": "value"}'
                    className="w-full h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAddingExtension(null)}>
                  Cancel
                </Button>
                <Button onClick={saveExtension} disabled={extSaving}>
                  {extSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add Extension
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
