"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileSignature, Loader2 } from "lucide-react";

export default function ClientDocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/documents")
      .then((r) => r.json())
      .then(setDocs)
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
        <h1 className="text-3xl font-bold">My Documents</h1>

        <div className="rounded-lg border overflow-hidden">
          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No documents yet.</p>
          ) : docs.map((doc) => (
            <div key={doc.id || doc.title} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.type} · {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.status === "signed" || doc.status === "Signed" ? "success" : doc.status === "sent" || doc.status === "Sent" ? "warning" : "secondary"}>
                  {doc.status}
                </Badge>
                {(doc.status === "pending" || doc.status === "Pending") && (
                  <Button size="sm">
                    <FileSignature className="mr-2 h-4 w-4" /> Sign
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
