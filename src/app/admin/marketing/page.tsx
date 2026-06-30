"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone, FileText, Layout, Plus, Send, BarChart3, Copy, X, Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: string;
  sentAt?: string;
  scheduledAt?: string;
  openCount?: number;
  clickCount?: number;
}

interface Template {
  id: number;
  name: string;
  subject: string;
  status: string;
  variables?: string[];
}

interface LandingPage {
  id: number;
  slug: string;
  title: string;
  published: boolean;
}

const campaignColumns: Column<Campaign>[] = [
  { key: "name", label: "Campaign", sortable: true },
  { key: "subject", label: "Subject", render: (c) => c.subject || "-" },
  {
    key: "status", label: "Status", sortable: true,
    render: (c) => (
      <Badge variant={c.status === "sent" ? "success" : c.status === "scheduled" ? "warning" : c.status === "draft" ? "secondary" : "default"}>
        {c.status}
      </Badge>
    ),
  },
  { key: "openCount", label: "Opens", render: (c) => c.openCount ?? "-" },
  { key: "clickCount", label: "Clicks", render: (c) => c.clickCount ?? "-" },
  { key: "sentAt", label: "Sent", render: (c) => c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "-" },
];

const templateColumns: Column<Template>[] = [
  { key: "name", label: "Template", sortable: true },
  { key: "subject", label: "Subject" },
  {
    key: "status", label: "Status",
    render: (t) => <Badge variant={t.status === "active" ? "success" : "secondary"}>{t.status}</Badge>,
  },
  {
    key: "variables", label: "Variables",
    render: (t) => (t.variables || []).join(", ") || "-",
  },
];

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"campaigns" | "templates">("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ name: "", subject: "", bodyHtml: "", status: "draft" });
  const [templateForm, setTemplateForm] = useState({ name: "", subject: "", bodyHtml: "", variables: "" });

  useEffect(() => {
    fetch("/api/marketing/campaigns").then((r) => r.json()).then(setCampaigns);
    fetch("/api/marketing/pages").then((r) => r.json()).then(setPages);
    fetch("/api/marketing/forms").then((r) => r.json()).then(setForms);
    fetch("/api/marketing/templates").then((r) => r.json()).then(setTemplates);
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewCampaign(false);
      setCampaignForm({ name: "", subject: "", bodyHtml: "", status: "draft" });
      setCampaigns(await fetch("/api/marketing/campaigns").then((r) => r.json()));
      toast.success("Campaign created");
    }
  }

  async function createTemplate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...templateForm,
        variables: templateForm.variables ? templateForm.variables.split(",").map((v) => v.trim()) : [],
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewTemplate(false);
      setTemplateForm({ name: "", subject: "", bodyHtml: "", variables: "" });
      setTemplates(await fetch("/api/marketing/templates").then((r) => r.json()));
      toast.success("Template created");
    }
  }

  async function useTemplate(t: Template) {
    setCampaignForm({ name: `From: ${t.name}`, subject: t.subject, bodyHtml: "", status: "draft" });
    setShowNewCampaign(true);
    setActiveTab("campaigns");
  }

  const totalSent = campaigns.filter((c) => c.status === "sent").length;
  const totalOpens = campaigns.reduce((s, c) => s + (c.openCount || 0), 0);

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">Email campaigns, templates, pages, and forms</p>
        </div>

        <BentoGrid>
          <StatCard title="Campaigns Sent" value={totalSent} icon={Megaphone} />
          <StatCard title="Total Opens" value={totalOpens.toLocaleString()} icon={BarChart3} />
          <StatCard title="Templates" value={templates.length} icon={Copy} />
          <StatCard title="Active Forms" value={forms.length} icon={FileText} />
        </BentoGrid>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "campaigns" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "templates" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Templates
          </button>
        </div>

        {activeTab === "campaigns" && (
          <>
            <div className="flex justify-end">
              <Button onClick={() => setShowNewCampaign(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </div>
            <DataTable columns={campaignColumns} data={campaigns} searchKeys={["name", "subject"]} />
          </>
        )}

        {activeTab === "templates" && (
          <>
            <div className="flex justify-end">
              <Button onClick={() => setShowNewTemplate(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Template
              </Button>
            </div>
            <DataTable
              columns={templateColumns}
              data={templates}
              searchKeys={["name", "subject"]}
              onRowClick={(t) => useTemplate(t)}
            />
          </>
        )}

        <Modal open={showNewCampaign} onClose={() => setShowNewCampaign(false)} title="New Campaign">
          <form onSubmit={createCampaign} className="space-y-3">
            <Input placeholder="Campaign Name" value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} required />
            <Input placeholder="Email Subject" value={campaignForm.subject} onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })} required />
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
              placeholder="Email HTML body..."
              value={campaignForm.bodyHtml}
              onChange={(e) => setCampaignForm({ ...campaignForm, bodyHtml: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting} onClick={() => setCampaignForm((f) => ({ ...f, status: "draft" }))}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Draft
              </Button>
              <Button type="submit" variant="secondary" onClick={() => setCampaignForm((f) => ({ ...f, status: "sent" }))}>
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </div>
          </form>
        </Modal>

        <Modal open={showNewTemplate} onClose={() => setShowNewTemplate(false)} title="New Template">
          <form onSubmit={createTemplate} className="space-y-3">
            <Input placeholder="Template Name" value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} required />
            <Input placeholder="Default Subject" value={templateForm.subject} onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })} required />
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
              placeholder="Email HTML body with {{variable}} placeholders..."
              value={templateForm.bodyHtml}
              onChange={(e) => setTemplateForm({ ...templateForm, bodyHtml: e.target.value })}
            />
            <Input placeholder="Variables (comma-separated, e.g. name, company)" value={templateForm.variables} onChange={(e) => setTemplateForm({ ...templateForm, variables: e.target.value })} />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Template
            </Button>
          </form>
        </Modal>

        <BentoGrid>
          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Landing Pages</h3>
            <div className="space-y-2">
              {pages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No landing pages yet</p>
              ) : pages.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">/{p.slug}</p>
                  </div>
                  <Badge variant={p.published ? "success" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge>
                </div>
              ))}
            </div>
          </BentoCard>
          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Forms</h3>
            <div className="space-y-2">
              {forms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No forms yet</p>
              ) : forms.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <p className="text-sm font-medium">{f.name}</p>
                  <span className="text-xs text-muted-foreground">{f.submissions || 0} submissions</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
