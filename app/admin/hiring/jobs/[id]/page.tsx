"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Users, Briefcase, MapPin, Clock, DollarSign, Loader2, Upload } from "lucide-react";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/hiring/jobs/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  const job = data;
  const applications = data?.applications || [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{job?.title}</h1>
            <Badge variant={job?.status === "active" ? "success" as const : "warning" as const}>{job?.status}</Badge>
          </div>
          <p className="text-muted-foreground">{job?.department} {job?.location ? `— ${job.location}` : ""}</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {job?.location && <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {job.location}</div>}
          {job?.employmentType && <div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> {job.employmentType}</div>}
          {job?.minSalary && <div className="flex items-center gap-1 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> {job.currency} {job.minSalary?.toLocaleString()}{job.maxSalary ? ` - ${job.maxSalary.toLocaleString()}` : ""}</div>}
          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-4 w-4" /> {applications.length} applicants</div>
        </div>

        {job?.description && (
          <BentoCard>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          </BentoCard>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Applications ({applications.length})</h2>
          {applications.length === 0 ? (
            <BentoCard><p className="text-sm text-muted-foreground text-center py-8">No applications yet</p></BentoCard>
          ) : (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {app.candidate?.firstName?.[0]}{app.candidate?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{app.candidate?.firstName} {app.candidate?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{app.candidate?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.totalScore && <Badge variant="outline">Score: {app.totalScore}%</Badge>}
                    <Badge>{app.stage}</Badge>
                    <Button variant="ghost" size="sm" asChild><a href={`/admin/hiring/candidates/${app.candidateId}`}>View</a></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
