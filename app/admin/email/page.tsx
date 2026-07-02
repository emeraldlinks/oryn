"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mail, Loader2, ChevronDown, ChevronUp, RefreshCw, Search,
  Send, BarChart3, TrendingUp, Clock, AlertCircle, CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface EmailDelivery {
  id: number;
  recipient: string;
  subject: string;
  status: string;
  openCount: number;
  clickCount: number;
  createdAt: string;
  error: string | null;
  metadata: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  opened: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  clicked: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  bounced: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "bounced", label: "Bounced" },
  { key: "failed", label: "Failed" },
  { key: "opened", label: "Opened" },
];

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showSendTest, setShowSendTest] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSubject, setTestSubject] = useState("");
  const [testBody, setTestBody] = useState("");

  useEffect(() => { loadEmails(); }, []);

  async function loadEmails() {
    try {
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/email-deliveries?${params}`);
      if (res.ok) setEmails(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadEmails(); }, [tab, search]);

  async function sendTest() {
    if (!testEmail || !testSubject) return;
    try {
      const res = await fetch("/api/admin/email-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: testEmail, subject: testSubject, body: testBody }),
      });
      if (res.ok) {
        toast.success("Test email sent");
        setShowSendTest(false);
        setTestEmail("");
        setTestSubject("");
        setTestBody("");
        loadEmails();
      } else {
        toast.error("Failed to send test email");
      }
    } catch {
      toast.error("Failed to send test email");
    }
  }

  const allDelivered = emails.filter((e) => e.status === "delivered" || e.status === "opened" || e.status === "clicked").length;
  const allBounced = emails.filter((e) => e.status === "bounced").length;
  const allFailed = emails.filter((e) => e.status === "failed").length;
  const totalOpens = emails.reduce((s, e) => s + e.openCount, 0);
  const totalClicks = emails.reduce((s, e) => s + e.clickCount, 0);
  const deliveryRate = emails.length > 0 ? Math.round((allDelivered / emails.length) * 100) : 0;

  function truncate(str: string, len: number) {
    return str.length > len ? str.slice(0, len) + "..." : str;
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Dashboard</h1>
            <p className="text-muted-foreground">Monitor delivery, engagement, and send test emails</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSendTest(!showSendTest)}>
              <Send className="mr-2 h-4 w-4" /> Send Test
            </Button>
            <Button variant="outline" size="sm" onClick={loadEmails}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Sent" value={emails.length} icon={Mail} />
          <StatCard title="Delivered" value={allDelivered} icon={CheckCircle2} trend={{ value: deliveryRate - 80, positive: deliveryRate >= 80 }} />
          <StatCard title="Bounced" value={allBounced} icon={AlertCircle} trend={{ value: allBounced > 5 ? 100 : 0, positive: allBounced <= 5 }} />
          <StatCard title="Engagement" value={`${totalOpens} Opens / ${totalClicks} Clicks`} icon={TrendingUp} />
        </BentoGrid>

        {showSendTest && (
          <BentoCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Send Test Email</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSendTest(false)}>Cancel</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Recipient email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                <Input placeholder="Subject" value={testSubject} onChange={(e) => setTestSubject(e.target.value)} />
              </div>
              <textarea
                className="w-full h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                placeholder="Email body (plain text)..."
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
              />
              <Button onClick={sendTest} disabled={!testEmail || !testSubject}>
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </div>
          </BentoCard>
        )}

        <BentoCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Delivery Log</h3>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border bg-muted p-0.5">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        tab === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Recipient</th>
                    <th className="text-left py-2 px-2 font-medium">Subject</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-center py-2 px-2 font-medium">Opens</th>
                    <th className="text-center py-2 px-2 font-medium">Clicks</th>
                    <th className="text-left py-2 px-2 font-medium">Date</th>
                    <th className="text-right py-2 pl-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                  ) : emails.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No email deliveries found.</td></tr>
                  ) : emails.slice(0, 50).map((e) => (
                    <tr key={e.id} className="border-b hover:bg-muted/30 cursor-pointer" onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}>
                      <td className="py-3 pr-4">{e.recipient}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground max-w-[200px] truncate" title={e.subject}>{truncate(e.subject, 40)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[e.status] || "bg-muted text-muted-foreground"}`}>{e.status}</span>
                      </td>
                      <td className="py-3 px-2 text-center text-xs">{e.openCount}</td>
                      <td className="py-3 px-2 text-center text-xs">{e.clickCount}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pl-4 text-right">
                        {expandedId === e.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </td>
                    </tr>
                  ))}
                  {emails.length > 50 && (
                    <tr><td colSpan={7} className="py-3 text-center text-xs text-muted-foreground">Showing 50 of {emails.length} results</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
