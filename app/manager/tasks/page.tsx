"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, AlertCircle, Users, Search, Loader2 } from "lucide-react";

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    try {
      const res = await fetch("/api/manager/tasks");
      if (res.ok) setTasks(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const filtered = tasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case "high": return "destructive" as const;
      case "medium": return "warning" as const;
      default: return "secondary" as const;
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  if (loading) {
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
            <h1 className="text-3xl font-bold">Team Tasks</h1>
            <p className="text-muted-foreground">Manage tasks across your team</p>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Total Tasks" value={tasks.length} icon={Calendar} />
          <StatCard title="Completed" value={tasks.filter((t) => t.status === "completed").length} icon={CheckCircle} />
          <StatCard title="In Progress" value={tasks.filter((t) => t.status === "in_progress").length} icon={Clock} />
          <StatCard title="Pending" value={tasks.filter((t) => t.status === "pending").length} icon={Users} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "in_progress", "completed"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Task</span>
            <span>Due</span>
            <span>Priority</span>
            <span>Status</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No tasks found.</p>
          ) : filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <p className="font-medium">{t.title}</p>
              <span className="text-sm text-muted-foreground">{t.due ? new Date(t.due).toLocaleDateString() : ""}</span>
              <Badge variant={priorityColor(t.priority)}>{t.priority}</Badge>
              <div className="flex items-center gap-2">
                {statusIcon(t.status)}
                <span className="text-sm text-muted-foreground capitalize">{t.status?.replace("_", " ") || "pending"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
