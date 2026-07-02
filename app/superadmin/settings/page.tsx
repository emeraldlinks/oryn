"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Mail, Shield, Bell, Palette, Save } from "lucide-react";

export default function SuperAdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
                <Input defaultValue="Oryn" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input type="email" defaultValue="support@oryn.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Locale</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
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
                <Input defaultValue="smtp.sendgrid.net" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SMTP Port</label>
                <Input defaultValue="587" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Name</label>
                <Input defaultValue="Oryn CRM" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Email</label>
                <Input type="email" defaultValue="noreply@oryn.com" />
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
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="standard">Standard (8+ chars)</option>
                  <option value="strong">Strong (12+ chars, special)</option>
                  <option value="strict">Strict (16+ chars, 2FA required)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Timeout</label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate Limit (req/min)</label>
                <Input type="number" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Login Attempts</label>
                <Input type="number" defaultValue="5" />
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
            {saved && <Badge variant="success">Saved successfully</Badge>}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
