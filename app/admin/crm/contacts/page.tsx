"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Building2,
  Globe,
  Calendar,
  Target,
  Ticket,
  MessageSquare,
  PhoneCall,
  Video,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status: string;
  tags?: string[];
  dealScore?: number;
  createdAt: string;
  assignee?: { name: string; email: string } | null;
  deals?: Deal[];
}

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
}

interface Activity {
  id: number;
  type: string;
  subject: string;
  body?: string;
  createdAt: string;
  user?: { name: string };
  deal?: { title: string };
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
}

interface TimelineEvent {
  id: string;
  type: "activity" | "ticket" | "call" | "meeting" | "message";
  title: string;
  description?: string;
  date: string;
  icon: typeof Phone;
  color: string;
}

export default function ContactDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contactId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!contactId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/crm/contacts/${contactId}`);
        if (res.ok) {
          const data = await res.json();
          setContact(data.contact);
          setActivities(data.activities || []);
          setTickets(data.tickets || []);

          const events: TimelineEvent[] = [];

          (data.activities || []).forEach((a: any) => {
            const icons: Record<string, typeof Phone> = {
              call: PhoneCall,
              email: Mail,
              meeting: Video,
              task: Calendar,
              note: MessageSquare,
              "deal-status-change": Target,
            };
            const colors: Record<string, string> = {
              call: "bg-blue-500",
              email: "bg-green-500",
              meeting: "bg-purple-500",
              task: "bg-amber-500",
              note: "bg-gray-500",
              "deal-status-change": "bg-emerald-500",
            };
            events.push({
              id: `act-${a.id}`,
              type: "activity",
              title: a.subject,
              description: a.body,
              date: a.createdAt,
              icon: icons[a.type] || MessageSquare,
              color: colors[a.type] || "bg-gray-500",
            });
          });

          (data.tickets || []).forEach((t: any) => {
            events.push({
              id: `ticket-${t.id}`,
              type: "ticket",
              title: `Ticket: ${t.subject}`,
              description: `Status: ${t.status} | Priority: ${t.priority}`,
              date: t.createdAt,
              icon: Ticket,
              color: "bg-red-500",
            });
          });

          events.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTimeline(events);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [contactId]);

  if (!contactId) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Select a Contact</h2>
          <p className="text-sm text-muted-foreground">
            Click on a contact in the CRM list to view details
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/crm")}
          >
            Back to CRM
          </Button>
        </div>
      </DashboardShell>
    );
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (!contact) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-lg font-semibold">Contact not found</h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/crm")}
          >
            Back to CRM
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/admin/crm")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to CRM
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {contact.firstName} {contact.lastName}
              </h1>
              <Badge
                variant={
                  contact.status === "active"
                    ? "success"
                    : contact.status === "lead"
                    ? "warning"
                    : "secondary"
                }
              >
                {contact.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{contact.title || "No title"}</p>
          </div>
        </div>

        <BentoGrid>
          <BentoCard>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Contact Info
              </h3>
              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contact.email}`} className="hover:underline">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
              )}
              {contact.assignee && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to: {contact.assignee.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Created {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Deals ({contact.deals?.length || 0})
              </h3>
              {(contact.deals || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No deals</p>
              ) : (
                (contact.deals || []).slice(0, 5).map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        ${deal.value.toLocaleString()} - {deal.stage}
                      </p>
                    </div>
                    <Badge variant="default">{deal.probability}%</Badge>
                  </div>
                ))
              )}
            </div>
          </BentoCard>

          <BentoCard>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Support Tickets ({tickets.length})
              </h3>
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tickets</p>
              ) : (
                tickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <p className="text-sm font-medium truncate">
                      {ticket.subject}
                    </p>
                    <Badge
                      variant={
                        ticket.priority === "urgent" || ticket.priority === "high"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </BentoCard>
        </BentoGrid>

        <div>
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet</p>
          ) : (
            <div className="space-y-0">
              {timeline.map((event, i) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex gap-4 pb-6 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-8 w-8 rounded-full ${event.color} flex items-center justify-center`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
