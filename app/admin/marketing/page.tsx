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
  Users, GitBranch, Target, Play, Pause, CheckCircle, ToggleLeft, ToggleRight,
  RefreshCw, MessageCircle, Smartphone, Bell, Radio, Link2, Search,
  Globe, BarChart,
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

interface Segment {
  id: number;
  name: string;
  filters: string;
  contactCount: number;
}

interface ABTestVariant {
  name: string;
  content: string;
  trafficPercent: number;
  impressions?: number;
  conversions?: number;
  conversionRate?: number;
}

interface ABTest {
  id: number;
  name: string;
  description?: string;
  status: string;
  variants: ABTestVariant[] | string;
  startedAt?: string;
  completedAt?: string;
  winner?: string;
}

interface LeadScoreRule {
  id: number;
  name: string;
  entityType: string;
  conditions: string;
  scoreValue: number;
  active: boolean;
}

interface Journey {
  id: number;
  name: string;
  status: string;
  triggers: string;
  steps: string;
  conversionRate?: number;
}

interface SMSCampaign {
  id: number;
  name: string;
  status: string;
  body?: string;
  scheduledAt?: string;
  recipientCount?: number;
  deliveredCount?: number;
}

interface PushNotification {
  id: number;
  userId: number;
  user?: { name: string };
  title: string;
  status: string;
  sentAt?: string;
}

interface SocialMention {
  id: number;
  platform: string;
  author: string;
  content: string;
  sentiment: string;
  status: string;
  postedAt?: string;
}

interface UTMLink {
  id: number;
  source: string;
  target: string;
  campaign: string;
  clicks: number;
  medium?: string;
  term?: string;
  content?: string;
}

interface SEOConfig {
  id: number;
  pageSlug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noIndex: boolean;
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
  const [activeTab, setActiveTab] = useState<string>("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ name: "", subject: "", bodyHtml: "", status: "draft" });
  const [templateForm, setTemplateForm] = useState({ name: "", subject: "", bodyHtml: "", variables: "" });

  const [segments, setSegments] = useState<Segment[]>([]);
  const [segmentForm, setSegmentForm] = useState({ name: "", filters: '{"conditions":[{"field":"status","operator":"equals","value":"active"}],"logic":"and"}' });

  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [abTestForm, setAbTestForm] = useState({ name: "", description: "", variants: '[{"name":"A","content":"Version A","trafficPercent":50},{"name":"B","content":"Version B","trafficPercent":50}]' });

  const [rules, setRules] = useState<LeadScoreRule[]>([]);
  const [ruleForm, setRuleForm] = useState({ name: "", entityType: "contact", conditions: '{"conditions":[]}', scoreValue: 10 });

  const [showNewSegment, setShowNewSegment] = useState(false);
  const [showNewABTest, setShowNewABTest] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeyForm, setJourneyForm] = useState({ name: "", description: "", triggers: "[]", steps: "[]" });
  const [showNewJourney, setShowNewJourney] = useState(false);

  const [smsCampaigns, setSmsCampaigns] = useState<SMSCampaign[]>([]);
  const [smsForm, setSmsForm] = useState({ name: "", body: "", scheduledAt: "" });
  const [showNewSms, setShowNewSms] = useState(false);

  const [pushes, setPushes] = useState<PushNotification[]>([]);
  const [pushForm, setPushForm] = useState({ userId: "", title: "", body: "", data: "{}" });
  const [showNewPush, setShowNewPush] = useState(false);

  const [mentions, setMentions] = useState<SocialMention[]>([]);
  const [utmLinks, setUtmLinks] = useState<UTMLink[]>([]);
  const [utmForm, setUtmForm] = useState({ source: "", target: "", campaign: "", medium: "", term: "", content: "" });
  const [showNewUtm, setShowNewUtm] = useState(false);

  const [seoConfigs, setSeoConfigs] = useState<SEOConfig[]>([]);
  const [seoForm, setSeoForm] = useState({ pageSlug: "", metaTitle: "", metaDescription: "", keywords: "", ogImage: "", canonical: "", noIndex: false });
  const [showNewSeo, setShowNewSeo] = useState(false);

  useEffect(() => {
    fetch("/api/marketing/campaigns").then((r) => r.json()).then(setCampaigns);
    fetch("/api/marketing/pages").then((r) => r.json()).then(setPages);
    fetch("/api/marketing/forms").then((r) => r.json()).then(setForms);
    fetch("/api/marketing/templates").then((r) => r.json()).then(setTemplates);
    loadSegments();
    loadABTests();
    loadRules();
    loadJourneys();
    loadSmsCampaigns();
    loadPushes();
    loadMentions();
    loadUtmLinks();
    loadSeoConfigs();
  }, []);

  async function loadSegments() {
    try { const res = await fetch("/api/marketing/segments"); if (res.ok) setSegments(await res.json()); } catch {}
  }

  async function loadABTests() {
    try { const res = await fetch("/api/marketing/ab-tests"); if (res.ok) setAbTests(await res.json()); } catch {}
  }

  async function loadRules() {
    try { const res = await fetch("/api/marketing/lead-scoring"); if (res.ok) setRules(await res.json()); } catch {}
  }

  async function loadJourneys() {
    try { const res = await fetch("/api/marketing/journeys"); if (res.ok) setJourneys(await res.json()); } catch {}
  }

  async function loadSmsCampaigns() {
    try { const res = await fetch("/api/marketing/sms-campaigns"); if (res.ok) setSmsCampaigns(await res.json()); } catch {}
  }

  async function loadPushes() {
    try { const res = await fetch("/api/marketing/push"); if (res.ok) setPushes(await res.json()); } catch {}
  }

  async function loadMentions() {
    try { const res = await fetch("/api/marketing/social-mentions"); if (res.ok) setMentions(await res.json()); } catch {}
  }

  async function loadUtmLinks() {
    try { const res = await fetch("/api/marketing/utm"); if (res.ok) setUtmLinks(await res.json()); } catch {}
  }

  async function loadSeoConfigs() {
    try { const res = await fetch("/api/marketing/seo"); if (res.ok) setSeoConfigs(await res.json()); } catch {}
  }

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

  async function createSegment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/segments", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(segmentForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewSegment(false);
      setSegmentForm({ name: "", filters: '{"conditions":[{"field":"status","operator":"equals","value":"active"}],"logic":"and"}' });
      await loadSegments();
      toast.success("Segment created");
    }
  }

  async function recalculateCount(segment: Segment) {
    const res = await fetch("/api/marketing/segments?count=1", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(segment),
    });
    if (res.ok) { await loadSegments(); toast.success("Count recalculated"); }
  }

  async function deleteSegment(id: number) {
    await fetch(`/api/marketing/segments?id=${id}`, { method: "DELETE" });
    await loadSegments(); toast.success("Segment deleted");
  }

  async function createABTest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/ab-tests", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(abTestForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewABTest(false);
      setAbTestForm({ name: "", description: "", variants: '[{"name":"A","content":"Version A","trafficPercent":50},{"name":"B","content":"Version B","trafficPercent":50}]' });
      await loadABTests(); toast.success("A/B Test created");
    }
  }

  async function updateABTestStatus(test: ABTest, status: string) {
    const res = await fetch(`/api/marketing/ab-tests?id=${test.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...test, status }),
    });
    if (res.ok) { await loadABTests(); toast.success(`Test ${status}`); }
  }

  async function deleteABTest(id: number) {
    await fetch(`/api/marketing/ab-tests?id=${id}`, { method: "DELETE" });
    await loadABTests(); toast.success("A/B Test deleted");
  }

  async function createRule(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/lead-scoring", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ruleForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewRule(false);
      setRuleForm({ name: "", entityType: "contact", conditions: '{"conditions":[]}', scoreValue: 10 });
      await loadRules(); toast.success("Rule created");
    }
  }

  async function toggleRule(rule: LeadScoreRule) {
    await fetch(`/api/marketing/lead-scoring?id=${rule.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rule, active: !rule.active }),
    });
    await loadRules(); toast.success(rule.active ? "Rule deactivated" : "Rule activated");
  }

  async function deleteRule(id: number) {
    await fetch(`/api/marketing/lead-scoring?id=${id}`, { method: "DELETE" });
    await loadRules(); toast.success("Rule deleted");
  }

  async function createJourney(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/journeys", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(journeyForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewJourney(false);
      setJourneyForm({ name: "", description: "", triggers: "[]", steps: "[]" });
      await loadJourneys(); toast.success("Journey created");
    }
  }

  async function createSmsCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/sms-campaigns", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(smsForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewSms(false);
      setSmsForm({ name: "", body: "", scheduledAt: "" });
      await loadSmsCampaigns(); toast.success("SMS campaign created");
    }
  }

  async function createPush(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/push", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...pushForm, userId: Number(pushForm.userId),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewPush(false);
      setPushForm({ userId: "", title: "", body: "", data: "{}" });
      await loadPushes(); toast.success("Push notification created");
    }
  }

  async function updateMentionStatus(id: number, status: string) {
    const res = await fetch(`/api/marketing/social-mentions?id=${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) { await loadMentions(); toast.success(`Mention ${status}`); }
  }

  async function createUtmLink(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/utm", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(utmForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewUtm(false);
      setUtmForm({ source: "", target: "", campaign: "", medium: "", term: "", content: "" });
      await loadUtmLinks(); toast.success("UTM link created");
    }
  }

  async function createSeoConfig(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/marketing/seo", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seoForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setShowNewSeo(false);
      setSeoForm({ pageSlug: "", metaTitle: "", metaDescription: "", keywords: "", ogImage: "", canonical: "", noIndex: false });
      await loadSeoConfigs(); toast.success("SEO config saved");
    }
  }

  const totalSent = campaigns.filter((c) => c.status === "sent").length;
  const totalOpens = campaigns.reduce((s, c) => s + (c.openCount || 0), 0);

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: Send },
    { id: "templates", label: "Templates", icon: Copy },
    { id: "pages", label: "Landing Pages", icon: Layout },
    { id: "forms", label: "Forms", icon: FileText },
    { id: "segments", label: "Segments", icon: Users },
    { id: "ab-tests", label: "A/B Tests", icon: GitBranch },
    { id: "lead-scoring", label: "Lead Scoring", icon: Target },
    { id: "journeys", label: "Journeys", icon: BarChart },
    { id: "sms", label: "SMS Campaigns", icon: MessageCircle },
    { id: "push", label: "Push Notifications", icon: Bell },
    { id: "social", label: "Social Listening", icon: Radio },
    { id: "utm", label: "UTM Links", icon: Link2 },
    { id: "seo", label: "SEO", icon: Search },
  ];

  const platformIcons: Record<string, any> = {
    twitter: MessageCircle, facebook: MessageCircle, instagram: MessageCircle, linkedin: MessageCircle,
  };

  function getPlatformIcon(platform: string) {
    const Icon = platformIcons[platform] || MessageCircle;
    return <Icon className="h-4 w-4" />;
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

        {activeTab === "pages" && (
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
        )}

        {activeTab === "forms" && (
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
        )}

        {activeTab === "segments" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewSegment(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Segment
              </Button>
            </div>
            <div className="space-y-3">
              {segments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No segments yet.</p>
              ) : segments.map((s) => (
                <BentoCard key={s.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{s.name}</h4>
                        <Badge variant="secondary">{s.contactCount} contacts</Badge>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-lg">
                        {s.filters.length > 120 ? s.filters.slice(0, 120) + "..." : s.filters}
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => recalculateCount(s)}>
                        <RefreshCw className="h-3 w-3 mr-1" /> Count
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteSegment(s.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewSegment} onClose={() => setShowNewSegment(false)} title="New Segment">
              <form onSubmit={createSegment} className="space-y-3">
                <Input placeholder="Segment Name" value={segmentForm.name} onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Filters JSON</label>
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] font-mono"
                    value={segmentForm.filters}
                    onChange={(e) => setSegmentForm({ ...segmentForm, filters: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Guide: {`{"conditions":[{"field":"status","operator":"equals","value":"active"}],"logic":"and"}`}</p>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Segment
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "ab-tests" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewABTest(true)}>
                <Plus className="mr-2 h-4 w-4" /> New A/B Test
              </Button>
            </div>
            <div className="space-y-4">
              {abTests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No A/B tests yet.</p>
              ) : abTests.map((test) => {
                const variants = typeof test.variants === "string" ? JSON.parse(test.variants) : test.variants;
                return (
                  <BentoCard key={test.id}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{test.name}</h4>
                            <Badge variant={test.status === "running" ? "success" : test.status === "paused" ? "warning" : test.status === "completed" ? "default" : "secondary"}>{test.status}</Badge>
                          </div>
                          {test.description && <p className="text-sm text-muted-foreground">{test.description}</p>}
                          <p className="text-xs text-muted-foreground">
                            {variants.length} variants
                            {test.startedAt && ` · Started: ${new Date(test.startedAt).toLocaleDateString()}`}
                            {test.completedAt && ` · Completed: ${new Date(test.completedAt).toLocaleDateString()}`}
                            {test.winner && ` · Winner: ${test.winner}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.status === "draft" && (
                            <Button variant="outline" size="sm" onClick={() => updateABTestStatus(test, "running")}>
                              <Play className="h-3 w-3 mr-1" /> Start
                            </Button>
                          )}
                          {test.status === "running" && (
                            <Button variant="outline" size="sm" onClick={() => updateABTestStatus(test, "paused")}>
                              <Pause className="h-3 w-3 mr-1" /> Pause
                            </Button>
                          )}
                          {test.status === "paused" && (
                            <Button variant="outline" size="sm" onClick={() => updateABTestStatus(test, "running")}>
                              <Play className="h-3 w-3 mr-1" /> Resume
                            </Button>
                          )}
                          {(test.status === "running" || test.status === "paused") && (
                            <Button variant="outline" size="sm" onClick={() => updateABTestStatus(test, "completed")}>
                              <CheckCircle className="h-3 w-3 mr-1" /> Complete
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => deleteABTest(test.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-muted-foreground">
                              <th className="text-left py-1 pr-4 font-medium">Variant</th>
                              <th className="text-right px-2 font-medium">Traffic %</th>
                              <th className="text-right px-2 font-medium">Impressions</th>
                              <th className="text-right px-2 font-medium">Conversions</th>
                              <th className="text-right pl-2 font-medium">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((v: ABTestVariant) => (
                              <tr key={v.name} className="border-b last:border-0">
                                <td className="py-2 pr-4 font-medium">{v.name}</td>
                                <td className="text-right px-2">{v.trafficPercent}%</td>
                                <td className="text-right px-2">{v.impressions ?? "-"}</td>
                                <td className="text-right px-2">{v.conversions ?? "-"}</td>
                                <td className="text-right pl-2">{v.conversionRate != null ? `${v.conversionRate}%` : "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </BentoCard>
                );
              })}
            </div>
            <Modal open={showNewABTest} onClose={() => setShowNewABTest(false)} title="New A/B Test">
              <form onSubmit={createABTest} className="space-y-3">
                <Input placeholder="Test Name" value={abTestForm.name} onChange={(e) => setAbTestForm({ ...abTestForm, name: e.target.value })} required />
                <Input placeholder="Description" value={abTestForm.description} onChange={(e) => setAbTestForm({ ...abTestForm, description: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Variants JSON</label>
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] font-mono"
                    value={abTestForm.variants}
                    onChange={(e) => setAbTestForm({ ...abTestForm, variants: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Guide: [{`{"name":"A","content":"Version A","trafficPercent":50},{"name":"B","content":"Version B","trafficPercent":50}`}]</p>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create A/B Test
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "lead-scoring" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewRule(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Rule
              </Button>
            </div>
            <div className="space-y-3">
              {rules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lead scoring rules yet.</p>
              ) : rules.map((r) => (
                <BentoCard key={r.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{r.name}</h4>
                        <Badge>{r.entityType}</Badge>
                        <Badge variant={r.scoreValue >= 0 ? "success" : "destructive"}>{r.scoreValue >= 0 ? `+${r.scoreValue}` : r.scoreValue}</Badge>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-lg">
                        {r.conditions.length > 120 ? r.conditions.slice(0, 120) + "..." : r.conditions}
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => toggleRule(r)}>
                        {r.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRule(r.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewRule} onClose={() => setShowNewRule(false)} title="New Lead Scoring Rule">
              <form onSubmit={createRule} className="space-y-3">
                <Input placeholder="Rule Name" value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Entity Type</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={ruleForm.entityType}
                    onChange={(e) => setRuleForm({ ...ruleForm, entityType: e.target.value })}
                  >
                    <option value="contact">Contact</option>
                    <option value="deal">Deal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Conditions JSON</label>
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px] font-mono"
                    value={ruleForm.conditions}
                    onChange={(e) => setRuleForm({ ...ruleForm, conditions: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Score Value (positive or negative)</label>
                  <Input
                    type="number"
                    value={ruleForm.scoreValue}
                    onChange={(e) => setRuleForm({ ...ruleForm, scoreValue: Number(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Rule
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "journeys" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewJourney(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Journey
              </Button>
            </div>
            <div className="space-y-3">
              {journeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">No journeys yet.</p>
              ) : journeys.map((j) => (
                <BentoCard key={j.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{j.name}</h4>
                        <Badge variant={j.status === "active" ? "success" : j.status === "paused" ? "warning" : "secondary"}>{j.status}</Badge>
                        {j.conversionRate != null && (
                          <Badge variant="default">{j.conversionRate}% conv.</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Triggers: <span className="font-mono">{j.triggers.length > 80 ? j.triggers.slice(0, 80) + "..." : j.triggers}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Steps: <span className="font-mono">{j.steps.length > 80 ? j.steps.slice(0, 80) + "..." : j.steps}</span>
                      </p>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewJourney} onClose={() => setShowNewJourney(false)} title="New Journey">
              <form onSubmit={createJourney} className="space-y-3">
                <Input placeholder="Journey Name" value={journeyForm.name} onChange={(e) => setJourneyForm({ ...journeyForm, name: e.target.value })} required />
                <Input placeholder="Description" value={journeyForm.description} onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Triggers JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={journeyForm.triggers} onChange={(e) => setJourneyForm({ ...journeyForm, triggers: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Steps JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={journeyForm.steps} onChange={(e) => setJourneyForm({ ...journeyForm, steps: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Journey
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "sms" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewSms(true)}>
                <Plus className="mr-2 h-4 w-4" /> New SMS Campaign
              </Button>
            </div>
            <div className="space-y-3">
              {smsCampaigns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No SMS campaigns yet.</p>
              ) : smsCampaigns.map((s) => (
                <BentoCard key={s.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{s.name}</h4>
                        <Badge variant={s.status === "sent" ? "success" : s.status === "scheduled" ? "warning" : "secondary"}>{s.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recipients: {s.recipientCount ?? "-"} · Delivered: {s.deliveredCount ?? "-"}
                        {s.scheduledAt && ` · Scheduled: ${new Date(s.scheduledAt).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewSms} onClose={() => setShowNewSms(false)} title="New SMS Campaign">
              <form onSubmit={createSmsCampaign} className="space-y-3">
                <Input placeholder="Campaign Name" value={smsForm.name} onChange={(e) => setSmsForm({ ...smsForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={smsForm.body} onChange={(e) => setSmsForm({ ...smsForm, body: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Scheduled At</label>
                  <Input type="datetime-local" value={smsForm.scheduledAt} onChange={(e) => setSmsForm({ ...smsForm, scheduledAt: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create SMS Campaign
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "push" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewPush(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Push Notification
              </Button>
            </div>
            <div className="space-y-3">
              {pushes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No push notifications yet.</p>
              ) : pushes.map((p) => (
                <BentoCard key={p.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{p.title}</h4>
                        <Badge variant={p.status === "sent" ? "success" : p.status === "failed" ? "destructive" : "secondary"}>{p.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        User: {p.user?.name ?? `#${p.userId}`}
                        {p.sentAt && ` · Sent: ${new Date(p.sentAt).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewPush} onClose={() => setShowNewPush(false)} title="New Push Notification">
              <form onSubmit={createPush} className="space-y-3">
                <Input placeholder="User ID" type="number" value={pushForm.userId} onChange={(e) => setPushForm({ ...pushForm, userId: e.target.value })} required />
                <Input placeholder="Title" value={pushForm.title} onChange={(e) => setPushForm({ ...pushForm, title: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={pushForm.body} onChange={(e) => setPushForm({ ...pushForm, body: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Data JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px] font-mono" value={pushForm.data} onChange={(e) => setPushForm({ ...pushForm, data: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send Push
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {mentions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No social mentions yet.</p>
              ) : mentions.map((m) => (
                <BentoCard key={m.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(m.platform)}
                        <span className="font-medium text-sm">{m.author}</span>
                        <Badge variant={m.sentiment === "positive" ? "success" : m.sentiment === "negative" ? "destructive" : "secondary"}>{m.sentiment}</Badge>
                        <Badge variant={m.status === "unread" ? "default" : m.status === "read" ? "secondary" : "outline"}>{m.status}</Badge>
                      </div>
                      <p className="text-sm">{m.content.length > 200 ? m.content.slice(0, 200) + "..." : m.content}</p>
                      {m.postedAt && <p className="text-xs text-muted-foreground">{new Date(m.postedAt).toLocaleString()}</p>}
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => updateMentionStatus(m.id, "read")}>Read</Button>
                      <Button variant="ghost" size="sm" onClick={() => updateMentionStatus(m.id, "replied")}>Replied</Button>
                      <Button variant="ghost" size="sm" onClick={() => updateMentionStatus(m.id, "ignored")}>Ignore</Button>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === "utm" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewUtm(true)}>
                <Plus className="mr-2 h-4 w-4" /> New UTM Link
              </Button>
            </div>
            <div className="space-y-3">
              {utmLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No UTM links yet.</p>
              ) : utmLinks.map((u) => (
                <BentoCard key={u.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{u.source} → {u.target}</h4>
                        <Badge variant="secondary">{u.campaign}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{u.medium ? `/${u.medium}` : ""}{u.term ? ` ${u.term}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{u.clicks}</p>
                      <p className="text-xs text-muted-foreground">clicks</p>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewUtm} onClose={() => setShowNewUtm(false)} title="New UTM Link">
              <form onSubmit={createUtmLink} className="space-y-3">
                <Input placeholder="Source (e.g. twitter)" value={utmForm.source} onChange={(e) => setUtmForm({ ...utmForm, source: e.target.value })} required />
                <Input placeholder="Target URL" value={utmForm.target} onChange={(e) => setUtmForm({ ...utmForm, target: e.target.value })} required />
                <Input placeholder="Campaign" value={utmForm.campaign} onChange={(e) => setUtmForm({ ...utmForm, campaign: e.target.value })} required />
                <Input placeholder="Medium" value={utmForm.medium} onChange={(e) => setUtmForm({ ...utmForm, medium: e.target.value })} />
                <Input placeholder="Term" value={utmForm.term} onChange={(e) => setUtmForm({ ...utmForm, term: e.target.value })} />
                <Input placeholder="Content" value={utmForm.content} onChange={(e) => setUtmForm({ ...utmForm, content: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create UTM Link
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewSeo(true)}>
                <Plus className="mr-2 h-4 w-4" /> New SEO Config
              </Button>
            </div>
            <div className="space-y-3">
              {seoConfigs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No SEO configs yet.</p>
              ) : seoConfigs.map((s) => (
                <BentoCard key={s.id}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">/{s.pageSlug}</h4>
                      {s.noIndex && <Badge variant="destructive">noindex</Badge>}
                    </div>
                    {s.metaTitle && <p className="text-sm"><span className="text-muted-foreground">Title:</span> {s.metaTitle}</p>}
                    {s.metaDescription && <p className="text-sm"><span className="text-muted-foreground">Description:</span> {s.metaDescription.length > 100 ? s.metaDescription.slice(0, 100) + "..." : s.metaDescription}</p>}
                    {s.keywords && <p className="text-xs text-muted-foreground">Keywords: {s.keywords}</p>}
                  </div>
                </BentoCard>
              ))}
            </div>
            <Modal open={showNewSeo} onClose={() => setShowNewSeo(false)} title="New SEO Config">
              <form onSubmit={createSeoConfig} className="space-y-3">
                <Input placeholder="Page Slug (e.g. about-us)" value={seoForm.pageSlug} onChange={(e) => setSeoForm({ ...seoForm, pageSlug: e.target.value })} required />
                <Input placeholder="Meta Title" value={seoForm.metaTitle} onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Meta Description</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]" value={seoForm.metaDescription} onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })} />
                </div>
                <Input placeholder="Keywords (comma separated)" value={seoForm.keywords} onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })} />
                <Input placeholder="OG Image URL" value={seoForm.ogImage} onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })} />
                <Input placeholder="Canonical URL" value={seoForm.canonical} onChange={(e) => setSeoForm({ ...seoForm, canonical: e.target.value })} />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">No Index</label>
                  <button
                    type="button"
                    onClick={() => setSeoForm({ ...seoForm, noIndex: !seoForm.noIndex })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${seoForm.noIndex ? "bg-destructive" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${seoForm.noIndex ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save SEO Config
                </Button>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
