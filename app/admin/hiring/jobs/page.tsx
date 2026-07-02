"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Search, Loader2, Eye, EyeOff } from "lucide-react";

export default function HiringJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", description: "", location: "", employmentType: "", status: "draft" });

  function loadJobs() {
    setLoading(true);
    fetch("/api/admin/hiring/jobs")
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadJobs(); }, []);

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/hiring/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ title: "", department: "", description: "", location: "", employmentType: "", status: "draft" });
    loadJobs();
  }

  async function toggleStatus(job: any) {
    const newStatus = job.status === "active" ? "paused" : "active";
    await fetch(`/api/admin/hiring/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadJobs();
  }

  const filtered = jobs.filter((j) => !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.department?.toLowerCase().includes(search.toLowerCase()));

  if (loading && jobs.length === 0) {
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
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <p className="text-muted-foreground">Manage your open positions</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> New Job</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Job Posting</DialogTitle></DialogHeader>
              <form onSubmit={createJob} className="space-y-4">
                <Input placeholder="Job Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                <Input placeholder="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
                <Input placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                <Input placeholder="Employment Type (full-time, contract, etc)" value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))} />
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Job description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                <Button type="submit" className="w-full">Create Job</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <BentoGrid>
          <StatCard title="Total Jobs" value={jobs.length} icon={Briefcase} />
          <StatCard title="Active" value={jobs.filter((j) => j.status === "active").length} icon={Briefcase} />
          <StatCard title="Draft" value={jobs.filter((j) => j.status === "draft").length} icon={Briefcase} />
          <StatCard title="Closed" value={jobs.filter((j) => j.status === "closed").length} icon={Briefcase} />
        </BentoGrid>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Title</span><span>Dept</span><span>Applicants</span><span>Status</span><span />
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No jobs yet</p>
          ) : filtered.map((job) => (
            <div key={job.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <a href={`/admin/hiring/jobs/${job.id}`} className="font-medium hover:text-primary">{job.title}</a>
              <span className="text-sm text-muted-foreground">{job.department || "—"}</span>
              <span className="text-sm">{job.applicationsCount || 0}</span>
              <Badge variant={job.status === "active" ? "success" as const : job.status === "draft" ? "warning" as const : "secondary" as const}>{job.status}</Badge>
              <Button variant="ghost" size="icon" onClick={() => toggleStatus(job)} title={job.status === "active" ? "Pause" : "Activate"}>
                {job.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
