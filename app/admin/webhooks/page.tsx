"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, Loader2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface WebhookDelivery {
  id: number;
  endpointId: string;
  status: string;
  httpStatus: number | null;
  durationMs: number | null;
  createdAt: string;
  error: string | null;
  requestBody?: string;
  requestHeaders?: string;
  responseBody?: string;
  responseHeaders?: string;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  retrying: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
};

export default function WebhooksPage() {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [endpointFilter, setEndpointFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => { loadDeliveries(); }, []);

  async function loadDeliveries() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (endpointFilter) params.set("endpointId", endpointFilter);
      const res = await fetch(`/api/admin/webhook-deliveries?${params}`);
      if (res.ok) setDeliveries(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadDeliveries(); }, [statusFilter, endpointFilter]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Webhook Deliveries</h1>
          <p className="text-muted-foreground">Monitor webhook delivery attempts and details</p>
        </div>

        <BentoCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="retrying">Retrying</option>
              </select>
              <Input placeholder="Endpoint ID..." value={endpointFilter} onChange={(e) => setEndpointFilter(e.target.value)} className="w-48" />
              <Button variant="outline" size="sm" onClick={loadDeliveries}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Endpoint ID</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-center py-2 px-2 font-medium">HTTP Status</th>
                    <th className="text-right py-2 px-2 font-medium">Duration ms</th>
                    <th className="text-left py-2 px-2 font-medium">Created</th>
                    <th className="text-left py-2 pl-4 font-medium">Error</th>
                    <th className="text-right py-2 pl-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                  ) : deliveries.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No deliveries found.</td></tr>
                  ) : deliveries.map((d) => (
                    <>
                      <tr key={d.id} className="border-b hover:bg-muted/30 cursor-pointer" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
                        <td className="py-3 pr-4 font-mono text-xs">{d.endpointId}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[d.status] || "bg-muted text-muted-foreground"}`}>{d.status}</span>
                        </td>
                        <td className="py-3 px-2 text-center">{d.httpStatus ?? "-"}</td>
                        <td className="py-3 px-2 text-right text-xs text-muted-foreground">{d.durationMs ?? "-"}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</td>
                        <td className="py-3 pl-4 text-xs text-red-600 max-w-[150px] truncate">{d.error || "-"}</td>
                        <td className="py-3 pl-4 text-right">
                          {expandedId === d.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </td>
                      </tr>
                      {expandedId === d.id && (
                        <tr key={`${d.id}-details`} className="bg-muted/20">
                          <td colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Request</h4>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Headers</p>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-32">{d.requestHeaders || "N/A"}</pre>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Body</p>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-32">{d.requestBody || "N/A"}</pre>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Response</h4>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Headers</p>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-32">{d.responseHeaders || "N/A"}</pre>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Body</p>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-32">{d.responseBody || "N/A"}</pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
