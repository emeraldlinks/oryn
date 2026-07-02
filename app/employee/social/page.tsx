"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Share2, ThumbsUp, MessageCircle, Eye, Plus, Clock, CheckCircle, Loader2 } from "lucide-react";

export default function EmployeeSocialPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [postForm, setPostForm] = useState({ content: "", status: "draft" });

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    try {
      const res = await fetch("/api/employee/social");
      if (res.ok) setPosts(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const totalEngagement = posts.reduce((acc: number, p) => acc + (p.likes || 0) + (p.comments || 0), 0);
  const published = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;

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
            <h1 className="text-3xl font-bold">Social Media</h1>
            <p className="text-muted-foreground">Manage your social presence</p>
          </div>
          <Button onClick={() => setShowComposer(!showComposer)}>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </div>

        {showComposer && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h3 className="font-semibold">New Post</h3>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              placeholder="What's on your mind?"
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <select
                className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={postForm.status}
                onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Publish Now</option>
                <option value="scheduled">Schedule</option>
              </select>
              {postForm.status === "scheduled" && (
                <input
                  type="datetime-local"
                  className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  onChange={(e) => setPostForm({ ...postForm, scheduledAt: e.target.value })}
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={async () => {
                const res = await fetch("/api/employee/social", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(postForm),
                });
                if (res.ok) {
                  toast.success("Post created");
                  setShowComposer(false);
                  setPostForm({ content: "", status: "draft" });
                  loadPosts();
                } else {
                  toast.error("Failed to create post");
                }
              }}>Create Post</Button>
              <Button variant="outline" onClick={() => setShowComposer(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <BentoGrid>
          <StatCard title="Total Posts" value={posts.length} icon={Share2} />
          <StatCard title="Published" value={published} icon={CheckCircle} />
          <StatCard title="Scheduled" value={scheduled} icon={Clock} />
          <StatCard title="Engagement" value={totalEngagement} icon={ThumbsUp} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No posts yet.</p>
          ) : posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {p.account?.platform && <Badge variant="outline" className="text-xs">{p.account.platform}</Badge>}
                  {p.status === "published" && <Badge variant="success" className="text-xs">Published</Badge>}
                  {p.status === "scheduled" && <Badge variant="warning" className="text-xs">Scheduled</Badge>}
                  {p.status === "draft" && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                </div>
                <p className="text-sm mt-1">{p.content || ""}</p>
                {p.scheduledAt && <p className="text-xs text-muted-foreground mt-1">{new Date(p.scheduledAt).toLocaleString()}</p>}
              </div>
              {p.status === "published" && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{p.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{p.comments || 0}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views || 0}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
