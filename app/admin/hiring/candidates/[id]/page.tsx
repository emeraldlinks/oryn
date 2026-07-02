"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Linkedin, Award, Briefcase, GraduationCap, BookOpen, Loader2, Download } from "lucide-react";

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/hiring/candidates/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        // We don't have a dedicated single-candidate API, so fetch all and find
        fetch("/api/admin/hiring/candidates")
          .then((r) => r.json())
          .then((all) => {
            const found = all.find((c: any) => c.id === Number(params.id));
            setCandidate(found);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <DashboardShell><div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></DashboardShell>;
  }

  if (!candidate) {
    return <DashboardShell><div className="text-center py-12"><p className="text-muted-foreground">Candidate not found</p></div></DashboardShell>;
  }

  const aiScore = candidate.aiScore || {};

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {candidate.firstName?.[0]}{candidate.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
              <p className="text-muted-foreground">{candidate.currentPosition}{candidate.currentCompany ? ` at ${candidate.currentCompany}` : ""}</p>
              <div className="flex gap-3 mt-2">
                {candidate.email && <a href={`mailto:${candidate.email}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><Mail className="h-3.5 w-3.5" /> {candidate.email}</a>}
                {candidate.phone && <span className="flex items-center gap-1 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {candidate.phone}</a>}
                {candidate.linkedInUrl && <a href={candidate.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{candidate.overallScore || "—"}%</div>
            <p className="text-xs text-muted-foreground">AI Score</p>
          </div>
        </div>

        <BentoGrid>
          <BentoCard>
            <h3 className="font-semibold flex items-center gap-2 mb-3"><Briefcase className="h-4 w-4" /> AI Score Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(aiScore).length === 0 ? (
                <p className="text-sm text-muted-foreground">No AI scores available</p>
              ) : Object.entries(aiScore).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">{String(val)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${val}%`,
                      backgroundColor: Number(val) >= 70 ? "#10b981" : Number(val) >= 40 ? "#f59e0b" : "#ef4444",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard>
            <h3 className="font-semibold flex items-center gap-2 mb-3"><Award className="h-4 w-4" /> Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.length > 0 ? candidate.skills.map((s: string) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              )) : <p className="text-sm text-muted-foreground">No skills listed</p>}
            </div>
          </BentoCard>
        </BentoGrid>

        {candidate.aiInsights?.length > 0 && (
          <BentoCard>
            <h3 className="font-semibold mb-2">AI Insights</h3>
            <div className="space-y-1">
              {candidate.aiInsights.map((i: string, idx: number) => (
                <p key={idx} className="text-sm text-muted-foreground">• {i}</p>
              ))}
            </div>
          </BentoCard>
        )}

        {candidate.summary && (
          <BentoCard>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground">{candidate.summary}</p>
          </BentoCard>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild><a href={`mailto:${candidate.email}`}><Mail className="mr-2 h-4 w-4" /> Send Email</a></Button>
        </div>
      </div>
    </DashboardShell>
  );
}
