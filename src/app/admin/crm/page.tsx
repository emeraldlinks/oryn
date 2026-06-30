"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import {
  Users,
  Target,
  TrendingUp,
  Activity,
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  assignedTo?: number;
  lastContactedAt?: string;
}

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
}

const contactColumns: Column<Contact>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (c) => `${c.firstName} ${c.lastName}`,
  },
  { key: "email", label: "Email", render: (c) => c.email || "-" },
  { key: "company", label: "Company", sortable: true, render: (c) => c.company || "-" },
  { key: "phone", label: "Phone", render: (c) => c.phone || "-" },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (c) => (
      <Badge
        variant={
          c.status === "active"
            ? "success"
            : c.status === "lead"
            ? "warning"
            : c.status === "qualified"
            ? "default"
            : "secondary"
        }
      >
        {c.status}
      </Badge>
    ),
  },
  {
    key: "lastContactedAt",
    label: "Last Contacted",
    render: (c) =>
      c.lastContactedAt ? new Date(c.lastContactedAt).toLocaleDateString() : "-",
  },
];

const dealColumns: Column<Deal>[] = [
  { key: "title", label: "Deal", sortable: true },
  {
    key: "value",
    label: "Value",
    sortable: true,
    render: (d) => `$${d.value.toLocaleString()}`,
  },
  {
    key: "stage",
    label: "Stage",
    sortable: true,
    render: (d) => (
      <Badge
        variant={
          d.stage === "closed-won"
            ? "success"
            : d.stage === "closed-lost"
            ? "destructive"
            : d.stage === "negotiation"
            ? "warning"
            : "default"
        }
      >
        {d.stage}
      </Badge>
    ),
  },
  { key: "probability", label: "Probability", render: (d) => `${d.probability}%` },
];

export default function CRMPage() {
  const {
    data: contacts,
    loading: contactsLoading,
    insert: insertContact,
  } = useApi<Contact>("/api/crm/contacts");

  const {
    data: deals,
    loading: dealsLoading,
    insert: insertDeal,
  } = useApi<Deal>("/api/crm/deals");

  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });
  const [dealForm, setDealForm] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "lead",
    probability: "10",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await insertContact(contactForm);
    setSubmitting(false);
    if (result) {
      setShowContactModal(false);
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
      });
    }
  }

  async function handleAddDeal(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await insertDeal({
      title: dealForm.title,
      value: Number(dealForm.value),
      contactId: dealForm.contactId ? Number(dealForm.contactId) : undefined,
      probability: Number(dealForm.probability),
      stage: dealForm.stage,
      currency: "USD",
    });
    setSubmitting(false);
    if (result) {
      setShowDealModal(false);
      setDealForm({
        title: "",
        contactId: "",
        value: "",
        stage: "lead",
        probability: "10",
      });
    }
  }

  const activeDeals = deals.filter(
    (d) => d.stage !== "closed-lost" && d.stage !== "closed-won"
  );
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  function Modal({
    open,
    onClose,
    title,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
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
          <h1 className="text-3xl font-bold">CRM</h1>
          <p className="text-muted-foreground">Manage contacts, deals, and pipeline</p>
        </div>

        <BentoGrid>
          <StatCard
            title="Total Contacts"
            value={contacts.length}
            icon={Users}
          />
          <StatCard title="Active Deals" value={activeDeals.length} icon={Target} />
          <StatCard
            title="Pipeline Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={TrendingUp}
          />
          <StatCard title="Win Rate" value="23%" icon={Activity} />
        </BentoGrid>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button onClick={() => setShowContactModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
          <DataTable
            columns={contactColumns}
            data={contacts}
            loading={contactsLoading}
            searchKeys={["firstName", "lastName", "email", "company"]}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Deals</h2>
            <Button onClick={() => setShowDealModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Deal
            </Button>
          </div>
          <DataTable
            columns={dealColumns}
            data={deals}
            loading={dealsLoading}
            searchKeys={["title"]}
          />
        </div>

        <Modal
          open={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Add Contact"
        >
          <form onSubmit={handleAddContact} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="First Name"
                value={contactForm.firstName}
                onChange={(e) =>
                  setContactForm({ ...contactForm, firstName: e.target.value })
                }
                required
              />
              <Input
                placeholder="Last Name"
                value={contactForm.lastName}
                onChange={(e) =>
                  setContactForm({ ...contactForm, lastName: e.target.value })
                }
                required
              />
            </div>
            <Input
              placeholder="Email"
              type="email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={contactForm.phone}
              onChange={(e) =>
                setContactForm({ ...contactForm, phone: e.target.value })
              }
            />
            <Input
              placeholder="Company"
              value={contactForm.company}
              onChange={(e) =>
                setContactForm({ ...contactForm, company: e.target.value })
              }
            />
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={contactForm.status}
              onChange={(e) =>
                setContactForm({ ...contactForm, status: e.target.value })
              }
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="qualified">Qualified</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Contact
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showDealModal}
          onClose={() => setShowDealModal(false)}
          title="Add Deal"
        >
          <form onSubmit={handleAddDeal} className="space-y-3">
            <Input
              placeholder="Deal Title"
              value={dealForm.title}
              onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Value"
                type="number"
                value={dealForm.value}
                onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                required
              />
              <Input
                placeholder="Contact ID (optional)"
                type="number"
                value={dealForm.contactId}
                onChange={(e) =>
                  setDealForm({ ...dealForm, contactId: e.target.value })
                }
              />
            </div>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={dealForm.stage}
              onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
            >
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Probability: {dealForm.probability}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={dealForm.probability}
                onChange={(e) =>
                  setDealForm({ ...dealForm, probability: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Deal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDealModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
