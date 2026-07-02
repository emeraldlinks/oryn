"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { ShoppingCart, FileText, Ticket, Clock, CheckCircle } from "lucide-react";

export default function ClientPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Portal</h1>
          <p className="text-muted-foreground">Your account overview</p>
        </div>

        <BentoGrid>
          <StatCard title="Active Orders" value="3" icon={ShoppingCart} />
          <StatCard title="Open Invoices" value="2" icon={FileText} />
          <StatCard title="Support Tickets" value="1" icon={Ticket} />
          <StatCard title="Onboarding Progress" value="65%" icon={Clock} />
        </BentoGrid>

        <BentoGrid>
          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <div className="space-y-3">
                {[
                  { order: "ORD-2024-001", status: "In Progress", total: "$2,400", date: "Mar 15" },
                  { order: "ORD-2024-002", status: "Completed", total: "$850", date: "Mar 10" },
                  { order: "ORD-2024-003", status: "Pending", total: "$3,200", date: "Mar 18" },
                ].map((item) => (
                  <div key={item.order} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{item.order}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100" :
                        item.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-sm font-medium">{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Onboarding Progress</h3>
              <div className="space-y-4">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: "65%" }} />
                </div>
                <div className="space-y-2">
                  {[
                    { step: "Account Setup", done: true },
                    { step: "Team Onboarding", done: true },
                    { step: "Data Migration", done: true },
                    { step: "Integration Setup", done: false },
                    { step: "Training Complete", done: false },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      {s.done ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={`text-sm ${s.done ? "" : "text-muted-foreground"}`}>{s.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </DashboardShell>
  );
}
