"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ThumbsUp, MessageCircle, Eye, TrendingUp, Users, BarChart3 } from "lucide-react";

export default function ManagerSocialPage() {
  const posts = [
    { id: 1, platform: "LinkedIn", content: "Excited to announce our new partnership with TechFlow Inc!", status: "scheduled", scheduledFor: "2024-03-22", engagement: { likes: 0, comments: 0, shares: 0 } },
    { id: 2, platform: "Twitter", content: "Check out our latest blog post on CRM best practices for 2024!", status: "published", scheduledFor: "2024-03-18", engagement: { likes: 24, comments: 5, shares: 12 } },
    { id: 3, platform: "LinkedIn", content: "We're hiring! Join our growing team in sales and engineering.", status: "published", scheduledFor: "2024-03-17", engagement: { likes: 56, comments: 12, shares: 34 } },
    { id: 4, platform: "Facebook", content: "Customer spotlight: How Acme Corp grew revenue by 40% with Oryn", status: "draft", scheduledFor: "", engagement: { likes: 0, comments: 0, shares: 0 } },
    { id: 5, platform: "Twitter", content: "Tip: Automate your follow-up emails to save 5+ hours per week", status: "published", scheduledFor: "2024-03-16", engagement: { likes: 18, comments: 3, shares: 8 } },
    { id: 6, platform: "LinkedIn", content: "New feature release: AI-powered lead scoring is now live!", status: "scheduled", scheduledFor: "2024-03-25", engagement: { likes: 0, comments: 0, shares: 0 } },
  ];

  const totalEngagement = posts.reduce((acc, p) => acc + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0);

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
          <StatCard title="Total Engagement" value={totalEngagement} icon={ThumbsUp} trend={{ value: 28, positive: true }} />
          <StatCard title="Follower Growth" value="+342" icon={TrendingUp} trend={{ value: 12, positive: true }} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Content</span>
            <span>Platform</span>
            <span>Date</span>
            <span>Likes</span>
            <span>Comments</span>
            <span>Status</span>
          </div>
          {posts.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <div className="min-w-0">
                <p className="text-sm truncate">{p.content}</p>
              </div>
              <Badge variant="outline" className="text-xs">{p.platform}</Badge>
              <span className="text-sm text-muted-foreground">{p.scheduledFor || "-"}</span>
              <span className="text-sm">{p.engagement.likes}</span>
              <span className="text-sm">{p.engagement.comments}</span>
              <Badge variant={
                p.status === "published" ? "success" :
                p.status === "scheduled" ? "warning" : "secondary"
              }>{p.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
