"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Smartphone, Globe, History, Plus, X, Loader2, Copy,
  ToggleLeft, ToggleRight, Trash2, Check, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface TwoFAStatus {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

interface Device {
  id: number;
  name: string;
  type: string;
  ip: string;
  lastUsedAt?: string;
  trusted: boolean;
}

interface IpAllowlistEntry {
  id: number;
  address: string;
  description?: string;
  active: boolean;
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("2fa");
  const [submitting, setSubmitting] = useState(false);

  const [twoFA, setTwoFA] = useState<TwoFAStatus>({ enabled: false });
  const [verifyToken, setVerifyToken] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const [devices, setDevices] = useState<Device[]>([]);

  const [ipEntries, setIpEntries] = useState<IpAllowlistEntry[]>([]);
  const [ipForm, setIpForm] = useState({ address: "", description: "" });
  const [showNewIp, setShowNewIp] = useState(false);

  useEffect(() => {
    load2FA();
    loadDevices();
    loadIpAllowlist();
  }, []);

  async function load2FA() {
    try {
      const r = await fetch("/api/security/2fa");
      if (r.ok) {
        const data = await r.json();
        if (typeof data === "object" && data !== null) setTwoFA(data);
        else setTwoFA({ enabled: Boolean(data) });
      }
    } catch {}
  }

  async function loadDevices() { try { const r = await fetch("/api/security/devices"); if (r.ok) setDevices(await r.json()); } catch {} }
  async function loadIpAllowlist() { try { const r = await fetch("/api/security/ip-allowlist"); if (r.ok) setIpEntries(await r.json()); } catch {} }

  async function enable2FA() {
    setSubmitting(true);
    const r = await fetch("/api/security/2fa", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "enable" }),
    });
    setSubmitting(false);
    if (r.ok) {
      const data = await r.json();
      setTwoFA(data);
      setShowSecret(true);
      toast.success("2FA setup initiated");
    } else toast.error("Failed to enable 2FA");
  }

  async function verify2FA() {
    if (!verifyToken) return;
    setSubmitting(true);
    const r = await fetch("/api/security/2fa", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", token: verifyToken }),
    });
    setSubmitting(false);
    if (r.ok) {
      setTwoFA({ enabled: true });
      setShowSecret(false);
      setVerifyToken("");
      toast.success("2FA enabled successfully");
    } else toast.error("Invalid token");
  }

  async function disable2FA() {
    setSubmitting(true);
    const r = await fetch("/api/security/2fa", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "disable" }),
    });
    setSubmitting(false);
    if (r.ok) {
      setTwoFA({ enabled: false, secret: undefined, backupCodes: undefined });
      setShowSecret(false);
      toast.success("2FA disabled");
    } else toast.error("Failed to disable 2FA");
  }

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  }

  async function removeDevice(id: number) {
    await fetch(`/api/security/devices?id=${id}`, { method: "DELETE" });
    await loadDevices();
    toast.success("Device removed");
  }

  async function toggleDeviceTrust(device: Device) {
    await fetch(`/api/security/devices?id=${device.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...device, trusted: !device.trusted }),
    });
    await loadDevices();
    toast.success(device.trusted ? "Trust removed" : "Device trusted");
  }

  async function createIpEntry(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/security/ip-allowlist", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ipForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewIp(false);
      setIpForm({ address: "", description: "" });
      await loadIpAllowlist();
      toast.success("IP added to allowlist");
    }
  }

  async function toggleIpEntry(entry: IpAllowlistEntry) {
    await fetch(`/api/security/ip-allowlist?id=${entry.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, active: !entry.active }),
    });
    await loadIpAllowlist();
    toast.success(entry.active ? "Entry deactivated" : "Entry activated");
  }

  async function removeIpEntry(id: number) {
    await fetch(`/api/security/ip-allowlist?id=${id}`, { method: "DELETE" });
    await loadIpAllowlist();
    toast.success("IP entry removed");
  }

  const tabs = [
    { id: "2fa", label: "Two-Factor Auth", icon: Shield },
    { id: "devices", label: "Devices", icon: Smartphone },
    { id: "ip-allowlist", label: "IP Allowlist", icon: Globe },
    { id: "sessions", label: "Session History", icon: History },
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
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground">Two-factor authentication, devices, and access control</p>
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

        {activeTab === "2fa" && (
          <BentoCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <Badge variant={twoFA.enabled ? "success" : "secondary"}>
                  {twoFA.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              {!twoFA.enabled && !showSecret && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enhance your account security by enabling two-factor authentication.
                  </p>
                  <Button onClick={enable2FA} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Shield className="mr-2 h-4 w-4" /> Enable 2FA
                  </Button>
                </div>
              )}

              {showSecret && twoFA.secret && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">One-Time Setup — Save These</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Secret Key</label>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-background px-2 py-1 rounded border font-mono break-all">
                            {twoFA.secret}
                          </code>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(twoFA.secret!)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {twoFA.backupCodes && twoFA.backupCodes.length > 0 && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Backup Codes</label>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            {twoFA.backupCodes.map((code, i) => (
                              <code key={i} className="text-xs bg-background px-2 py-1 rounded border font-mono">
                                {code}
                              </code>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="mt-1" onClick={() => copyToClipboard(twoFA.backupCodes!.join("\n"))}>
                            <Copy className="h-3 w-3 mr-1" /> Copy All
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Verify Token</label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter 6-digit code" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
                      <Button onClick={verify2FA} disabled={submitting || !verifyToken}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Check className="mr-2 h-4 w-4" /> Verify
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {twoFA.enabled && (
                <Button variant="destructive" onClick={disable2FA} disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disable 2FA
                </Button>
              )}
            </div>
          </BentoCard>
        )}

        {activeTab === "devices" && (
          <div className="space-y-4">
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No devices found.</p>
            ) : (
              <div className="space-y-3">
                {devices.map((d) => (
                  <BentoCard key={d.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{d.name}</h4>
                          <Badge variant="secondary">{d.type}</Badge>
                          {d.trusted ? <Badge variant="success">Trusted</Badge> : <Badge variant="outline">Untrusted</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          IP: {d.ip}
                          {d.lastUsedAt && ` · Last used: ${new Date(d.lastUsedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleDeviceTrust(d)}>
                          {d.trusted ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeDevice(d.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "ip-allowlist" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewIp(true)}><Plus className="mr-2 h-4 w-4" /> Add IP</Button>
            </div>
            {ipEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No IP entries in allowlist.</p>
            ) : (
              <div className="space-y-3">
                {ipEntries.map((e) => (
                  <BentoCard key={e.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold font-mono">{e.address}</h4>
                          {e.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        {e.description && <p className="text-xs text-muted-foreground">{e.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleIpEntry(e)}>
                          {e.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeIpEntry(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewIp} onClose={() => setShowNewIp(false)} title="Add IP to Allowlist">
              <form onSubmit={createIpEntry} className="space-y-3">
                <Input placeholder="IP Address (e.g. 192.168.1.1)" value={ipForm.address} onChange={(e) => setIpForm({ ...ipForm, address: e.target.value })} required />
                <Input placeholder="Description (e.g. Office VPN)" value={ipForm.description} onChange={(e) => setIpForm({ ...ipForm, description: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add IP
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "sessions" && (
          <BentoCard>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Session History</h3>
              <p className="text-sm text-muted-foreground">
                Recent login activity is tracked from user sessions. Session information including last login time,
                IP address, and device information is stored in the user profile.
              </p>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm">
                  <History className="inline h-4 w-4 mr-2 text-muted-foreground" />
                  Last login and session information is available on each user's profile page.
                  Go to <a href="/admin/employees" className="text-primary hover:underline">Employees</a> to view individual user sessions.
                </p>
              </div>
            </div>
          </BentoCard>
        )}
      </div>
    </DashboardShell>
  );
}
