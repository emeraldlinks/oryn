"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings, Save, Globe, Users, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState("my-workspace");
  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");

  function saveSettings() {
    toast.success("Settings saved successfully");
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your workspace configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Workspace</h3>
            <p className="text-sm text-muted-foreground">Manage your workspace settings and preferences.</p>
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
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Team</h3>
            <p className="text-sm text-muted-foreground">Manage team members and roles.</p>
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
      </div>
    </DashboardShell>
  );
}
