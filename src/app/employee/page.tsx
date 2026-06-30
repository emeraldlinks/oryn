"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Calendar, Target, MessageSquare, Phone, CheckCircle } from "lucide-react";

export default function EmployeePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Your personal workspace</p>
        </div>

        <BentoGrid>
          <StatCard title="My Tasks" value="8" icon={Calendar} />
          <StatCard title="Active Leads" value="12" icon={Target} trend={{ value: 3, positive: true }} />
          <StatCard title="Unread Messages" value="5" icon={MessageSquare} />
          <StatCard title="Calls Today" value="14" icon={Phone} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Tasks</h3>
                <span className="text-xs text-muted-foreground">8 remaining</span>
              </div>
              <div className="space-y-2">
                {[
                  { task: "Follow up with Acme Corp", due: "Today", priority: "High" },
                  { task: "Prepare Q2 proposal", due: "Tomorrow", priority: "Medium" },
                  { task: "Update contact records", due: "In 3 days", priority: "Low" },
                  { task: "Call Sarah Johnson re: demo", due: "Today", priority: "High" },
                  { task: "Review social media calendar", due: "Tomorrow", priority: "Medium" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">{item.task}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.due}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.priority === "High" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100" :
                        item.priority === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Activities</h3>
              <div className="space-y-3">
                {[
                  { type: "Meeting", title: "Demo with TechFlow Inc", time: "2:00 PM", icon: "📅" },
                  { type: "Call", title: "Follow-up with GlobalTech", time: "3:30 PM", icon: "📞" },
                  { type: "Task", title: "Send proposal to StartupXYZ", time: "End of day", icon: "✅" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
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
