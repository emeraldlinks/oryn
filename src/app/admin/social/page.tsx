"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Share2, Twitter, Instagram, Facebook, Youtube, Linkedin,
  Plus, Calendar, Image, Send, BarChart3, Trash2, Globe, Loader2,
} from "lucide-react";

interface SocialPost {
  id: number;
  socialAccountId: number;
  content: string;
  mediaUrls?: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  platformPostId?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  createdAt: string;
  account?: SocialAccount;
}

interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  connectedAt: string;
  posts?: SocialPost[];
}

const platformIcons: Record<string, typeof Globe> = {
  twitter: Twitter, instagram: Instagram, facebook: Facebook,
  linkedin: Linkedin, youtube: Youtube, tiktok: Globe,
};

const platformColors: Record<string, string> = {
  twitter: "bg-sky-500", instagram: "bg-pink-500", facebook: "bg-blue-600",
  linkedin: "bg-blue-700", youtube: "bg-red-600", tiktok: "bg-black",
};

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [form, setForm] = useState({
    socialAccountId: "", content: "", mediaUrls: "", scheduledAt: "", status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/social/posts").then((r) => r.json()),
      fetch("/api/social/accounts").then((r) => r.json()),
    ]).then(([postsData, accountsData]) => {
      setPosts(postsData);
      setAccounts(accountsData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, socialAccountId: Number(form.socialAccountId),
          mediaUrls: form.mediaUrls || undefined,
          scheduledAt: form.scheduledAt || undefined,
        }),
      });
      if (res.ok) {
        toast.success("Post created");
        setShowComposer(false);
        setForm({ socialAccountId: "", content: "", mediaUrls: "", scheduledAt: "", status: "draft" });
        const updated = await fetch("/api/social/posts").then((r) => r.json());
        setPosts(updated);
      } else {
        toast.error("Failed to create post");
      }
    } catch {} finally { setSaving(false); }
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/social/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post deleted");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  }

  async function disconnectAccount(id: number) {
    if (!confirm("Disconnect this account?")) return;
    try {
      const res = await fetch(`/api/social/accounts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Account disconnected");
        setAccounts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {}
  }

  const published = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const totalEngagement = posts.reduce((s, p) => s + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (filterStatus && p.status !== filterStatus) return false;
      if (filterPlatform && p.socialAccountId) {
        const acc = accounts.find((a) => a.id === p.socialAccountId);
        if (acc?.platform !== filterPlatform) return false;
      }
      return true;
    });
  }, [posts, filterStatus, filterPlatform, accounts]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const scheduledByDate = useMemo(() => {
    const map: Record<number, number> = {};
    posts.filter((p) => p.status === "scheduled" && p.scheduledAt).forEach((p) => {
      const d = new Date(p.scheduledAt!);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        map[day] = (map[day] || 0) + 1;
      }
    });
    return map;
  }, [posts, currentMonth, currentYear]);

  const postsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return posts.filter((p) => {
      if (p.status !== "scheduled" || !p.scheduledAt) return false;
      const d = new Date(p.scheduledAt);
      return d.getDate() === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [posts, selectedDay, currentMonth, currentYear]);

  const statusBadge = (status: string) => (
    <Badge variant={
      status === "published" ? "success" :
      status === "scheduled" ? "warning" :
      status === "draft" ? "secondary" : "destructive"
    }>
      {status}
    </Badge>
  );

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
                  No accounts connected.
                </div>
              ) : accounts.map((acc) => {
                const PlIcon = platformIcons[acc.platform] || Globe;
                return (
                  <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg ${platformColors[acc.platform] || "bg-muted"} flex items-center justify-center`}>
                        <PlIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{acc.accountName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{acc.platform} · {new Date(acc.connectedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => disconnectAccount(acc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" /> Connect Account</Button>
            </div>
          </BentoCard>

          <BentoCard colSpan={3}>
            <h3 className="text-lg font-semibold mb-4">Content Calendar</h3>
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={() => {
                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
                else setCurrentMonth((m) => m - 1);
              }}>Previous</Button>
              <span className="text-sm font-medium">{months[currentMonth]} {currentYear}</span>
              <Button variant="outline" size="sm" onClick={() => {
                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
                else setCurrentMonth((m) => m + 1);
              }}>Next</Button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const count = scheduledByDate[day] || 0;
                const isSelected = selectedDay === day;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "border-primary bg-primary/10" : "bg-muted/30"}`}
                  >
                    <span>{day}</span>
                    {count > 0 && <span className="text-[10px] text-primary font-medium">{count} post{count > 1 ? "s" : ""}</span>}
                  </div>
                );
              })}
            </div>
            {selectedDay && postsForSelectedDay.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Posts on {months[currentMonth]} {selectedDay}</p>
                {postsForSelectedDay.map((p) => (
                  <div key={p.id} className="text-xs p-2 rounded bg-muted/50 flex justify-between items-center">
                    <span className="line-clamp-1 flex-1">{p.content}</span>
                    <span className="text-muted-foreground ml-2">{new Date(p.scheduledAt!).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </BentoGrid>

        {showComposer && (
          <form onSubmit={createPost} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.socialAccountId} onChange={(e) => setForm({ ...form, socialAccountId: e.target.value })} required>
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.accountName} ({acc.platform})</option>
                ))}
              </select>
              <Input placeholder="Media URL (optional)" value={form.mediaUrls} onChange={(e) => setForm({ ...form, mediaUrls: e.target.value })} />
              <Input placeholder="Schedule (optional)" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
            <div className="relative">
              <textarea
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
                placeholder="What would you like to share?"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                maxLength={280}
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">{form.content.length}/280</span>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} onClick={() => setForm({ ...form, status: "draft" })}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Draft
              </Button>
              <Button type="submit" variant="secondary" disabled={saving} onClick={() => setForm({ ...form, status: "scheduled" })}>Schedule</Button>
              <Button type="submit" variant="default" disabled={saving} onClick={() => setForm({ ...form, status: "published" })}>Publish Now</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold">Posts</h3>
            <select className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            <select className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
              <option value="">All Platforms</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.platform}>{acc.platform}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No posts found.</div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Content</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Platform</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Likes</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Comments</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Shares</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((p) => {
                      const acc = accounts.find((a) => a.id === p.socialAccountId);
                      return (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm line-clamp-1 max-w-[250px]">{p.content}</td>
                          <td className="px-4 py-3 text-sm capitalize">{acc?.platform || `#${p.socialAccountId}`}</td>
                          <td className="px-4 py-3">{statusBadge(p.status)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {p.scheduledAt ? new Date(p.scheduledAt).toLocaleString() : p.publishedAt ? new Date(p.publishedAt).toLocaleString() : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">{p.likes ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{p.comments ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{p.shares ?? "-"}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon" onClick={() => deletePost(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
