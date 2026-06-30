"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Users, Building2, Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    contacts: 500,
    branches: 1,
    features: ["All features included", "Unlimited users", "Email support"],
    popular: false,
  },
  {
    name: "Growth",
    price: "$79",
    contacts: 2500,
    branches: 5,
    features: ["All features included", "Unlimited users", "Priority support", "API access"],
    popular: true,
  },
  {
    name: "Scale",
    price: "$199",
    contacts: 10000,
    branches: 25,
    features: ["All features included", "Unlimited users", "24/7 support", "API access", "Custom branding"],
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    contacts: -1,
    branches: -1,
    features: ["Everything in Scale", "Dedicated support", "SLA guarantee", "On-premise option"],
    popular: false,
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("Starter");

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and usage</p>
        </div>

        <BentoGrid>
          <StatCard title="Current Plan" value={currentPlan} icon={CreditCard} />
          <StatCard title="Monthly Bill" value="$29" icon={DollarSign} />
          <StatCard title="Contact Usage" value="142 / 500" icon={Users} />
          <StatCard title="Branch Usage" value="2 / 1" icon={Building2} />
        </BentoGrid>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <BentoCard key={plan.name} className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="text-3xl font-bold">
                  {plan.price}
                  {plan.contacts !== -1 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.contacts === -1 ? "Unlimited" : `Up to ${plan.contacts.toLocaleString()}`} contacts
                  <br />
                  {plan.branches === -1 ? "Unlimited" : `Up to ${plan.branches}`} branches
                </div>
                <div className="space-y-2 text-left">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={currentPlan === plan.name ? "outline" : plan.popular ? "default" : "secondary"}
                  onClick={() => setCurrentPlan(plan.name)}
                >
                  {currentPlan === plan.name ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
