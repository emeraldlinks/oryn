"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { HardDrive, Plus, Loader2, RefreshCw } from "lucide-react";

interface Backup {
  id: number;
  type: string;
  status: string;
  fileSize: string | null;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  running: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
};

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadBackups(); }, []);

  async function loadBackups() {
    try {
      const res = await fetch("/api/admin/backups");
      if (res.ok) setBackups(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function createBackup() {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "manual" }),
      });
      if (res.ok) { toast.success("Backup created"); loadBackups(); }
      else toast.error("Failed to create backup");
    } catch { toast.error("Failed to create backup"); } finally { setCreating(false); }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Backups</h1>
            <p className="text-muted-foreground">Manage system backups</p>
          </div>
          <Button onClick={createBackup} disabled={creating}>
            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HardDrive className="mr-2 h-4 w-4" />}
            Create Backup
          </Button>
        </div>

        <BentoCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium">Type</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                  <th className="text-left py-2 px-2 font-medium">File Size</th>
                  <th className="text-left py-2 px-2 font-medium">Started At</th>
                  <th className="text-left py-2 px-2 font-medium">Completed At</th>
                  <th className="text-left py-2 pl-4 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : backups.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No backups found.</td></tr>
                ) : backups.map((b) => (
                  <tr key={b.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium capitalize">{b.type}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] || "bg-muted text-muted-foreground"}`}>{b.status}</span>
                    </td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{b.fileSize || "-"}</td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{b.startedAt ? new Date(b.startedAt).toLocaleString() : "-"}</td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{b.completedAt ? new Date(b.completedAt).toLocaleString() : "-"}</td>
                    <td className="py-3 pl-4 text-xs text-red-600">{b.error || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
