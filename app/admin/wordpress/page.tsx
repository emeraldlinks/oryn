"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, FileText, Plus, ExternalLink, Sparkles } from "lucide-react";

interface WPSite {
  id: number;
  siteUrl: string;
  siteName?: string;
  connectedAt: string;
}

interface WPPost {
  id: number;
  wordpressSiteId: number;
  title: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  categories?: string;
}

const postColumns: Column<WPPost>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "wordpressSiteId", label: "Site", render: (p) => `#${p.wordpressSiteId}` },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (p) => (
      <Badge variant={p.status === "publish" ? "success" : p.status === "future" ? "warning" : "secondary"}>
        {p.status}
      </Badge>
    ),
  },
  { key: "publishedAt", label: "Published", render: (p) => p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "-" },
  { key: "categories", label: "Categories", render: (p) => p.categories || "-" },
];

export default function WordpressPage() {
  const [sites, setSites] = useState<WPSite[]>([]);
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [siteForm, setSiteForm] = useState({ siteUrl: "", appUsername: "", appPassword: "", siteName: "" });
  const [postForm, setPostForm] = useState({ wordpressSiteId: "", title: "", contentHtml: "", status: "draft" });
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    fetch("/api/wordpress/sites").then((r) => r.json()).then(setSites);
    fetch("/api/wordpress/posts").then((r) => r.json()).then(setPosts);
  }, []);

  async function connectSite(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/wordpress/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteForm),
    });
    if (res.ok) {
      setShowConnect(false);
      setSiteForm({ siteUrl: "", appUsername: "", appPassword: "", siteName: "" });
      setSites(await fetch("/api/wordpress/sites").then((r) => r.json()));
    }
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/wordpress/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...postForm, wordpressSiteId: Number(postForm.wordpressSiteId) }),
    });
    if (res.ok) {
      setShowNewPost(false);
      setPostForm({ wordpressSiteId: "", title: "", contentHtml: "", status: "draft" });
      setPosts(await fetch("/api/wordpress/posts").then((r) => r.json()));
    }
  }

  function generateAiDraft() {
    if (!aiPrompt.trim()) return;
    setPostForm({
      ...postForm,
      title: `AI: ${aiPrompt}`,
      contentHtml: `<p>AI-generated draft based on: ${aiPrompt}</p><p>This is a placeholder — replace with actual AI generation.</p>`,
    });
    setAiPrompt("");
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WordPress</h1>
            <p className="text-muted-foreground">Manage connected sites and content</p>
          </div>
          <Button onClick={() => setShowConnect(!showConnect)}>
            <Globe className="mr-2 h-4 w-4" /> Connect Site
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Connected Sites" value={sites.length} icon={Globe} />
          <StatCard title="Total Posts" value={posts.length} icon={FileText} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Sites</h3>
            <div className="space-y-3">
              {sites.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No sites connected</div>
              ) : sites.map((site) => (
                <div key={site.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{site.siteName || site.siteUrl}</p>
                    <p className="text-xs text-muted-foreground">{site.siteUrl}</p>
                  </div>
                  <a href={site.siteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              ))}
            </div>

            {showConnect && (
              <form onSubmit={connectSite} className="mt-4 space-y-3">
                <Input placeholder="Site URL (https://example.com)" value={siteForm.siteUrl} onChange={(e) => setSiteForm({ ...siteForm, siteUrl: e.target.value })} required />
                <Input placeholder="Site Name" value={siteForm.siteName} onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })} />
                <Input placeholder="App Username" value={siteForm.appUsername} onChange={(e) => setSiteForm({ ...siteForm, appUsername: e.target.value })} required />
                <Input placeholder="App Password" type="password" value={siteForm.appPassword} onChange={(e) => setSiteForm({ ...siteForm, appPassword: e.target.value })} required />
                <Button type="submit">Connect</Button>
              </form>
            )}
          </BentoCard>

          <BentoCard colSpan={3}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Posts</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNewPost(!showNewPost)}>
                    <Plus className="mr-2 h-4 w-4" /> New Post
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="AI: enter a topic to generate a draft..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={generateAiDraft} disabled={!aiPrompt.trim()}>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate
                </Button>
              </div>

              {showNewPost && (
                <form onSubmit={createPost} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={postForm.wordpressSiteId} onChange={(e) => setPostForm({ ...postForm, wordpressSiteId: e.target.value })} required>
                      <option value="">Select Site</option>
                      {sites.map((site) => (
                        <option key={site.id} value={site.id}>{site.siteName || site.siteUrl}</option>
                      ))}
                    </select>
                    <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={postForm.status} onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}>
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="future">Schedule</option>
                    </select>
                  </div>
                  <Input placeholder="Post Title" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} required />
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
                    placeholder="Post content (HTML)"
                    value={postForm.contentHtml}
                    onChange={(e) => setPostForm({ ...postForm, contentHtml: e.target.value })}
                  />
                  <Button type="submit">Save Post</Button>
                </form>
              )}

              <DataTable columns={postColumns} data={posts} searchKeys={["title", "categories"]} />
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
