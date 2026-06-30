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
  Share2, Twitter, Instagram, Facebook, Youtube, Linkedin,
  Plus, Calendar, Image, Send, BarChart3,
} from "lucide-react";

interface SocialPost {
  id: number;
  socialAccountId: number;
  content: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  platformPostId?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  createdAt: string;
}

const platformColors: Record<string, string> = {
  twitter: "bg-sky-500",
  instagram: "bg-pink-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  youtube: "bg-red-600",
  pinterest: "bg-red-500",
  tiktok: "bg-black",
};

const postColumns: Column<SocialPost>[] = [
  { key: "socialAccountId", label: "Account", render: (p) => `#${p.socialAccountId}` },
  { key: "content", label: "Content", render: (p) => (
    <span className="line-clamp-1 max-w-[300px]">{p.content}</span>
  )},
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (p) => (
      <Badge variant={
        p.status === "published" ? "success" :
        p.status === "scheduled" ? "warning" :
        p.status === "draft" ? "secondary" : "destructive"
      }>
        {p.status}
      </Badge>
    ),
  },
  { key: "scheduledAt", label: "Scheduled", render: (p) => p.scheduledAt ? new Date(p.scheduledAt).toLocaleString() : "-" },
  { key: "likes", label: "Likes", render: (p) => p.likes ?? "-" },
  { key: "reach", label: "Reach", render: (p) => p.reach ?? "-" },
];

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [form, setForm] = useState({ socialAccountId: "", content: "", scheduledAt: "", status: "draft" });

  useEffect(() => {
    fetch("/api/social/posts").then((r) => r.json()).then(setPosts);
    fetch("/api/social/accounts").then((r) => r.json()).then(setAccounts);
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        socialAccountId: Number(form.socialAccountId),
      }),
    });
    if (res.ok) {
      setShowComposer(false);
      setForm({ socialAccountId: "", content: "", scheduledAt: "", status: "draft" });
      setPosts(await fetch("/api/social/posts").then((r) => r.json()));
    }
  }

  const published = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const totalEngagement = posts.reduce((s, p) => s + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Social Media</h1>
            <p className="text-muted-foreground">Manage all your social platforms</p>
          </div>
          <Button onClick={() => setShowComposer(!showComposer)}>
            <Send className="mr-2 h-4 w-4" /> New Post
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Connected Accounts" value={accounts.length} icon={Share2} />
          <StatCard title="Published" value={published} icon={Twitter} />
          <StatCard title="Scheduled" value={scheduled} icon={Calendar} />
          <StatCard title="Total Engagement" value={totalEngagement.toLocaleString()} icon={BarChart3} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              {accounts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No accounts connected. Add a platform to get started.
                </div>
              ) : accounts.map((acc: any) => (
                <div key={acc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`h-8 w-8 rounded-lg ${platformColors[acc.platform] || "bg-muted"} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white uppercase">{acc.platform[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{acc.accountName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{acc.platform}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Connect Account
              </Button>
            </div>
          </BentoCard>

          <BentoCard colSpan={3}>
            <h3 className="text-lg font-semibold mb-4">Content Calendar</h3>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="aspect-square rounded-lg border bg-muted/30 flex items-center justify-center text-xs hover:bg-muted/50 cursor-pointer transition-colors">
                  {i + 1}
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>

        {showComposer && (
          <form onSubmit={createPost} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.socialAccountId} onChange={(e) => setForm({ ...form, socialAccountId: e.target.value })} required>
                <option value="">Select Account</option>
                {accounts.map((acc: any) => (
                  <option key={acc.id} value={acc.id}>{acc.accountName} ({acc.platform})</option>
                ))}
              </select>
              <Input placeholder="Schedule (optional)" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
            <textarea
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
              placeholder="What would you like to share?"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" onClick={() => setForm({ ...form, status: "draft" })}>Save Draft</Button>
              <Button type="submit" variant="secondary" onClick={() => setForm({ ...form, status: "scheduled" })}>Schedule</Button>
              <Button type="submit" variant="default" onClick={() => setForm({ ...form, status: "published" })}>Publish Now</Button>
            </div>
          </form>
        )}

        <DataTable columns={postColumns} data={posts} searchKeys={["content", "status"]} />
      </div>
    </DashboardShell>
  );
}
