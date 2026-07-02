"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays, Link, RefreshCw, Clock, Plus, X, Loader2,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Check,
} from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end?: string;
  color?: string;
  attendees?: string;
  location?: string;
}

interface BookingLink {
  id: number;
  slug: string;
  title: string;
  duration: number;
  totalBookings: number;
  active: boolean;
  description?: string;
  availability?: string;
  bufferConfig?: string;
}

interface CalendarSync {
  id: number;
  provider: string;
  email: string;
  lastSyncedAt?: string;
  active: boolean;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [submitting, setSubmitting] = useState(false);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthGrid = getMonthGrid(year, month);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", start: "", end: "", color: "#6366f1", attendees: "", location: "" });
  const [showNewEvent, setShowNewEvent] = useState(false);

  const [bookings, setBookings] = useState<BookingLink[]>([]);
  const [bookingForm, setBookingForm] = useState({ slug: "", title: "", description: "", durationMinutes: 30, availability: "{}", bufferConfig: "{}" });
  const [showNewBooking, setShowNewBooking] = useState(false);

  const [syncs, setSyncs] = useState<CalendarSync[]>([]);
  const [syncForm, setSyncForm] = useState({ provider: "google", accessToken: "" });
  const [showNewSync, setShowNewSync] = useState(false);

  useEffect(() => {
    loadEvents();
    loadBookings();
    loadSyncs();
  }, [year, month]);

  async function loadEvents() {
    try {
      const params = new URLSearchParams({ year: String(year), month: String(month + 1) });
      const r = await fetch(`/api/calendar/events?${params}`); if (r.ok) setEvents(await r.json());
    } catch {}
  }
  async function loadBookings() { try { const r = await fetch("/api/calendar/booking-links"); if (r.ok) setBookings(await r.json()); } catch {} }
  async function loadSyncs() { try { const r = await fetch("/api/calendar/sync"); if (r.ok) setSyncs(await r.json()); } catch {} }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/calendar/events", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(eventForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewEvent(false);
      setEventForm({ title: "", start: "", end: "", color: "#6366f1", attendees: "", location: "" });
      setSelectedDay(null);
      await loadEvents();
      toast.success("Event created");
    }
  }

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/calendar/booking-links", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewBooking(false);
      setBookingForm({ slug: "", title: "", description: "", durationMinutes: 30, availability: "{}", bufferConfig: "{}" });
      await loadBookings();
      toast.success("Booking link created");
    }
  }

  async function toggleBooking(b: BookingLink) {
    await fetch(`/api/calendar/booking-links?id=${b.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, active: !b.active }),
    });
    await loadBookings();
    toast.success(b.active ? "Link deactivated" : "Link activated");
  }

  async function createSync(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/calendar/sync", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(syncForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewSync(false);
      setSyncForm({ provider: "google", accessToken: "" });
      await loadSyncs();
      toast.success("Calendar connected");
    }
  }

  async function toggleSync(s: CalendarSync) {
    await fetch(`/api/calendar/sync?id=${s.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, active: !s.active }),
    });
    await loadSyncs();
    toast.success(s.active ? "Sync deactivated" : "Sync activated");
  }

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }

  function getDayEvents(day: number) {
    return events.filter((e) => {
      const d = new Date(e.start);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  function handleDayClick(day: number | null) {
    if (!day) return;
    setSelectedDay(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEventForm({ ...eventForm, start: `${dateStr}T09:00`, end: `${dateStr}T10:00` });
    setShowNewEvent(true);
  }

  const tabs = [
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "bookings", label: "Booking Links", icon: Link },
    { id: "sync", label: "Calendar Sync", icon: RefreshCw },
    { id: "availability", label: "Availability", icon: Clock },
  ];

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Events, booking links, and calendar sync</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {DAYS.map((d) => (
                <div key={d} className="bg-muted/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {monthGrid.map((day, i) => (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`bg-card px-2 py-3 text-sm text-left min-h-[80px] transition-colors hover:bg-accent/50 relative ${
                    day === null ? "cursor-default" : ""
                  }`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-medium ${selectedDay === day ? "text-primary" : ""}`}>{day}</span>
                      <div className="mt-1 space-y-0.5">
                        {getDayEvents(day).slice(0, 3).map((e) => (
                          <div
                            key={e.id}
                            className="text-[10px] px-1 py-0.5 rounded truncate text-white"
                            style={{ backgroundColor: e.color || "#6366f1" }}
                          >
                            {e.title}
                          </div>
                        ))}
                        {getDayEvents(day).length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{getDayEvents(day).length - 3} more</span>
                        )}
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
            <Modal open={showNewEvent} onClose={() => setShowNewEvent(false)} title={selectedDay ? `New Event - ${selectedDay}/${month + 1}/${year}` : "New Event"}>
              <form onSubmit={createEvent} className="space-y-3">
                <Input placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                <Input placeholder="Start" type="datetime-local" value={eventForm.start} onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })} required />
                <Input placeholder="End" type="datetime-local" value={eventForm.end} onChange={(e) => setEventForm({ ...eventForm, end: e.target.value })} />
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Color</label>
                  <input type="color" value={eventForm.color} onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })} className="h-10 w-16 rounded border cursor-pointer" />
                  <Input value={eventForm.color} onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })} className="flex-1" />
                </div>
                <Input placeholder="Attendees (comma separated emails)" value={eventForm.attendees} onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })} />
                <Input placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Event
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewBooking(true)}><Plus className="mr-2 h-4 w-4" /> New Booking Link</Button>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No booking links yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <BentoCard key={b.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{b.title}</h4>
                          {b.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          /{b.slug} · {b.duration} min · {b.totalBookings} bookings
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleBooking(b)}>
                        {b.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewBooking} onClose={() => setShowNewBooking(false)} title="New Booking Link">
              <form onSubmit={createBooking} className="space-y-3">
                <Input placeholder="Slug (e.g. 30min-meeting)" value={bookingForm.slug} onChange={(e) => setBookingForm({ ...bookingForm, slug: e.target.value })} required />
                <Input placeholder="Title" value={bookingForm.title} onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })} required />
                <Input placeholder="Description" value={bookingForm.description} onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })} />
                <Input placeholder="Duration (minutes)" type="number" value={bookingForm.durationMinutes} onChange={(e) => setBookingForm({ ...bookingForm, durationMinutes: Number(e.target.value) })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Availability JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={bookingForm.availability} onChange={(e) => setBookingForm({ ...bookingForm, availability: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Buffer Config JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px] font-mono" value={bookingForm.bufferConfig} onChange={(e) => setBookingForm({ ...bookingForm, bufferConfig: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Booking Link
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "sync" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewSync(true)}><Plus className="mr-2 h-4 w-4" /> Connect Calendar</Button>
            </div>
            {syncs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No calendars connected.</p>
            ) : (
              <div className="space-y-3">
                {syncs.map((s) => (
                  <BentoCard key={s.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold capitalize">{s.provider}</h4>
                          {s.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                        {s.lastSyncedAt && <p className="text-xs text-muted-foreground">Last synced: {new Date(s.lastSyncedAt).toLocaleString()}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleSync(s)}>
                        {s.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewSync} onClose={() => setShowNewSync(false)} title="Connect Calendar">
              <form onSubmit={createSync} className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Provider</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={syncForm.provider} onChange={(e) => setSyncForm({ ...syncForm, provider: e.target.value })}>
                    <option value="google">Google Calendar</option>
                    <option value="outlook">Outlook Calendar</option>
                    <option value="apple">Apple Calendar</option>
                  </select>
                </div>
                <Input placeholder="Access Token" value={syncForm.accessToken} onChange={(e) => setSyncForm({ ...syncForm, accessToken: e.target.value })} required />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Connect
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "availability" && (
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              <p className="text-sm text-muted-foreground">
                Availability is configured per booking link. Go to the Booking Links tab to set up your availability for each link.
              </p>
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No booking links configured yet. Create one to see its availability.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{b.title}</h4>
                        <Badge variant="secondary">{b.duration} min</Badge>
                      </div>
                      {b.availability && (
                        <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto max-w-lg text-muted-foreground">
                          {b.availability.length > 200 ? b.availability.slice(0, 200) + "..." : b.availability}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BentoCard>
        )}
      </div>
    </DashboardShell>
  );
}
