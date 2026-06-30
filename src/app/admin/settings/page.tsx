"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Settings, Save, Globe, Users, Bell, Shield, Plus, Trash2,
  MessageSquare, Eye, Key, Database, X, Check, Loader2, Copy,
} from "lucide-react";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState("my-workspace");
  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");

  const [customFields, setCustomFields] = useState<any[]>([]);
  const [newField, setNewField] = useState({ name: "", entityType: "contact", fieldType: "text" });

  const [chatSettings, setChatSettings] = useState<any>({ enabled: true, widgetColor: "#6366f1", widgetTitle: "Chat with us", greeting: "Hi! How can we help?" });
  const [chatLoading, setChatLoading] = useState(false);

  const [trackingCode, setTrackingCode] = useState("");

  const [permissions, setPermissions] = useState<any>({});

  const [activeTab, setActiveTab] = useState("workspace");

  useEffect(() => {
    loadCustomFields();
    loadChatSettings();
    loadPermissions();
    generateTrackingCode();
  }, []);

  async function loadCustomFields() {
    try {
      const res = await fetch("/api/custom-fields?entityType=contact");
      if (res.ok) setCustomFields(await res.json());
    } catch {}
  }

  async function addCustomField() {
    if (!newField.name) return;
    try {
      const res = await fetch("/api/custom-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newField),
      });
      if (res.ok) {
        toast.success("Custom field added");
        setNewField({ name: "", entityType: "contact", fieldType: "text" });
        loadCustomFields();
      }
    } catch {}
  }

  async function deleteField(id: number) {
    await fetch(`/api/custom-fields?id=${id}`, { method: "DELETE" });
    loadCustomFields();
    toast.success("Field deleted");
  }

  async function loadChatSettings() {
    try {
      const res = await fetch("/api/chat/widget");
      if (res.ok) setChatSettings(await res.json());
    } catch {}
  }

  async function saveChatSettings() {
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settings", ...chatSettings }),
      });
      if (res.ok) toast.success("Chat settings saved");
    } catch {} finally {
      setChatLoading(false);
    }
  }

  async function loadPermissions() {
    try {
      const res = await fetch("/api/permissions");
      if (res.ok) setPermissions(await res.json());
    } catch {}
  }

  function generateTrackingCode() {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    setTrackingCode(
      `<script>\n(function(o,r,y,n){\n  var w=o.location.hostname;\n  var d=o.createElement("script");\n  d.async=1;\n  d.src="${baseUrl}/api/web-track?domain="+w+"&page="+y;\n  o.head.appendChild(d);\n})(window,"r","y","n");\n</script>`
    );
  }

  function copyCode() {
    navigator.clipboard?.writeText(trackingCode);
    toast.success("Copied to clipboard");
  }

  function saveSettings() { toast.success("Workspace settings saved"); }

  const tabs = [
    { id: "workspace", label: "Workspace", icon: Settings },
    { id: "custom-fields", label: "Custom Fields", icon: Database },
    { id: "chat", label: "Live Chat", icon: MessageSquare },
    { id: "tracking", label: "Web Tracking", icon: Eye },
    { id: "permissions", label: "Permissions", icon: Shield },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your workspace configuration</p>
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
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "workspace" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium">Workspace</h3>
                <p className="text-sm text-muted-foreground">Manage workspace settings.</p>
              </div>
              <div className="lg:col-span-2">
                <BentoCard>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Workspace Name</label>
                        <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Slug</label>
                        <Input value={workspaceSlug} onChange={(e) => setWorkspaceSlug(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Timezone</label>
                        <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                          <option value="UTC">UTC</option>
                          <option value="US/Eastern">US/Eastern</option>
                          <option value="US/Pacific">US/Pacific</option>
                          <option value="Europe/London">Europe/London</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Currency</label>
                        <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={saveSettings}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                  </div>
                </BentoCard>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium">Team</h3>
                <p className="text-sm text-muted-foreground">Team members and roles.</p>
              </div>
              <div className="lg:col-span-2">
                <BentoCard>
                  <div className="space-y-3">
                    {[
                      { name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
                      { name: "Bob Smith", email: "bob@example.com", role: "Manager" },
                      { name: "Carol Davis", email: "carol@example.com", role: "Employee" },
                    ].map((member) => (
                      <div key={member.email} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}

        {activeTab === "custom-fields" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Custom Fields</h3>
              <p className="text-sm text-muted-foreground">Add custom data fields to contacts, deals, and other entities.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Field Name</label>
                      <Input placeholder="e.g. Company Size" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Entity</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={newField.entityType} onChange={(e) => setNewField({ ...newField, entityType: e.target.value })}>
                        <option value="contact">Contact</option>
                        <option value="deal">Deal</option>
                        <option value="ticket">Ticket</option>
                        <option value="company">Company</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type</label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={newField.fieldType} onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="select">Select</option>
                        <option value="boolean">Yes/No</option>
                      </select>
                    </div>
                    <Button onClick={addCustomField}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                  </div>
                  <div className="space-y-2">
                    {customFields.length === 0 && <p className="text-sm text-muted-foreground">No custom fields yet.</p>}
                    {customFields.map((f: any) => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.entityType} · {f.fieldType}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteField(f.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </BentoCard>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Configure the chat widget appearance and behavior.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Enable Chat Widget</label>
                    <button
                      onClick={() => setChatSettings({ ...chatSettings, enabled: !chatSettings.enabled })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${chatSettings.enabled ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${chatSettings.enabled ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Widget Title</label>
                      <Input value={chatSettings.widgetTitle || ""} onChange={(e) => setChatSettings({ ...chatSettings, widgetTitle: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Accent Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={chatSettings.widgetColor || "#6366f1"} onChange={(e) => setChatSettings({ ...chatSettings, widgetColor: e.target.value })} className="h-10 w-16 rounded border cursor-pointer" />
                        <Input value={chatSettings.widgetColor || ""} onChange={(e) => setChatSettings({ ...chatSettings, widgetColor: e.target.value })} className="flex-1" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-1 block">Greeting Message</label>
                      <Input value={chatSettings.greeting || ""} onChange={(e) => setChatSettings({ ...chatSettings, greeting: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={saveChatSettings} disabled={chatLoading}>
                    {chatLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Widget Settings
                  </Button>
                </div>
              </BentoCard>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Web Tracking</h3>
              <p className="text-sm text-muted-foreground">Embed this tracking script on your website to track visitors.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{trackingCode}</pre>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paste this script just before the <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag on your website.
                    Page views will be tracked and associated with contacts based on their session.
                  </p>
                </div>
              </BentoCard>
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">Role Permissions</h3>
              <p className="text-sm text-muted-foreground">What each role can access across the system.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Entity</th>
                        <th className="text-center py-2 px-2 font-medium">Admin</th>
                        <th className="text-center py-2 px-2 font-medium">Manager</th>
                        <th className="text-center py-2 px-2 font-medium">Employee</th>
                        <th className="text-center py-2 px-2 font-medium">Client</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["contacts", "deals", "products", "orders", "invoices", "tickets", "email", "reports", "automation", "settings"].map((entity) => (
                        <tr key={entity} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium capitalize">{entity}</td>
                          {(["admin", "manager", "employee", "client"] as const).map((role) => {
                            const pm = permissions[role]?.[entity];
                            const level = pm || (role === "admin" ? "write" : role === "client" ? "own" : "read");
                            const levelLabel = level === "write" ? "Write" : level === "own" ? "Own" : "Read";
                            return (
                              <td key={role} className="text-center py-2 px-2">
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                  level === "write" ? "bg-green-100 text-green-700" :
                                  level === "own" ? "bg-blue-100 text-blue-700" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {level === "write" && <Check className="h-3 w-3" />}
                                  {levelLabel}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BentoCard>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
