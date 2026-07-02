"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, Shield, Save, Loader2 } from "lucide-react";

export default function SuperAdminSettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch("/api/superadmin/settings")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setForm(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/superadmin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  function set<K extends string>(key: K, value: string) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Global configuration for the entire platform</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">General</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input value={form.platformName || ""} onChange={(e) => set("platformName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input type="email" value={form.supportEmail || ""} onChange={(e) => set("supportEmail", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Locale</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.defaultLocale || "en"} onChange={(e) => set("defaultLocale", e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.timezone || "UTC"} onChange={(e) => set("timezone", e.target.value)}>
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern (EST)</option>
                  <option value="PST">Pacific (PST)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">SMTP Host</label>
                <Input value={form.smtpHost || ""} onChange={(e) => set("smtpHost", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SMTP Port</label>
                <Input value={form.smtpPort || ""} onChange={(e) => set("smtpPort", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Name</label>
                <Input value={form.fromName || ""} onChange={(e) => set("fromName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Email</label>
                <Input type="email" value={form.fromEmail || ""} onChange={(e) => set("fromEmail", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Policy</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.passwordPolicy || "standard"} onChange={(e) => set("passwordPolicy", e.target.value)}>
                  <option value="standard">Standard (8+ chars)</option>
                  <option value="strong">Strong (12+ chars, special)</option>
                  <option value="strict">Strict (16+ chars, 2FA required)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Timeout</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.sessionTimeout || "60"} onChange={(e) => set("sessionTimeout", e.target.value)}>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate Limit (req/min)</label>
                <Input type="number" value={form.rateLimit || "100"} onChange={(e) => set("rateLimit", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Login Attempts</label>
                <Input type="number" value={form.maxLoginAttempts || "5"} onChange={(e) => set("maxLoginAttempts", e.target.value)} />
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
            </Button>
            {saved && <Badge variant="success">Saved successfully</Badge>}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
