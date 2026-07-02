"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Mail, Send, Star, Search, Loader2 } from "lucide-react";

export default function EmployeeInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    try {
      const res = await fetch("/api/employee/inbox");
      if (res.ok) setMessages(await res.json());
    } catch {} finally { setLoading(false); }
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread" && m.read) return false;
    if (search && !m.subject?.toLowerCase().includes(search.toLowerCase()) && !m.from?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
          <StatCard title="Total" value={messages.length} icon={Mail} />
          <StatCard title="Unread" value={messages.filter((m) => !m.read).length} icon={MessageSquare} />
          <StatCard title="Starred" value={messages.filter((m) => m.starred).length} icon={Star} />
        </BentoGrid>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "unread"].map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No messages found.</p>
          ) : filtered.map((m) => (
            <div key={m.id} className={`flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/30 cursor-pointer ${!m.read ? "bg-muted/20" : ""}`}>
              <Star className={`h-4 w-4 ${m.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                {(m.from || m.sender || "?").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${!m.read ? "font-semibold" : ""}`}>{m.from || m.sender || "Unknown"}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <p className={`text-sm truncate ${!m.read ? "" : "text-muted-foreground"}`}>{m.subject || "(no subject)"}</p>
                <p className="text-xs text-muted-foreground truncate">{m.body || m.preview || ""}</p>
              </div>
              {!m.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
