"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Eye, CheckCircle, XCircle } from "lucide-react";

export default function ClientPrivacyPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Privacy Portal</h1>
          <p className="text-muted-foreground">Your data, your control. See what data Oryn holds about you.</p>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data We Hold About You</h3>
            <div className="space-y-2">
              {[
                { label: "Name", value: "John Doe", category: "Identity" },
                { label: "Email", value: "john@example.com", category: "Contact" },
                { label: "Phone", value: "+1 (555) 123-4567", category: "Contact" },
                { label: "Company", value: "Acme Corp", category: "Professional" },
                { label: "Communication History", value: "47 messages", category: "Activity" },
                { label: "Support Tickets", value: "3 tickets", category: "Activity" },
                { label: "Order History", value: "5 orders", category: "Transaction" },
                { label: "Consent Status", value: "GDPR Opt-in", category: "Compliance" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Rights</h3>
              <div className="space-y-2">
                {[
                  { right: "Right to Access", active: true },
                  { right: "Right to Rectification", active: true },
                  { right: "Right to Erasure", active: true },
                  { right: "Right to Data Portability", active: true },
                  { right: "Right to Object", active: true },
                ].map((r) => (
                  <div key={r.right} className="flex items-center gap-2 text-sm">
                    {r.active ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    {r.right}
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Export My Data (GDPR)
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="mr-2 h-4 w-4" /> Request Data Deletion
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  We will process your request within 30 days as required by GDPR/CCPA.
                </p>
              </div>
            </div>
          </BentoCard>
        </div>

        <BentoCard>
          <h3 className="text-lg font-semibold mb-4">Consent History</h3>
          <div className="space-y-3">
            {[
              { source: "Registration form", consent: "Marketing emails", date: "Jan 15, 2024", status: "Active" },
              { source: "Cookie banner", consent: "Analytics cookies", date: "Jan 15, 2024", status: "Active" },
              { source: "Email opt-out", consent: "SMS marketing", date: "Feb 20, 2024", status: "Withdrawn" },
            ].map((c) => (
              <div key={c.source} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{c.consent}</p>
                  <p className="text-xs text-muted-foreground">{c.source} · {c.date}</p>
                </div>
                <Badge variant={c.status === "Active" ? "success" : "secondary"}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
