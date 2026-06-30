"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Megaphone, FileText, Layout, Plus, Send, BarChart3 } from "lucide-react";

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
    key: "status",
    label: "Status",
    sortable: true,
    render: (c) => (
      <Badge variant={
        c.status === "sent" ? "success" :
        c.status === "scheduled" ? "warning" :
        c.status === "draft" ? "secondary" : "default"
      }>
        {c.status}
      </Badge>
    ),
  },
  { key: "openCount", label: "Opens", render: (c) => c.openCount ?? "-" },
  { key: "clickCount", label: "Clicks", render: (c) => c.clickCount ?? "-" },
  { key: "sentAt", label: "Sent", render: (c) => c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "-" },
];

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ name: "", subject: "", bodyHtml: "", status: "draft" });

  useEffect(() => {
    fetch("/api/marketing/campaigns").then((r) => r.json()).then(setCampaigns);
    fetch("/api/marketing/pages").then((r) => r.json()).then(setPages);
    fetch("/api/marketing/forms").then((r) => r.json()).then(setForms);
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignForm),
    });
    if (res.ok) {
      setShowNewCampaign(false);
      setCampaignForm({ name: "", subject: "", bodyHtml: "", status: "draft" });
      setCampaigns(await fetch("/api/marketing/campaigns").then((r) => r.json()));
    }
  }

  const totalSent = campaigns.filter((c) => c.status === "sent").length;
  const totalOpens = campaigns.reduce((s, c) => s + (c.openCount || 0), 0);
  const totalClicks = campaigns.reduce((s, c) => s + (c.clickCount || 0), 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketing</h1>
            <p className="text-muted-foreground">Email campaigns, pages, and forms</p>
          </div>
          <Button onClick={() => setShowNewCampaign(!showNewCampaign)}>
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Campaigns Sent" value={totalSent} icon={Megaphone} />
          <StatCard title="Total Opens" value={totalOpens.toLocaleString()} icon={BarChart3} />
          <StatCard title="Landing Pages" value={pages.length} icon={Layout} />
          <StatCard title="Active Forms" value={forms.length} icon={FileText} />
        </BentoGrid>

        {showNewCampaign && (
          <form onSubmit={createCampaign} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Campaign Name" value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} required />
              <Input placeholder="Email Subject" value={campaignForm.subject} onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })} required />
            </div>
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
              placeholder="Email HTML body..."
              value={campaignForm.bodyHtml}
              onChange={(e) => setCampaignForm({ ...campaignForm, bodyHtml: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" onClick={() => setCampaignForm({ ...campaignForm, status: "draft" })}>Save Draft</Button>
              <Button type="submit" variant="secondary" onClick={() => setCampaignForm({ ...campaignForm, status: "scheduled" })}>Schedule</Button>
              <Button type="submit" variant="default" onClick={() => setCampaignForm({ ...campaignForm, status: "sent" })}>
                <Send className="mr-2 h-4 w-4" /> Send Now
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Email Campaigns</h2>
          <DataTable columns={campaignColumns} data={campaigns} searchKeys={["name", "subject"]} />
        </div>

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
                  <Badge variant={p.published ? "success" : "secondary"}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                <Plus className="mr-2 h-4 w-4" /> Create Page
              </Button>
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
              <Button variant="outline" className="w-full mt-2">
                <Plus className="mr-2 h-4 w-4" /> Create Form
              </Button>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
