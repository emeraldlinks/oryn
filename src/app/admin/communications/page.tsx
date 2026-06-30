"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Calendar, Plus, Send, PhoneCall } from "lucide-react";

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "calls" | "meetings">("messages");
  const [messages, setMessages] = useState<any[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ toAddress: "", subject: "", body: "", channel: "email" });

  useEffect(() => {
    fetch("/api/communications/messages").then((r) => r.json()).then(setMessages);
    fetch("/api/communications/calls").then((r) => r.json()).then(setCalls);
    fetch("/api/communications/meetings").then((r) => r.json()).then(setMeetings);
  }, []);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/communications/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(composeForm),
    });
    if (res.ok) {
      setShowCompose(false);
      setComposeForm({ toAddress: "", subject: "", body: "", channel: "email" });
      setMessages(await fetch("/api/communications/messages").then((r) => r.json()));
    }
  }

  const unread = messages.filter((m: any) => !m.readAt).length;
  const todayCalls = calls.filter((c: any) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length;
  const todayMeetings = meetings.filter((m: any) => new Date(m.scheduledAt).toDateString() === new Date().toDateString()).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communications Hub</h1>
          <p className="text-muted-foreground">Unified inbox, calls, and meetings</p>
        </div>

        <BentoGrid>
          <StatCard title="Unread Messages" value={unread} icon={MessageSquare} />
          <StatCard title="Calls Today" value={todayCalls} icon={Phone} />
          <StatCard title="Meetings Today" value={todayMeetings} icon={Calendar} />
        </BentoGrid>

        <div className="flex gap-2 border-b pb-2">
          {(["messages", "calls", "meetings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowCompose(!showCompose)}>
                <Send className="mr-2 h-4 w-4" /> Compose
              </Button>
            </div>

            {showCompose && (
              <form onSubmit={sendMessage} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="To" value={composeForm.toAddress} onChange={(e) => setComposeForm({ ...composeForm, toAddress: e.target.value })} required />
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={composeForm.channel} onChange={(e) => setComposeForm({ ...composeForm, channel: e.target.value })}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <Input placeholder="Subject" value={composeForm.subject} onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })} />
                <textarea
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  placeholder="Message body..."
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  required
                />
                <Button type="submit">Send</Button>
              </form>
            )}

            <div className="rounded-lg border overflow-hidden">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">No messages yet</div>
              ) : (
                messages.slice(0, 20).map((msg: any) => (
                  <div key={msg.id} className="flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${msg.readAt ? "bg-transparent" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{msg.subject || "(No subject)"}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{msg.channel}</span>
                        <span>·</span>
                        <span>{msg.fromAddress} → {msg.toAddress}</span>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{msg.body}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "calls" && (
          <div className="rounded-lg border overflow-hidden">
            {calls.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">No calls logged</div>
            ) : (
              calls.slice(0, 20).map((call: any) => (
                <div key={call.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    call.direction === "inbound" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{call.phoneNumber}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{call.direction}</span>
                      <span>·</span>
                      <span>{call.duration ? `${call.duration}s` : "No duration"}</span>
                      {call.sentiment && (
                        <>
                          <span>·</span>
                          <Badge variant="outline" className="text-xs">{call.sentiment}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(call.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="rounded-lg border overflow-hidden">
            {meetings.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">No meetings scheduled</div>
            ) : (
              meetings.slice(0, 20).map((meeting: any) => (
                <div key={meeting.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(meeting.scheduledAt).toLocaleString()}</span>
                      {meeting.duration && (
                        <>
                          <span>·</span>
                          <span>{meeting.duration} min</span>
                        </>
                      )}
                      <span>·</span>
                      <Badge variant={meeting.status === "completed" ? "success" : meeting.status === "cancelled" ? "destructive" : "default"}>
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                  {meeting.meetingUrl && (
                    <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Join
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
