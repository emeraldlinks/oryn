"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2, Check, X, Send } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/hiring/offers")
      .then((r) => r.json())
      .then(setOffers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/hiring/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

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
          <h1 className="text-3xl font-bold">Offer Letters</h1>
          <p className="text-muted-foreground">Manage employment offers</p>
        </div>

        {offers.length === 0 ? (
          <BentoCard><p className="text-sm text-muted-foreground text-center py-8">No offers created yet</p></BentoCard>
        ) : (
          <div className="space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {o.candidate ? `${o.candidate.firstName} ${o.candidate.lastName}` : `Application #${o.applicationId}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {o.offeredSalary ? `${o.currency} ${o.offeredSalary?.toLocaleString()}` : "Salary TBD"}
                      {o.startDate ? ` — Starts ${new Date(o.startDate).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={o.status === "accepted" ? "success" as const : o.status === "declined" ? "destructive" as const : o.status === "sent" ? "default" as const : "secondary" as const}>{o.status}</Badge>
                  {o.status === "draft" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, "sent")}>
                      <Send className="h-3.5 w-3.5 mr-1" /> Send
                    </Button>
                  )}
                  {o.status === "sent" && (
                    <>
                      <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => updateStatus(o.id, "accepted")}>
                        <Check className="h-3.5 w-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateStatus(o.id, "declined")}>
                        <X className="h-3.5 w-3.5 mr-1" /> Decline
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
