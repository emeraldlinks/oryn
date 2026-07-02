"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, Search } from "lucide-react";

export default function EmployeeTasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const tasks = [
    { id: 1, title: "Follow up with Acme Corp", due: "2024-03-20", priority: "high", status: "pending", related: "Deal #1024" },
    { id: 2, title: "Prepare Q2 proposal for GlobalTech", due: "2024-03-21", priority: "medium", status: "in_progress", related: "Deal #1025" },
    { id: 3, title: "Update contact records - Q1 review", due: "2024-03-22", priority: "low", status: "pending", related: "Contact batch" },
    { id: 4, title: "Call Sarah Johnson re: product demo", due: "2024-03-20", priority: "high", status: "completed", related: "Contact #45" },
    { id: 5, title: "Review social media content calendar", due: "2024-03-23", priority: "medium", status: "pending", related: "Marketing" },
    { id: 6, title: "Send invoice to TechFlow Inc", due: "2024-03-19", priority: "high", status: "completed", related: "Invoice #204" },
    { id: 7, title: "Prepare weekly sales report", due: "2024-03-24", priority: "low", status: "pending", related: "Reports" },
  ];

  const filtered = tasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
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
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground">Manage your daily workflow</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Tasks" value={tasks.length} icon={Calendar} />
          <StatCard title="Completed" value={tasks.filter((t) => t.status === "completed").length} icon={CheckCircle} />
          <StatCard title="In Progress" value={tasks.filter((t) => t.status === "in_progress").length} icon={Clock} />
          <StatCard title="Overdue" value={tasks.filter((t) => t.priority === "high" && t.status !== "completed").length} icon={AlertCircle} />
        </BentoGrid>

        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Input placeholder="Task title" required />
            <div className="flex gap-3">
              <Input type="date" className="flex-1" />
              <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <Button type="submit">Add Task</Button>
          </form>
        )}

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
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" checked={t.status === "completed"} readOnly />
                <div>
                  <p className={`font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.related} · Due: {t.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusIcon(t.status)}
                <Badge variant={priorityColor(t.priority) as "destructive" | "warning" | "secondary"}>{t.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
