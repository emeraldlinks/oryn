"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, Search, Loader2 } from "lucide-react";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", due: "", priority: "medium" });

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    try {
      const res = await fetch("/api/employee/tasks");
      if (res.ok) setTasks(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/employee/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Task created");
      setShowForm(false);
      setForm({ title: "", due: "", priority: "medium" });
      loadTasks();
    } else {
      toast.error("Failed to create task");
    }
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
          <form onSubmit={addTask} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Input placeholder="Task title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="flex gap-3">
              <Input type="date" className="flex-1" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
              <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
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
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No tasks found.</p>
          ) : filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" checked={t.status === "completed"} readOnly />
                <div>
                  <p className={`font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.due ? new Date(t.due).toLocaleDateString() : "No due date"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusIcon(t.status)}
                <Badge variant={priorityColor(t.priority)}>{t.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
