"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ThumbsUp, MessageCircle, Eye, Calendar, Plus, Clock, CheckCircle } from "lucide-react";

export default function EmployeeSocialPage() {
  const posts = [
    { id: 1, platform: "LinkedIn", content: "Excited to announce our new partnership with TechFlow Inc!", status: "scheduled", scheduledFor: "2024-03-22 10:00 AM", engagement: { likes: 0, comments: 0, views: 0 } },
    { id: 2, platform: "Twitter", content: "Check out our latest blog post on CRM best practices for 2024!", status: "published", scheduledFor: "2024-03-18 09:00 AM", engagement: { likes: 24, comments: 5, views: 1250 } },
    { id: 3, platform: "LinkedIn", content: "We're hiring! Join our growing team in sales and engineering.", status: "published", scheduledFor: "2024-03-17 11:00 AM", engagement: { likes: 56, comments: 12, views: 3400 } },
    { id: 4, platform: "Facebook", content: "Customer spotlight: How Acme Corp grew revenue by 40% with Oryn", status: "draft", scheduledFor: "", engagement: { likes: 0, comments: 0, views: 0 } },
    { id: 5, platform: "Twitter", content: "Tip: Automate your follow-up emails to save 5+ hours per week", status: "published", scheduledFor: "2024-03-16 02:00 PM", engagement: { likes: 18, comments: 3, views: 890 } },
  ];

  const totalEngagement = posts.reduce((acc, p) => acc + p.engagement.likes + p.engagement.comments, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Social Media</h1>
            <p className="text-muted-foreground">Manage your social presence</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Posts" value={posts.length} icon={Share2} />
          <StatCard title="Published" value={posts.filter((p) => p.status === "published").length} icon={CheckCircle} trend={{ value: 12, positive: true }} />
          <StatCard title="Scheduled" value={posts.filter((p) => p.status === "scheduled").length} icon={Clock} />
          <StatCard title="Total Engagement" value={totalEngagement} icon={ThumbsUp} />
        </BentoGrid>

        <div className="rounded-lg border overflow-hidden">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{p.platform}</Badge>
                  {p.status === "published" && <Badge variant="success" className="text-xs">Published</Badge>}
                  {p.status === "scheduled" && <Badge variant="warning" className="text-xs">Scheduled</Badge>}
                  {p.status === "draft" && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                </div>
                <p className="text-sm mt-1">{p.content}</p>
                {p.scheduledFor && <p className="text-xs text-muted-foreground mt-1">{p.scheduledFor}</p>}
              </div>
              {p.status === "published" && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{p.engagement.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{p.engagement.comments}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.engagement.views}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
