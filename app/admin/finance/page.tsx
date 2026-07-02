"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, Banknote, Percent, RotateCcw, Repeat, Plus, X, Loader2,
  Check, XCircle, ToggleLeft, ToggleRight, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  user?: { name: string };
  receiptUrl?: string;
}

interface PaymentGateway {
  id: number;
  provider: string;
  active: boolean;
  isDefault: boolean;
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
}

interface TaxRate {
  id: number;
  name: string;
  rate: number;
  region: string;
  active: boolean;
}

interface Refund {
  id: number;
  invoiceId: number;
  invoice?: { number: string };
  amount: number;
  reason: string;
  status: string;
  processedAt?: string;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [submitting, setSubmitting] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: 0, category: "office", date: "", userId: "" });
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState({ category: "", startDate: "", endDate: "" });

  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [gatewayForm, setGatewayForm] = useState({ provider: "stripe", apiKey: "", apiSecret: "", webhookSecret: "", isDefault: false });
  const [showNewGateway, setShowNewGateway] = useState(false);

  const [taxes, setTaxes] = useState<TaxRate[]>([]);
  const [taxForm, setTaxForm] = useState({ name: "", rate: 0, region: "", active: true });
  const [showNewTax, setShowNewTax] = useState(false);

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [refundForm, setRefundForm] = useState({ invoiceId: "", amount: 0, reason: "" });
  const [showNewRefund, setShowNewRefund] = useState(false);

  useEffect(() => {
    loadExpenses();
    loadGateways();
    loadTaxes();
    loadRefunds();
  }, []);

  async function loadExpenses() {
    try {
      const params = new URLSearchParams();
      if (expenseFilter.category) params.set("category", expenseFilter.category);
      if (expenseFilter.startDate) params.set("startDate", expenseFilter.startDate);
      if (expenseFilter.endDate) params.set("endDate", expenseFilter.endDate);
      const r = await fetch(`/api/finance/expenses?${params}`); if (r.ok) setExpenses(await r.json());
    } catch {}
  }
  async function loadGateways() { try { const r = await fetch("/api/finance/gateways"); if (r.ok) setGateways(await r.json()); } catch {} }
  async function loadTaxes() { try { const r = await fetch("/api/finance/taxes"); if (r.ok) setTaxes(await r.json()); } catch {} }
  async function loadRefunds() { try { const r = await fetch("/api/finance/refunds"); if (r.ok) setRefunds(await r.json()); } catch {} }

  async function createExpense(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/finance/expenses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...expenseForm, amount: Number(expenseForm.amount), userId: Number(expenseForm.userId) || undefined }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewExpense(false);
      setExpenseForm({ description: "", amount: 0, category: "office", date: "", userId: "" });
      await loadExpenses();
      toast.success("Expense created");
    }
  }

  async function createGateway(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/finance/gateways", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(gatewayForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewGateway(false);
      setGatewayForm({ provider: "stripe", apiKey: "", apiSecret: "", webhookSecret: "", isDefault: false });
      await loadGateways();
      toast.success("Gateway added");
    }
  }

  async function toggleGateway(g: PaymentGateway) {
    await fetch(`/api/finance/gateways?id=${g.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...g, active: !g.active }),
    });
    await loadGateways();
    toast.success(g.active ? "Gateway deactivated" : "Gateway activated");
  }

  async function createTax(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/finance/taxes", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taxForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewTax(false);
      setTaxForm({ name: "", rate: 0, region: "", active: true });
      await loadTaxes();
      toast.success("Tax rate created");
    }
  }

  async function toggleTax(t: TaxRate) {
    await fetch(`/api/finance/taxes?id=${t.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, active: !t.active }),
    });
    await loadTaxes();
    toast.success(t.active ? "Tax deactivated" : "Tax activated");
  }

  async function createRefund(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/finance/refunds", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...refundForm, invoiceId: Number(refundForm.invoiceId), amount: Number(refundForm.amount) }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewRefund(false);
      setRefundForm({ invoiceId: "", amount: 0, reason: "" });
      await loadRefunds();
      toast.success("Refund requested");
    }
  }

  async function processRefund(id: number, status: string) {
    const r = await fetch(`/api/finance/refunds?id=${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) {
      await loadRefunds();
      toast.success(`Refund ${status}`);
    }
  }

  const tabs = [
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "gateways", label: "Payment Gateways", icon: Banknote },
    { id: "taxes", label: "Tax Rates", icon: Percent },
    { id: "refunds", label: "Refunds", icon: RotateCcw },
    { id: "subscriptions", label: "Subscriptions", icon: Repeat },
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

  const providers: Record<string, any> = {
    stripe: Banknote, paypal: Banknote, square: Banknote, mollie: Banknote,
  };

  function getProviderIcon(provider: string) {
    const Icon = providers[provider] || Banknote;
    return <Icon className="h-5 w-5" />;
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Expenses, gateways, tax rates, and refunds</p>
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

        {activeTab === "expenses" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-end">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={expenseFilter.category} onChange={(e) => setExpenseFilter({ ...expenseFilter, category: e.target.value })}>
                  <option value="">All</option>
                  <option value="office">Office</option>
                  <option value="travel">Travel</option>
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">From</label>
                <Input type="date" value={expenseFilter.startDate} onChange={(e) => setExpenseFilter({ ...expenseFilter, startDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To</label>
                <Input type="date" value={expenseFilter.endDate} onChange={(e) => setExpenseFilter({ ...expenseFilter, endDate: e.target.value })} />
              </div>
              <Button onClick={loadExpenses}>Filter</Button>
              <div className="flex-1 text-right">
                <Button onClick={() => setShowNewExpense(true)}><Plus className="mr-2 h-4 w-4" /> New Expense</Button>
              </div>
            </div>
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses found.</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((e) => (
                  <BentoCard key={e.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{e.description}</h4>
                          <Badge variant="secondary">{e.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {e.user?.name && `${e.user.name} · `}
                          {new Date(e.date).toLocaleDateString()}
                          {e.receiptUrl && <><span className="mx-1">·</span><a href={e.receiptUrl} target="_blank" className="text-primary inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" />Receipt</a></>}
                        </p>
                      </div>
                      <p className="text-lg font-bold">${e.amount.toFixed(2)}</p>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewExpense} onClose={() => setShowNewExpense(false)} title="New Expense">
              <form onSubmit={createExpense} className="space-y-3">
                <Input placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} required />
                <Input placeholder="Amount" type="number" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                    <option value="office">Office</option>
                    <option value="travel">Travel</option>
                    <option value="software">Software</option>
                    <option value="hardware">Hardware</option>
                    <option value="food">Food</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input placeholder="Date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required />
                <Input placeholder="User ID" type="number" value={expenseForm.userId} onChange={(e) => setExpenseForm({ ...expenseForm, userId: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Expense
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "gateways" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewGateway(true)}><Plus className="mr-2 h-4 w-4" /> New Gateway</Button>
            </div>
            {gateways.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment gateways yet.</p>
            ) : (
              <div className="space-y-3">
                {gateways.map((g) => (
                  <BentoCard key={g.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getProviderIcon(g.provider)}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold capitalize">{g.provider}</h4>
                            {g.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                            {g.isDefault && <Badge variant="default">Default</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">API Key: {g.apiKey.slice(0, 8)}...{g.apiKey.slice(-4)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleGateway(g)}>
                        {g.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewGateway} onClose={() => setShowNewGateway(false)} title="New Payment Gateway">
              <form onSubmit={createGateway} className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Provider</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={gatewayForm.provider} onChange={(e) => setGatewayForm({ ...gatewayForm, provider: e.target.value })}>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="square">Square</option>
                    <option value="mollie">Mollie</option>
                  </select>
                </div>
                <Input placeholder="API Key" value={gatewayForm.apiKey} onChange={(e) => setGatewayForm({ ...gatewayForm, apiKey: e.target.value })} required />
                <Input placeholder="API Secret" type="password" value={gatewayForm.apiSecret} onChange={(e) => setGatewayForm({ ...gatewayForm, apiSecret: e.target.value })} />
                <Input placeholder="Webhook Secret" type="password" value={gatewayForm.webhookSecret} onChange={(e) => setGatewayForm({ ...gatewayForm, webhookSecret: e.target.value })} />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Set as Default</label>
                  <button type="button" onClick={() => setGatewayForm({ ...gatewayForm, isDefault: !gatewayForm.isDefault })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${gatewayForm.isDefault ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${gatewayForm.isDefault ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Gateway
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "taxes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewTax(true)}><Plus className="mr-2 h-4 w-4" /> New Tax Rate</Button>
            </div>
            {taxes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tax rates yet.</p>
            ) : (
              <div className="space-y-3">
                {taxes.map((t) => (
                  <BentoCard key={t.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{t.name}</h4>
                          <Badge variant="default">{t.rate}%</Badge>
                          <Badge variant="secondary">{t.region}</Badge>
                          {t.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleTax(t)}>
                        {t.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewTax} onClose={() => setShowNewTax(false)} title="New Tax Rate">
              <form onSubmit={createTax} className="space-y-3">
                <Input placeholder="Tax Name (e.g. VAT 20%)" value={taxForm.name} onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })} required />
                <Input placeholder="Rate %" type="number" step="0.01" value={taxForm.rate} onChange={(e) => setTaxForm({ ...taxForm, rate: Number(e.target.value) })} required />
                <Input placeholder="Region (e.g. EU, US-NY)" value={taxForm.region} onChange={(e) => setTaxForm({ ...taxForm, region: e.target.value })} required />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <button type="button" onClick={() => setTaxForm({ ...taxForm, active: !taxForm.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${taxForm.active ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${taxForm.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Tax Rate
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "refunds" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewRefund(true)}><Plus className="mr-2 h-4 w-4" /> New Refund</Button>
            </div>
            {refunds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No refunds yet.</p>
            ) : (
              <div className="space-y-3">
                {refunds.map((r) => (
                  <BentoCard key={r.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Invoice #{r.invoice?.number || r.invoiceId}</h4>
                          <Badge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "destructive" : "warning"}>{r.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.processedAt && `Processed: ${new Date(r.processedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="text-lg font-bold">${r.amount.toFixed(2)}</p>
                        {r.status === "pending" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => processRefund(r.id, "approved")}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => processRefund(r.id, "rejected")}>
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewRefund} onClose={() => setShowNewRefund(false)} title="New Refund">
              <form onSubmit={createRefund} className="space-y-3">
                <Input placeholder="Invoice ID" type="number" value={refundForm.invoiceId} onChange={(e) => setRefundForm({ ...refundForm, invoiceId: e.target.value })} required />
                <Input placeholder="Amount" type="number" step="0.01" value={refundForm.amount} onChange={(e) => setRefundForm({ ...refundForm, amount: Number(e.target.value) })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Reason</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={refundForm.reason} onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Request Refund
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <BentoCard>
            <div className="text-center py-6">
              <Repeat className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage subscriptions in the Sales module.
              </p>
              <a href="/admin/sales" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> Go to Sales → Subscriptions
              </a>
            </div>
          </BentoCard>
        )}
      </div>
    </DashboardShell>
  );
}
