"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Users, Building2, Check, Loader2 } from "lucide-react";

export default function BillingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/billing")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.currentPlan) setSelectedPlan(d.currentPlan.name);
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

  const { workspace, currentPlan, plans, invoices, contactCount } = data || {};

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and usage</p>
        </div>

        <BentoGrid>
          <StatCard title="Current Plan" value={currentPlan?.name || workspace?.plan || "Starter"} icon={CreditCard} />
          <StatCard title="Monthly Bill" value={currentPlan ? `$${currentPlan.price}` : "$0"} icon={DollarSign} />
          <StatCard title="Contact Usage" value={`${contactCount ?? 0} / ${currentPlan?.features?.includes("unlimited") ? "∞" : "—"}`} icon={Users} />
          <StatCard title="Invoices" value={invoices?.length || 0} icon={Building2} />
        </BentoGrid>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(plans || []).map((plan: any) => (
            <BentoCard key={plan.id}>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/{plan.billingCycle === "yearly" ? "yr" : "mo"}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.description || `Billed ${plan.billingCycle}`}
                </div>
                <div className="space-y-2 text-left">
                  {(plan.features || []).map((f: string) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={selectedPlan === plan.name ? "outline" : "default"}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {selectedPlan === plan.name ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
