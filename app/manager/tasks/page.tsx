"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, AlertCircle, Users, Search, Plus } from "lucide-react";

export default function ManagerTasksPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const tasks = [
    { id: 1, title: "Follow up with Acme Corp", assignee: "Alice J.", due: "2024-03-20", priority: "high", status: "in_progress" },
    { id: 2, title: "Prepare Q2 proposal", assignee: "Bob S.", due: "2024-03-21", priority: "medium", status: "pending" },
    { id: 3, title: "Update contact records", assignee: "Carol D.", due: "2024-03-22", priority: "low", status: "pending" },
    { id: 4, title: "Call Sarah Johnson re: demo", assignee: "Alice J.", due: "2024-03-20", priority: "high", status: "completed" },
    { id: 5, title: "Review social media calendar", assignee: "David L.", due: "2024-03-23", priority: "medium", status: "pending" },
    { id: 6, title: "Send invoice to TechFlow", assignee: "Bob S.", due: "2024-03-19", priority: "high", status: "completed" },
    { id: 7, title: "Prepare weekly sales report", assignee: "Carol D.", due: "2024-03-24", priority: "low", status: "in_progress" },
    { id: 8, title: "Update product documentation", assignee: "David L.", due: "2024-03-25", priority: "medium", status: "pending" },
  ];

  const filtered = tasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.assignee.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case "high": return "destructive";
      case "medium": return "warning";
      default: return "secondary";
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Tasks</h1>
            <p className="text-muted-foreground">Manage tasks across your team</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Assign Task
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Tasks" value={tasks.length} icon={Calendar} />
          <StatCard title="Completed" value={tasks.filter((t) => t.status === "completed").length} icon={CheckCircle} />
          <StatCard title="In Progress" value={tasks.filter((t) => t.status === "in_progress").length} icon={Clock} />
          <StatCard title="Team Members" value={4} icon={Users} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tasks or assignee..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Task</span>
            <span>Assignee</span>
            <span>Due</span>
            <span>Priority</span>
            <span>Status</span>
          </div>
          {filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-t hover:bg-muted/30">
              <p className="font-medium">{t.title}</p>
              <span className="text-sm">{t.assignee}</span>
              <span className="text-sm text-muted-foreground">{t.due}</span>
              <Badge variant={priorityColor(t.priority) as "destructive" | "warning" | "secondary"}>{t.priority}</Badge>
              <div className="flex items-center gap-2">
                {statusIcon(t.status)}
                <span className="text-sm text-muted-foreground capitalize">{t.status.replace("_", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
