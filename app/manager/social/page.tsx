"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ThumbsUp, MessageCircle, Eye, BarChart3, Loader2 } from "lucide-react";

export default function ManagerSocialPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/social")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEngagement = posts.reduce((a: number, p) => a + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);

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
            <p className="text-muted-foreground">Team social presence overview</p>
          </div>
          <Button>
            <Share2 className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Posts" value={posts.length} icon={Share2} />
          <StatCard title="Published" value={posts.filter((p) => p.status === "published").length} icon={BarChart3} />
          <StatCard title="Engagement" value={totalEngagement} icon={ThumbsUp} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Content</span>
            <span>Platform</span>
            <span>Likes</span>
            <span>Comments</span>
            <span>Status</span>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No posts found.</p>
          ) : posts.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div className="min-w-0">
                <p className="text-sm truncate">{p.content || p.body || ""}</p>
              </div>
              {p.platform && <Badge variant="outline" className="text-xs">{p.platform}</Badge>}
              <span className="text-sm">{p.likes || 0}</span>
              <span className="text-sm">{p.comments || 0}</span>
              <Badge variant={p.status === "published" ? "success" : p.status === "scheduled" ? "warning" : "secondary"}>
                {p.status || "draft"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
