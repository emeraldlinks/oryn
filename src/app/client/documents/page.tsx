"use client";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileSignature } from "lucide-react";

export default function ClientDocumentsPage() {
  const docs = [
    { title: "Proposal - Website Redesign", type: "Proposal", status: "Signed", date: "Mar 12, 2024" },
    { title: "Service Agreement", type: "Contract", status: "Pending", date: "Mar 14, 2024" },
    { title: "Monthly Report - Feb 2024", type: "Report", status: "Sent", date: "Mar 1, 2024" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Documents</h1>

        <div className="rounded-lg border overflow-hidden">
          {docs.map((doc) => (
            <div key={doc.title} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.type} · {doc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.status === "Signed" ? "success" : doc.status === "Sent" ? "warning" : "secondary"}>
                  {doc.status}
                </Badge>
                {doc.status === "Pending" && (
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
