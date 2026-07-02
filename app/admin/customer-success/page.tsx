"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Activity, Heart, TrendingUp, ClipboardCheck, AlertTriangle, Bell,
  Plus, Trash2, Loader2, Star, ThumbsUp,
} from "lucide-react";

export default function CustomerSuccessPage() {
  const [activeTab, setActiveTab] = useState("health");

  // Health Scores
  const [healthScores, setHealthScores] = useState<any[]>([]);
  const [healthSummary, setHealthSummary] = useState({ averageScore: 0, totalScored: 0, needsAttention: 0, good: 0 });
  const [healthForm, setHealthForm] = useState({ contactId: "", score: 50, category: "Active", notes: "", factors: "" });
  const [healthFilter, setHealthFilter] = useState({ contactId: "", category: "" });

  // NPS
  const [npsResponses, setNpsResponses] = useState<any[]>([]);
  const [npsSummary, setNpsSummary] = useState({ averageScore: 0, promoters: 0, passives: 0, detractors: 0, total: 0 });
  const [npsForm, setNpsForm] = useState({ contactId: "", score: "", comment: "" });

  // CSAT
  const [csatResponses, setCsatResponses] = useState<any[]>([]);
  const [csatSummary, setCsatSummary] = useState({ averageScore: 0, total: 0 });
  const [csatForm, setCsatForm] = useState({ contactId: "", ticketId: "", score: "5", comment: "" });

  // Onboarding
  const [onboardingTasks, setOnboardingTasks] = useState<any[]>([]);
  const [onboardingStats, setOnboardingStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [onboardingForm, setOnboardingForm] = useState({ contactId: "", title: "", description: "", dueDate: "", assignedTo: "" });

  // Churn Prediction
  const [churnPredictions, setChurnPredictions] = useState<any[]>([]);
  const [churnSummary, setChurnSummary] = useState({ total: 0, highRisk: 0, critical: 0, avgRiskScore: 0 });
  const [churnForm, setChurnForm] = useState({ contactId: "", riskScore: 0, riskLevel: "Medium", factors: "" });
  const [churnFilter, setChurnFilter] = useState("All");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHealthScores();
    loadNpsResponses();
    loadCsatResponses();
    loadOnboardingTasks();
    loadChurnPredictions();
  }, []);

  // --- Health Scores ---
  async function loadHealthScores() {
    try {
      const params = new URLSearchParams();
      if (healthFilter.contactId) params.set("contactId", healthFilter.contactId);
      if (healthFilter.category) params.set("category", healthFilter.category);
      const res = await fetch(`/api/customer-success/health?${params}`);
      if (res.ok) {
        const data = await res.json();
        const scores = Array.isArray(data) ? data : data.scores || data.data || [];
        setHealthScores(scores);
        if (scores.length > 0) {
          const total = scores.reduce((s: number, h: any) => s + (h.score ?? h.healthScore ?? 0), 0);
          const avg = Math.round(total / scores.length);
          setHealthSummary({
            averageScore: avg,
            totalScored: scores.length,
            needsAttention: scores.filter((h: any) => (h.score ?? h.healthScore ?? 0) < 40).length,
            good: scores.filter((h: any) => (h.score ?? h.healthScore ?? 0) >= 70).length,
          });
        }
      }
    } catch {}
  }

  async function saveHealthScore() {
    if (!healthForm.contactId) return;
    setLoading(true);
    try {
      const body: any = {
        contactId: parseInt(healthForm.contactId),
        score: healthForm.score,
        category: healthForm.category,
      };
      if (healthForm.notes) body.notes = healthForm.notes;
      if (healthForm.factors) {
        try { body.factors = JSON.parse(healthForm.factors); } catch { body.factors = healthForm.factors; }
      }
      const res = await fetch("/api/customer-success/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Health score saved");
        setHealthForm({ contactId: "", score: 50, category: "Active", notes: "", factors: "" });
        loadHealthScores();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function deleteHealthScore(id: number) {
    await fetch(`/api/customer-success/health?id=${id}`, { method: "DELETE" });
    toast.success("Health score deleted");
    loadHealthScores();
  }

  // --- NPS ---
  async function loadNpsResponses() {
    try {
      const res = await fetch("/api/customer-success/nps");
      if (res.ok) {
        const data = await res.json();
        const responses = Array.isArray(data) ? data : data.responses || data.data || [];
        setNpsResponses(responses);
        if (responses.length > 0) {
          const total = responses.reduce((s: number, r: any) => s + (r.score ?? 0), 0);
          const avg = Math.round((total / responses.length) * 10) / 10;
          setNpsSummary({
            averageScore: avg,
            promoters: responses.filter((r: any) => (r.score ?? 0) >= 9).length,
            passives: responses.filter((r: any) => (r.score ?? 0) >= 7 && (r.score ?? 0) <= 8).length,
            detractors: responses.filter((r: any) => (r.score ?? 0) <= 6).length,
            total: responses.length,
          });
        }
      }
    } catch {}
  }

  async function submitNps() {
    if (!npsForm.contactId || !npsForm.score) return;
    setLoading(true);
    try {
      const res = await fetch("/api/customer-success/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: parseInt(npsForm.contactId),
          score: parseInt(npsForm.score),
          comment: npsForm.comment,
        }),
      });
      if (res.ok) {
        toast.success("NPS response submitted");
        setNpsForm({ contactId: "", score: "", comment: "" });
        loadNpsResponses();
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  // --- CSAT ---
  async function loadCsatResponses() {
    try {
      const res = await fetch("/api/customer-success/csat");
      if (res.ok) {
        const data = await res.json();
        const responses = Array.isArray(data) ? data : data.responses || data.data || [];
        setCsatResponses(responses);
        if (responses.length > 0) {
          const total = responses.reduce((s: number, r: any) => s + (r.score ?? 0), 0);
          const avg = Math.round((total / responses.length) * 10) / 10;
          setCsatSummary({ averageScore: avg, total: responses.length });
        }
      }
    } catch {}
  }

  async function submitCsat() {
    if (!csatForm.contactId) return;
    setLoading(true);
    try {
      const body: any = {
        contactId: parseInt(csatForm.contactId),
        score: parseInt(csatForm.score),
        comment: csatForm.comment,
      };
      if (csatForm.ticketId) body.ticketId = parseInt(csatForm.ticketId);
      const res = await fetch("/api/customer-success/csat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("CSAT response submitted");
        setCsatForm({ contactId: "", ticketId: "", score: "5", comment: "" });
        loadCsatResponses();
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  // --- Onboarding ---
  async function loadOnboardingTasks() {
    try {
      const res = await fetch("/api/customer-success/onboarding");
      if (res.ok) {
        const data = await res.json();
        const tasks = Array.isArray(data) ? data : data.tasks || data.data || [];
        setOnboardingTasks(tasks);
        setOnboardingStats({
          total: tasks.length,
          completed: tasks.filter((t: any) => t.status === "Completed").length,
          inProgress: tasks.filter((t: any) => t.status === "In Progress").length,
          pending: tasks.filter((t: any) => t.status === "Pending").length,
        });
      }
    } catch {}
  }

  async function createOnboardingTask() {
    if (!onboardingForm.contactId || !onboardingForm.title) return;
    setLoading(true);
    try {
      const res = await fetch("/api/customer-success/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: parseInt(onboardingForm.contactId),
          title: onboardingForm.title,
          description: onboardingForm.description,
          dueDate: onboardingForm.dueDate,
          assignedTo: onboardingForm.assignedTo,
          status: "Pending",
        }),
      });
      if (res.ok) {
        toast.success("Onboarding task created");
        setOnboardingForm({ contactId: "", title: "", description: "", dueDate: "", assignedTo: "" });
        loadOnboardingTasks();
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function updateOnboardingStatus(id: number, status: string) {
    try {
      const res = await fetch(`/api/customer-success/onboarding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success(`Task ${status.toLowerCase()}`);
        loadOnboardingTasks();
      }
    } catch {}
  }

  async function deleteOnboardingTask(id: number) {
    await fetch(`/api/customer-success/onboarding?id=${id}`, { method: "DELETE" });
    toast.success("Task deleted");
    loadOnboardingTasks();
  }

  // --- Churn Prediction ---
  async function loadChurnPredictions() {
    try {
      const params = churnFilter !== "All" ? `?riskLevel=${churnFilter}` : "";
      const res = await fetch(`/api/customer-success/churn${params}`);
      if (res.ok) {
        const data = await res.json();
        const predictions = Array.isArray(data) ? data : data.predictions || data.data || [];
        setChurnPredictions(predictions);
        if (predictions.length > 0) {
          const totalRisk = predictions.reduce((s: number, p: any) => s + (p.riskScore ?? 0), 0);
          setChurnSummary({
            total: predictions.length,
            highRisk: predictions.filter((p: any) => p.riskLevel === "High").length,
            critical: predictions.filter((p: any) => p.riskLevel === "Critical").length,
            avgRiskScore: Math.round(totalRisk / predictions.length),
          });
        }
      }
    } catch {}
  }

  async function createChurnPrediction() {
    if (!churnForm.contactId) return;
    setLoading(true);
    try {
      const body: any = {
        contactId: parseInt(churnForm.contactId),
        riskScore: churnForm.riskScore,
        riskLevel: churnForm.riskLevel,
      };
      if (churnForm.factors) {
        try { body.factors = JSON.parse(churnForm.factors); } catch { body.factors = churnForm.factors; }
      }
      const res = await fetch("/api/customer-success/churn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Churn prediction created");
        setChurnForm({ contactId: "", riskScore: 0, riskLevel: "Medium", factors: "" });
        loadChurnPredictions();
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  // --- Helpers ---
  function scoreBadge(score: number) {
    if (score >= 70) return <Badge variant="success">{score}</Badge>;
    if (score >= 40) return <Badge variant="warning">{score}</Badge>;
    return <Badge variant="destructive">{score}</Badge>;
  }

  function riskColor(score: number) {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-green-500";
  }

  function riskBadge(level: string) {
    const map: Record<string, "destructive" | "warning" | "success" | "default"> = {
      Critical: "destructive",
      High: "warning",
      Medium: "default",
      Low: "success",
    };
    return <Badge variant={map[level] || "default"}>{level}</Badge>;
  }

  function npsDot(score: number) {
    if (score >= 9) return <span className="inline-block h-3 w-3 rounded-full bg-green-500" title="Promoter" />;
    if (score >= 7) return <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" title="Passive" />;
    return <span className="inline-block h-3 w-3 rounded-full bg-red-500" title="Detractor" />;
  }

  function starRating(score: number) {
    return (
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`h-4 w-4 ${s <= score ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
        ))}
      </span>
    );
  }

  const tabs = [
    { id: "health", label: "Health Scores", icon: Heart },
    { id: "nps", label: "NPS Surveys", icon: ThumbsUp },
    { id: "csat", label: "CSAT Surveys", icon: Star },
    { id: "onboarding", label: "Onboarding", icon: ClipboardCheck },
    { id: "churn", label: "Churn Prediction", icon: AlertTriangle },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Success</h1>
          <p className="text-muted-foreground">Monitor health, satisfaction, onboarding, and churn risk</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Health Scores */}
        {activeTab === "health" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{healthSummary.averageScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Health Score</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{healthSummary.totalScored}</p>
                  <p className="text-xs text-muted-foreground">Total Scored Contacts</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-red-500">{healthSummary.needsAttention}</p>
                  <p className="text-xs text-muted-foreground">Needs Attention (&lt;40)</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-green-500">{healthSummary.good}</p>
                  <p className="text-xs text-muted-foreground">Good (&gt;=70)</p>
                </div>
              </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BentoCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Health Scores</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Filter by contact ID"
                        className="w-36 h-8 text-sm"
                        value={healthFilter.contactId}
                        onChange={(e) => setHealthFilter({ ...healthFilter, contactId: e.target.value })}
                      />
                      <Select
                        value={healthFilter.category}
                        onValueChange={(v) => setHealthFilter({ ...healthFilter, category: v === "all" ? "" : v })}
                      >
                        <SelectTrigger className="w-32 h-8 text-sm">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Onboarding">Onboarding</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="At Risk">At Risk</SelectItem>
                          <SelectItem value="Churned">Churned</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={loadHealthScores}>
                        <Activity className="mr-1 h-3 w-3" /> Refresh
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {healthScores.length === 0 && <p className="text-sm text-muted-foreground">No health scores yet.</p>}
                    {healthScores.map((h: any) => {
                      const score = h.score ?? h.healthScore ?? 0;
                      return (
                        <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{h.contact?.name || h.contactName || `Contact #${h.contactId}`}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {h.category} · {h.notes && `${h.notes} · `}
                              {h.factors && Array.isArray(h.factors) ? h.factors.slice(0, 3).join(", ") + (h.factors.length > 3 ? "..." : "") : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {scoreBadge(score)}
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteHealthScore(h.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </BentoCard>
              </div>

              <div>
                <BentoCard>
                  <h3 className="font-semibold mb-4">Create / Update Score</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Contact ID</label>
                      <Input
                        type="number"
                        placeholder="Contact ID"
                        value={healthForm.contactId}
                        onChange={(e) => setHealthForm({ ...healthForm, contactId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Score: {healthForm.score}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={healthForm.score}
                        onChange={(e) => setHealthForm({ ...healthForm, score: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span><span>50</span><span>100</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Category</label>
                      <Select value={healthForm.category} onValueChange={(v) => setHealthForm({ ...healthForm, category: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Onboarding">Onboarding</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="At Risk">At Risk</SelectItem>
                          <SelectItem value="Churned">Churned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Notes</label>
                      <Input
                        value={healthForm.notes}
                        onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                        placeholder="Optional notes"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Factors (JSON)</label>
                      <Input
                        value={healthForm.factors}
                        onChange={(e) => setHealthForm({ ...healthForm, factors: e.target.value })}
                        placeholder='["factor1", "factor2"]'
                      />
                    </div>
                    <Button className="w-full" onClick={saveHealthScore} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Plus className="mr-2 h-4 w-4" /> Save Score
                    </Button>
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: NPS Surveys */}
        {activeTab === "nps" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{npsSummary.averageScore}</p>
                  <p className="text-xs text-muted-foreground">Avg NPS Score</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-green-500">{npsSummary.promoters}</p>
                  <p className="text-xs text-muted-foreground">Promoters</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-yellow-500">{npsSummary.passives}</p>
                  <p className="text-xs text-muted-foreground">Passives</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-red-500">{npsSummary.detractors}</p>
                  <p className="text-xs text-muted-foreground">Detractors</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{npsSummary.total}</p>
                  <p className="text-xs text-muted-foreground">Total Responses</p>
                </div>
              </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BentoCard>
                  <h3 className="font-semibold mb-4">NPS Responses</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {npsResponses.length === 0 && <p className="text-sm text-muted-foreground">No NPS responses yet.</p>}
                    {npsResponses.map((r: any) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        {npsDot(r.score)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.contact?.name || r.contactName || `Contact #${r.contactId}`}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.comment || "No comment"}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold">{r.score}</p>
                          <p className="text-[10px] text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div>
                <BentoCard>
                  <h3 className="font-semibold mb-4">Submit NPS Response</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Contact ID</label>
                      <Input
                        type="number"
                        placeholder="Contact ID"
                        value={npsForm.contactId}
                        onChange={(e) => setNpsForm({ ...npsForm, contactId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Score (0-10)</label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0-10"
                        value={npsForm.score}
                        onChange={(e) => setNpsForm({ ...npsForm, score: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Comment</label>
                      <Input
                        value={npsForm.comment}
                        onChange={(e) => setNpsForm({ ...npsForm, comment: e.target.value })}
                        placeholder="Optional comment"
                      />
                    </div>
                    <Button className="w-full" onClick={submitNps} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ThumbsUp className="mr-2 h-4 w-4" /> Submit
                    </Button>
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}

        {/* Tab 3: CSAT Surveys */}
        {activeTab === "csat" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{csatSummary.averageScore}</p>
                  <p className="text-xs text-muted-foreground">Avg CSAT Score</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{csatSummary.total}</p>
                  <p className="text-xs text-muted-foreground">Total Responses</p>
                </div>
              </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BentoCard>
                  <h3 className="font-semibold mb-4">CSAT Responses</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {csatResponses.length === 0 && <p className="text-sm text-muted-foreground">No CSAT responses yet.</p>}
                    {csatResponses.map((r: any) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.contact?.name || r.contactName || `Contact #${r.contactId}`}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {r.ticket?.subject || r.ticketSubject ? `Ticket: ${r.ticket?.subject || r.ticketSubject} · ` : ""}
                            {r.comment || "No comment"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex justify-end">{starRating(r.score)}</div>
                          <p className="text-[10px] text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div>
                <BentoCard>
                  <h3 className="font-semibold mb-4">Submit CSAT Response</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Contact ID</label>
                      <Input
                        type="number"
                        placeholder="Contact ID"
                        value={csatForm.contactId}
                        onChange={(e) => setCsatForm({ ...csatForm, contactId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Ticket ID (optional)</label>
                      <Input
                        type="number"
                        placeholder="Ticket ID"
                        value={csatForm.ticketId}
                        onChange={(e) => setCsatForm({ ...csatForm, ticketId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Score (1-5)</label>
                      <Select value={csatForm.score} onValueChange={(v) => setCsatForm({ ...csatForm, score: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <SelectItem key={s} value={String(s)}>
                              {s} {s === 1 ? "Star" : "Stars"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Comment</label>
                      <Input
                        value={csatForm.comment}
                        onChange={(e) => setCsatForm({ ...csatForm, comment: e.target.value })}
                        placeholder="Optional comment"
                      />
                    </div>
                    <Button className="w-full" onClick={submitCsat} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Star className="mr-2 h-4 w-4" /> Submit
                    </Button>
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}

        {/* Tab 4: Onboarding */}
        {activeTab === "onboarding" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{onboardingStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-green-500">{onboardingStats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-yellow-500">{onboardingStats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-muted-foreground">{onboardingStats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BentoCard>
                  <h3 className="font-semibold mb-4">Onboarding Tasks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Pending", "In Progress", "Completed", "Skipped"].map((status) => (
                      <div key={status}>
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">{status}</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {onboardingTasks.filter((t: any) => t.status === status).length === 0 && (
                            <p className="text-xs text-muted-foreground">No tasks</p>
                          )}
                          {onboardingTasks
                            .filter((t: any) => t.status === status)
                            .map((t: any) => (
                              <div key={t.id} className="p-2 rounded-lg bg-muted/30 text-sm">
                                <p className="font-medium truncate">{t.title}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {t.contact?.name || t.contactName || `Contact #${t.contactId}`}
                                  {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                                </p>
                                {t.dueDate && (
                                  <p className="text-[10px] text-muted-foreground">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                                )}
                                {(status === "Pending" || status === "In Progress") && (
                                  <div className="flex gap-1 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => updateOnboardingStatus(t.id, "Completed")}>
                                      Complete
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => updateOnboardingStatus(t.id, "Skipped")}>
                                      Skip
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => deleteOnboardingTask(t.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                {status === "Completed" && (
                                  <div className="flex gap-1 mt-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => deleteOnboardingTask(t.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div>
                <BentoCard>
                  <h3 className="font-semibold mb-4">Create Task</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Contact ID</label>
                      <Input
                        type="number"
                        placeholder="Contact ID"
                        value={onboardingForm.contactId}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, contactId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Title</label>
                      <Input
                        placeholder="Task title"
                        value={onboardingForm.title}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Description</label>
                      <Input
                        placeholder="Optional description"
                        value={onboardingForm.description}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Due Date</label>
                      <Input
                        type="date"
                        value={onboardingForm.dueDate}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, dueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Assigned To</label>
                      <Input
                        placeholder="Assignee name"
                        value={onboardingForm.assignedTo}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, assignedTo: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={createOnboardingTask} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}

        {/* Tab 5: Churn Prediction */}
        {activeTab === "churn" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{churnSummary.total}</p>
                  <p className="text-xs text-muted-foreground">Total Predicted</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-orange-500">{churnSummary.highRisk}</p>
                  <p className="text-xs text-muted-foreground">High Risk</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold text-red-500">{churnSummary.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </BentoCard>
              <BentoCard>
                <div className="text-center p-2">
                  <p className="text-3xl font-bold">{churnSummary.avgRiskScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Risk Score</p>
                </div>
              </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BentoCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Predictions</h3>
                    <Select value={churnFilter} onValueChange={(v) => { setChurnFilter(v); setTimeout(loadChurnPredictions, 0); }}>
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {churnPredictions.length === 0 && <p className="text-sm text-muted-foreground">No predictions yet.</p>}
                    {churnPredictions.map((p: any) => (
                      <div key={p.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{p.contact?.name || p.contactName || `Contact #${p.contactId}`}</p>
                          {riskBadge(p.riskLevel)}
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all ${riskColor(p.riskScore ?? 0)}`}
                            style={{ width: `${Math.min(p.riskScore ?? 0, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Risk: {p.riskScore ?? 0}%</span>
                          <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                        {p.factors && Array.isArray(p.factors) && p.factors.length > 0 && (
                          <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                            {p.factors.map((f: string, i: number) => <li key={i}>{f}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div>
                <BentoCard>
                  <h3 className="font-semibold mb-4">Create Prediction</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Contact ID</label>
                      <Input
                        type="number"
                        placeholder="Contact ID"
                        value={churnForm.contactId}
                        onChange={(e) => setChurnForm({ ...churnForm, contactId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Risk Score: {churnForm.riskScore}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={churnForm.riskScore}
                        onChange={(e) => setChurnForm({ ...churnForm, riskScore: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span><span>50</span><span>100</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Risk Level</label>
                      <Select value={churnForm.riskLevel} onValueChange={(v) => setChurnForm({ ...churnForm, riskLevel: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Factors (JSON)</label>
                      <Input
                        value={churnForm.factors}
                        onChange={(e) => setChurnForm({ ...churnForm, factors: e.target.value })}
                        placeholder='["factor1", "factor2"]'
                      />
                    </div>
                    <Button className="w-full" onClick={createChurnPrediction} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <AlertTriangle className="mr-2 h-4 w-4" /> Create Prediction
                    </Button>
                  </div>
                </BentoCard>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
