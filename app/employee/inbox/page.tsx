"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Send, Star, Archive, Search, Paperclip } from "lucide-react";

export default function EmployeeInboxPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const messages = [
    { id: 1, from: "John Smith", email: "john@acme.com", subject: "RE: Q2 Proposal - Next Steps", preview: "Thanks for the proposal. We'd like to schedule a follow-up meeting...", date: "10:32 AM", starred: true, read: false, folder: "inbox" },
    { id: 2, from: "Sarah Johnson", email: "sarah@techflow.io", subject: "Product Demo Confirmation", preview: "Confirming our demo on March 25th at 2:00 PM EST. Please find attached...", date: "9:15 AM", starred: false, read: false, folder: "inbox", hasAttachments: true },
    { id: 3, from: "Mike Chen", email: "mike@globaltech.com", subject: "Contract Review - GlobalTech", preview: "I've reviewed the contract and have a few questions about section 4.2...", date: "Yesterday", starred: true, read: true, folder: "inbox" },
    { id: 4, from: "Emily Davis", email: "emily@startup.xyz", subject: "Onboarding Checklist", preview: "Welcome to Oryn! Here's your onboarding checklist to get started...", date: "Yesterday", starred: false, read: true, folder: "sent" },
    { id: 5, from: "Robert Wilson", email: "rob@dataflow.co", subject: "Data Pipeline Requirements", preview: "As discussed, here are our requirements for the data pipeline integration...", date: "Mar 18", starred: false, read: true, folder: "inbox" },
    { id: 6, from: "Lisa Park", email: "lisa@innovatelab.io", subject: "RE: Partnership Opportunity", preview: "We're very interested in exploring a partnership. Let's set up a call...", date: "Mar 17", starred: true, read: false, folder: "inbox" },
  ];

  const filtered = messages.filter((m) => {
    if (filter === "unread" && m.read) return false;
    if (filter === "starred" && !m.starred) return false;
    if (filter === "sent" && m.folder !== "sent") return false;
    if (filter === "inbox" && m.folder !== "inbox") return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inbox</h1>
            <p className="text-muted-foreground">Email and messages from contacts</p>
          </div>
          <Button>
            <Send className="mr-2 h-4 w-4" /> Compose
          </Button>
        </div>

        <BentoGrid>
          <StatCard title="Unread" value={messages.filter((m) => !m.read).length} icon={Mail} />
          <StatCard title="Starred" value={messages.filter((m) => m.starred).length} icon={Star} />
          <StatCard title="Total Messages" value={messages.length} icon={MessageSquare} />
          <StatCard title="Archived" value={3} icon={Archive} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "inbox", "unread", "starred", "sent"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          {filtered.map((m) => (
            <div key={m.id} className={`flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/30 cursor-pointer ${!m.read ? "bg-muted/20" : ""}`}>
              <div className="flex items-center gap-1">
                <Star className={`h-4 w-4 ${m.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                {m.from.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${!m.read ? "font-semibold" : ""}`}>{m.from}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{m.date}</span>
                </div>
                <p className={`text-sm truncate ${!m.read ? "" : "text-muted-foreground"}`}>{m.subject}</p>
                <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
              </div>
              <div className="flex items-center gap-2">
                {m.hasAttachments && <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />}
                {!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
