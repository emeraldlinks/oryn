"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, Plus, Trash2, Loader2, Check, X, RefreshCw, Shield } from "lucide-react";

interface Domain {
  id: number;
  domain: string;
  verified: boolean;
  sslStatus: string;
  createdAt: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => { loadDomains(); }, []);

  async function loadDomains() {
    try {
      const res = await fetch("/api/admin/domains");
      if (res.ok) setDomains(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function addDomain() {
    if (!newDomain.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });
      if (res.ok) {
        toast.success("Domain added");
        setNewDomain("");
        loadDomains();
      } else { const err = await res.json(); toast.error(err.error || "Failed to add domain"); }
    } catch { toast.error("Failed to add domain"); } finally { setAdding(false); }
  }

  async function deleteDomain(id: number) {
    try {
      const res = await fetch(`/api/admin/domains?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Domain removed"); loadDomains(); }
      else toast.error("Failed to remove domain");
    } catch { toast.error("Failed to remove domain"); }
  }

  async function verifyDomain(id: number) {
    try {
      const res = await fetch(`/api/admin/domains/${id}/verify`, { method: "POST" });
      if (res.ok) { toast.success("Domain verified"); loadDomains(); }
      else { const err = await res.json(); toast.error(err.error || "Verification failed"); }
    } catch { toast.error("Verification failed"); }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Custom Domains</h1>
          <p className="text-muted-foreground">Manage custom domains for your workspace</p>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Add Domain</label>
                <Input placeholder="example.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDomain()} />
              </div>
              <Button onClick={addDomain} disabled={adding || !newDomain.trim()}>
                {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Domain</th>
                    <th className="text-center py-2 px-2 font-medium">Verified</th>
                    <th className="text-center py-2 px-2 font-medium">SSL Status</th>
                    <th className="text-left py-2 px-2 font-medium">Created</th>
                    <th className="text-right py-2 pl-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                  ) : domains.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No domains added yet.</td></tr>
                  ) : domains.map((d) => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{d.domain}</td>
                      <td className="py-3 px-2 text-center">
                        {d.verified ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={d.sslStatus === "active" ? "default" : "secondary"}>{d.sslStatus || "N/A"}</Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!d.verified && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => verifyDomain(d.id)} title="Verify">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteDomain(d.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
