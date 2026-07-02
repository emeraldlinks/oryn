"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Palette, Loader2, Globe, Code, Image } from "lucide-react";

export default function BrandingPage() {
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#ec4899");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBranding(); }, []);

  async function loadBranding() {
    try {
      const res = await fetch("/api/admin/branding");
      if (res.ok) {
        const data = await res.json();
        setCompanyName(data.companyName || "");
        setLogoUrl(data.logoUrl || "");
        setPrimaryColor(data.primaryColor || "#6366f1");
        setSecondaryColor(data.secondaryColor || "#ec4899");
        setFaviconUrl(data.faviconUrl || "");
        setCustomCss(data.customCss || "");
        setCustomJs(data.customJs || "");
      }
    } catch {} finally { setLoading(false); }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, logoUrl, primaryColor, secondaryColor, faviconUrl, customCss, customJs }),
      });
      if (res.ok) toast.success("Branding saved");
      else toast.error("Failed to save branding");
    } catch { toast.error("Failed to save branding"); } finally { setSaving(false); }
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Branding</h1>
            <p className="text-muted-foreground">Customize your workspace appearance</p>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">General</h3>
            <p className="text-sm text-muted-foreground">Basic branding information.</p>
          </div>
          <div className="lg:col-span-2">
            <BentoCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Company Name</label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Logo URL</label>
                  <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
                  {logoUrl && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 border inline-flex items-center gap-3">
                      <img src={logoUrl} alt="Logo preview" className="h-12 w-12 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span className="text-xs text-muted-foreground">Preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Favicon URL</label>
                  <Input value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} placeholder="https://example.com/favicon.ico" />
                  {faviconUrl && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 border inline-flex items-center gap-3">
                      <img src={faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span className="text-xs text-muted-foreground">Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Colors</h3>
            <p className="text-sm text-muted-foreground">Brand color palette.</p>
          </div>
          <div className="lg:col-span-2">
            <BentoCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Secondary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Custom Code</h3>
            <p className="text-sm text-muted-foreground">Inject custom CSS and JavaScript.</p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <BentoCard>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Code className="h-4 w-4" /> Custom CSS</label>
                <textarea
                  className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Custom CSS */"
                />
              </div>
            </BentoCard>
            <BentoCard>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Code className="h-4 w-4" /> Custom JS</label>
                <textarea
                  className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
                  value={customJs}
                  onChange={(e) => setCustomJs(e.target.value)}
                  placeholder="// Custom JavaScript"
                />
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
