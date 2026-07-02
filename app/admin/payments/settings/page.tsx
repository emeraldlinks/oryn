"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CreditCard, Save, Eye, EyeOff, Loader2, Check, AlertCircle } from "lucide-react";

export default function PaystackSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [form, setForm] = useState({
    publicKey: "",
    secretKey: "",
    webhookSecret: "",
    active: true,
  });

  useEffect(() => {
    fetch("/api/admin/payments/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.publicKey || d.secretKey) {
          setForm({ publicKey: d.publicKey || "", secretKey: d.secretKey || "", webhookSecret: d.webhookSecret || "", active: d.active !== false });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
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
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paystack Settings</h1>
            <p className="text-muted-foreground">Configure your Paystack payment gateway</p>
          </div>
        </div>

        <Card className="p-4 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">How to get your Paystack API keys</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>Log in to your <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer" className="underline">Paystack Dashboard</a></li>
                <li>Go to Settings → API Keys &amp; Webhooks</li>
                <li>Copy your Public Key and Secret Key</li>
                <li>Set up a webhook endpoint pointing to: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{typeof window !== "undefined" ? window.location.origin : ""}/api/payments/webhook</code></li>
              </ol>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4 p-6 rounded-lg border bg-muted/20">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> API Keys
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Public Key</label>
              <Input
                value={form.publicKey}
                onChange={(e) => setForm((f) => ({ ...f, publicKey: e.target.value }))}
                placeholder="pk_live_xxxxxxxxxxxxx"
                type={showSecrets ? "text" : "password"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secret Key</label>
              <div className="relative">
                <Input
                  value={form.secretKey}
                  onChange={(e) => setForm((f) => ({ ...f, secretKey: e.target.value }))}
                  placeholder="sk_live_xxxxxxxxxxxxx"
                  type={showSecrets ? "text" : "password"}
                />
                <button type="button" onClick={() => setShowSecrets(!showSecrets)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook Secret (optional)</label>
              <Input
                value={form.webhookSecret}
                onChange={(e) => setForm((f) => ({ ...f, webhookSecret: e.target.value }))}
                placeholder="Webhook signature key"
                type={showSecrets ? "text" : "password"}
              />
              <p className="text-xs text-muted-foreground">Used to verify webhook authenticity</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            {saved && (
              <Badge variant="success">
                <Check className="h-3.5 w-3.5 mr-1" /> Saved
              </Badge>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
