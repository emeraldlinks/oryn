"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Calendar, Target, MessageSquare, Phone, Loader2, CheckCircle } from "lucide-react";

export default function EmployeePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({ tasks: 0, leads: 0, messages: 0, calls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employee/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setActivities(data.activities || []);
        setStats({
          tasks: data.tasks?.length || 0,
          leads: 0,
          messages: 0,
          calls: 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Your personal workspace</p>
        </div>

        <BentoGrid>
          <StatCard title="My Tasks" value={stats.tasks} icon={Calendar} />
          <StatCard title="Active Leads" value={stats.leads} icon={Target} />
          <StatCard title="Unread Messages" value={stats.messages} icon={MessageSquare} />
          <StatCard title="Calls Today" value={stats.calls} icon={Phone} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Tasks</h3>
                <span className="text-xs text-muted-foreground">{tasks.length} total</span>
              </div>
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No tasks yet</p>
                ) : tasks.slice(0, 5).map((t: any, i: number) => (
                  <div key={t.id || i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" checked={t.status === "completed"} readOnly />
                      <span className={`text-sm ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{t.due ? new Date(t.due).toLocaleDateString() : ""}</span>
                      {t.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          t.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100" :
                          t.priority === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100" :
                          "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                        }`}>
                          {t.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                ) : activities.slice(0, 5).map((a: any, i: number) => (
                  <div key={a.id || i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.description || a.type || "Activity"}</p>
                      <p className="text-xs text-muted-foreground">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
