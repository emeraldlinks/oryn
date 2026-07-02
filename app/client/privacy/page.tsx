"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Eye, CheckCircle, Loader2 } from "lucide-react";

export default function ClientPrivacyPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/client/dashboard")
      .then((r) => r.json())
      .then(setData)
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

  const contact = data?.contact;
  const personalData = contact ? [
    { label: "Name", value: contact.name || contact.firstName + " " + contact.lastName || "—", category: "Identity" },
    { label: "Email", value: contact.email || "—", category: "Contact" },
    { label: "Phone", value: contact.phone || "—", category: "Contact" },
    { label: "Company", value: contact.company || "—", category: "Professional" },
  ] : [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Privacy Portal</h1>
          <p className="text-muted-foreground">Your data, your control.</p>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data We Hold About You</h3>
            {personalData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No personal data found for your account.</p>
            ) : (
              <div className="space-y-2">
                {personalData.map((item) => (
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
            )}
          </div>
        </BentoCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Rights</h3>
              <div className="space-y-2">
                {[
                  "Right to Access",
                  "Right to Rectification",
                  "Right to Erasure",
                  "Right to Data Portability",
                  "Right to Object",
                ].map((right) => (
                  <div key={right} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {right}
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
      </div>
    </DashboardShell>
  );
}
