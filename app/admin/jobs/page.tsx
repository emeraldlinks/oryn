"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Server, Loader2, Trash2, RefreshCw, Filter } from "lucide-react";

interface Job {
  id: number;
  type: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  error: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  running: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => { loadJobs(); }, []);

  async function loadJobs() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/admin/jobs?${params}`);
      if (res.ok) setJobs(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadJobs(); }, [statusFilter, typeFilter]);

  async function retryJob(id: number) {
    try {
      const res = await fetch(`/api/admin/jobs/${id}/retry`, { method: "POST" });
      if (res.ok) { toast.success("Job retry initiated"); loadJobs(); }
      else toast.error("Failed to retry job");
    } catch { toast.error("Failed to retry job"); }
  }

  async function deleteJob(id: number) {
    try {
      const res = await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Job deleted"); loadJobs(); }
      else toast.error("Failed to delete job");
    } catch { toast.error("Failed to delete job"); }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Background Jobs</h1>
          <p className="text-muted-foreground">Monitor and manage background job processing</p>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <Input placeholder="Filter by type..." value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-48" />
              </div>
              <Button variant="outline" size="sm" onClick={loadJobs}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Type</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-center py-2 px-2 font-medium">Attempts/Max</th>
                    <th className="text-left py-2 px-2 font-medium">Error</th>
                    <th className="text-left py-2 px-2 font-medium">Created</th>
                    <th className="text-right py-2 pl-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No jobs found.</td></tr>
                  ) : jobs.map((j) => (
                    <tr key={j.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{j.type}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[j.status] || "bg-muted text-muted-foreground"}`}>{j.status}</span>
                      </td>
                      <td className="py-3 px-2 text-center text-xs text-muted-foreground">{j.attempts}/{j.maxAttempts}</td>
                      <td className="py-3 px-2 text-xs text-red-600 max-w-[200px] truncate">{j.error || "-"}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(j.createdAt).toLocaleString()}</td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {j.status === "failed" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => retryJob(j.id)} title="Retry">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteJob(j.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
