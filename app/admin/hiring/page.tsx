"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, UserCheck, Calendar, DollarSign, FileText, Loader2, ArrowRight, Clock } from "lucide-react";

export default function HiringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/hiring/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const { stats, stageBreakdown, recentApplications } = data || {};

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hiring</h1>
            <p className="text-muted-foreground">Recruitment and applicant tracking</p>
          </div>
          <div className="flex gap-2">
            <Button asChild><a href="/admin/hiring/jobs"><Briefcase className="mr-2 h-4 w-4" /> Jobs</a></Button>
            <Button variant="outline" asChild><a href="/admin/hiring/metrics"><FileText className="mr-2 h-4 w-4" /> Metrics</a></Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Active Jobs" value={stats?.activeJobs || 0} icon={Briefcase} />
          <StatCard title="Total Applicants" value={stats?.totalApplicants || 0} icon={Users} />
          <StatCard title="Shortlisted" value={stats?.shortlisted || 0} icon={UserCheck} />
          <StatCard title="Hired" value={stats?.hired || 0} icon={DollarSign} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard>
            <h3 className="text-lg font-semibold mb-4">Pipeline Funnel</h3>
            <div className="space-y-3">
              {(stageBreakdown || []).map((s: any) => {
                const maxCount = Math.max(...(stageBreakdown || []).map((x: any) => x.count), 1);
                return (
                  <div key={s.stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.stage}</span>
                      <span className="font-medium">{s.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {(!recentApplications || recentApplications.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
              ) : recentApplications.slice(-8).reverse().map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Application #{app.id}</p>
                    <p className="text-xs text-muted-foreground">Stage: {app.stage}</p>
                  </div>
                  <Badge variant="outline">{app.stage}</Badge>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col" asChild><a href="/admin/hiring/jobs"><Briefcase className="h-6 w-6 mb-2" /> Job Postings</a></Button>
          <Button variant="outline" className="h-24 flex-col" asChild><a href="/admin/hiring/candidates"><Users className="h-6 w-6 mb-2" /> Candidates</a></Button>
          <Button variant="outline" className="h-24 flex-col" asChild><a href="/admin/hiring/interviews"><Calendar className="h-6 w-6 mb-2" /> Interviews</a></Button>
          <Button variant="outline" className="h-24 flex-col" asChild><a href="/admin/hiring/offers"><DollarSign className="h-6 w-6 mb-2" /> Offers</a></Button>
          <Button variant="outline" className="h-24 flex-col" asChild><a href="/admin/hiring/stages"><FileText className="h-6 w-6 mb-2" /> Stages</a></Button>
        </div>
      </div>
    </DashboardShell>
  );
}
