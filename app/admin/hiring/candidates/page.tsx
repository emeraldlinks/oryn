"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Loader2, Upload, Briefcase, Award } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showScan, setShowScan] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/hiring/candidates")
      .then((r) => r.json())
      .then(setCandidates)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setScanResult(null);
    setShowScan(true);
    const formData = new FormData();
    formData.append("cv", file);
    try {
      const res = await fetch("/api/admin/hiring/scan", { method: "POST", body: formData });
      const data = await res.json();
      setScanResult(data);
      load();
    } catch {}
    setScanning(false);
  }

  const filtered = candidates.filter(
    (c) => !search || c.firstName?.toLowerCase().includes(search.toLowerCase()) || c.lastName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">AI-scanned candidate profiles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="relative" onClick={() => document.getElementById("cv-upload")?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Scan CV
              <input id="cv-upload" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleScan} />
            </Button>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Candidates" value={candidates.length} icon={Users} />
          <StatCard title="Active" value={candidates.filter((c) => c.status === "active").length} icon={Briefcase} />
          <StatCard title="Avg Score" value={candidates.length > 0 ? `${Math.round(candidates.reduce((s: number, c: any) => s + (c.overallScore || 0), 0) / candidates.length)}%` : "—"} icon={Award} />
        </BentoGrid>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {showScan && (
          <BentoCard>
            <div className="space-y-3">
              <h3 className="font-semibold">CV Scan Result</h3>
              {scanning ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Scanning CV...</div>
              ) : scanResult ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{scanResult.candidate?.firstName} {scanResult.candidate?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{scanResult.candidate?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{scanResult.overallScore}%</p>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {scanResult.scores?.map((s: any) => (
                      <div key={s.metricId} className="text-xs px-2 py-1 rounded bg-muted">
                        {s.name}: {s.score}/{s.maxScore}
                      </div>
                    ))}
                  </div>
                  {scanResult.insights?.length > 0 && (
                    <div className="space-y-1">
                      {scanResult.insights.map((i: string, idx: number) => (
                        <p key={idx} className="text-sm text-muted-foreground">• {i}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              <Button size="sm" variant="outline" onClick={() => setShowScan(false)}>Close</Button>
            </div>
          </BentoCard>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No candidates yet. Upload a CV to scan.</p>
          ) : filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">{c.firstName?.[0]}{c.lastName?.[0]}</div>
                <div>
                  <a href={`/admin/hiring/candidates/${c.id}`} className="font-medium hover:text-primary">{c.firstName} {c.lastName}</a>
                  <p className="text-xs text-muted-foreground">{c.email} {c.currentCompany ? `— ${c.currentCompany}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.overallScore && <Badge variant={c.overallScore >= 70 ? "success" as const : c.overallScore >= 40 ? "warning" as const : "destructive" as const}>{c.overallScore}%</Badge>}
                <Badge variant="outline">{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
