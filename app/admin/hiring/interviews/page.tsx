"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Video, MapPin, Clock, Loader2 } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ applicationId: "", candidateId: "", type: "video", scheduledAt: "", durationMinutes: "60", location: "", meetingLink: "" });

  function load() {
    setLoading(true);
    fetch("/api/admin/hiring/interviews")
      .then((r) => r.json())
      .then(setInterviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function createInterview(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/hiring/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: Number(form.applicationId),
        candidateId: Number(form.candidateId),
        type: form.type,
        scheduledAt: form.scheduledAt,
        durationMinutes: Number(form.durationMinutes),
        location: form.location || null,
        meetingLink: form.meetingLink || null,
      }),
    });
    setShowForm(false);
    setForm({ applicationId: "", candidateId: "", type: "video", scheduledAt: "", durationMinutes: "60", location: "", meetingLink: "" });
    load();
  }

  const upcoming = interviews.filter((i: any) => i.status === "scheduled");
  const completed = interviews.filter((i: any) => i.status === "completed");

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground">Schedule and manage interviews</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Schedule</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
              <form onSubmit={createInterview} className="space-y-4">
                <Input type="number" placeholder="Application ID *" value={form.applicationId} onChange={(e) => setForm((f) => ({ ...f, applicationId: e.target.value }))} required />
                <Input type="number" placeholder="Candidate ID *" value={form.candidateId} onChange={(e) => setForm((f) => ({ ...f, candidateId: e.target.value }))} required />
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in-person">In-Person</option>
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="final">Final</option>
                </select>
                <Input type="datetime-local" placeholder="Date & Time *" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} required />
                <Input type="number" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} />
                <Input placeholder="Location or Meeting Link" value={form.meetingLink} onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))} />
                <Button type="submit" className="w-full">Schedule</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <BentoGrid>
          <StatCard title="Upcoming" value={upcoming.length} icon={Calendar} />
          <StatCard title="Completed" value={completed.length} icon={Clock} />
          <StatCard title="Total" value={interviews.length} icon={Video} />
        </BentoGrid>

        <BentoCard>
          <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming interviews</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((iv: any) => (
                <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium capitalize">{iv.type} Interview</p>
                      <p className="text-xs text-muted-foreground">
                        {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : ""}
                        {iv.candidate ? ` — ${iv.candidate.firstName} ${iv.candidate.lastName}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {iv.meetingLink && <Button variant="ghost" size="sm" asChild><a href={iv.meetingLink} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4" /></a></Button>}
                    <Badge>{iv.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
    </DashboardShell>
  );
}
