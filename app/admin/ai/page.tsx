"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Send, Bot, Key, Plus, Trash2, Loader2, Check, X, Eye, EyeOff, Play, History,
} from "lucide-react";

const PROVIDERS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gemini", label: "Gemini" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "claude", label: "Claude" },
  { value: "qwen", label: "Qwen" },
  { value: "kimi", label: "Kimi" },
  { value: "nvidia", label: "NVIDIA" },
  { value: "opencode", label: "OpenCode" },
];

const PROVIDER_ICONS: Record<string, string> = {
  "gpt-4": "GPT-4",
  "gemini": "Gemini",
  "deepseek": "DeepSeek",
  "claude": "Claude",
  "qwen": "Qwen",
  "kimi": "Kimi",
  "nvidia": "NVIDIA",
  "opencode": "OpenCode",
};

const ICON_COLORS: Record<string, string> = {
  "gpt-4": "bg-green-100 text-green-700",
  "gemini": "bg-blue-100 text-blue-700",
  "deepseek": "bg-purple-100 text-purple-700",
  "claude": "bg-orange-100 text-orange-700",
  "qwen": "bg-red-100 text-red-700",
  "kimi": "bg-pink-100 text-pink-700",
  "nvidia": "bg-emerald-100 text-emerald-700",
  "opencode": "bg-slate-100 text-slate-700",
};

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  detectedAction?: { action: string; params: Record<string, unknown> } | null;
  actionResult?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  provider: string;
  createdAt: string;
}

interface ApiKey {
  id: number;
  provider: string;
  key_masked: string;
  scope: "user" | "workspace";
  is_active: boolean;
  last_used: string | null;
  created_at: string;
}

export default function AiPage() {
  const [activeTab, setActiveTab] = useState("assistant");
  const [provider, setProvider] = useState("gpt-4");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "New Conversation",
      messages: [
        { role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?", provider: "gpt-4" },
      ],
      provider: "gpt-4",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeConvId, setActiveConvId] = useState("conv-1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyProvider, setNewKeyProvider] = useState("gpt-4");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyScope, setNewKeyScope] = useState<"user" | "workspace">("user");
  const [showNewKey, setShowNewKey] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  useEffect(() => {
    if (activeTab === "keys") loadApiKeys();
  }, [activeTab]);

  function createNewConversation() {
    const id = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id,
      title: "New Conversation",
      messages: [
        { role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?", provider },
      ],
      provider,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(id);
  }

  function generateTitle(content: string): string {
    return content.length > 40 ? content.slice(0, 40) + "..." : content;
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.title === "New Conversation" ? generateTitle(input.trim()) : c.title,
            }
          : c
      )
    );
    setInput("");
    setLoading(true);

    try {
      const conv = conversations.find((c) => c.id === activeConvId);
      const allMsgs = [...(conv?.messages || []), userMsg];
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          messages: allMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.content || data.message || data.response || "",
        provider: data.provider || provider,
        detectedAction: data.detectedAction || null,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch {
      toast.error("Failed to get AI response");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant", content: "Sorry, I encountered an error. Please try again.", provider },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function executeAction(msgIndex: number) {
    const msg = activeConv?.messages[msgIndex];
    if (!msg?.detectedAction) return;
    const key = `${activeConvId}-${msgIndex}`;
    setExecutingAction(key);
    try {
      const res = await fetch("/api/ai/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.detectedAction),
      });
      if (!res.ok) throw new Error("Action failed");
      const result = await res.json();
      const resultStr = typeof result === "string" ? result : JSON.stringify(result, null, 2);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                messages: c.messages.map((m, i) =>
                  i === msgIndex ? { ...m, actionResult: resultStr } : m
                ),
              }
            : c
        )
      );
      toast.success("Action executed successfully");
    } catch {
      toast.error("Failed to execute action");
    } finally {
      setExecutingAction(null);
    }
  }

  async function loadApiKeys() {
    setKeysLoading(true);
    try {
      const res = await fetch("/api/ai-keys");
      if (res.ok) setApiKeys(await res.json());
    } catch {} finally {
      setKeysLoading(false);
    }
  }

  async function addApiKey() {
    if (!newKeyValue.trim()) return;
    try {
      const res = await fetch("/api/ai-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: newKeyProvider,
          key: newKeyValue,
          scope: newKeyScope,
        }),
      });
      if (res.ok) {
        toast.success("API key added");
        setShowAddModal(false);
        setNewKeyValue("");
        setNewKeyProvider("gpt-4");
        setNewKeyScope("user");
        setShowNewKey(false);
        loadApiKeys();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add key");
      }
    } catch {
      toast.error("Failed to add API key");
    }
  }

  async function deleteApiKey(id: number) {
    try {
      const res = await fetch(`/api/ai-keys?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("API key deleted");
        loadApiKeys();
      }
    } catch {
      toast.error("Failed to delete API key");
    }
  }

  async function toggleApiKey(id: number, currentActive: boolean) {
    try {
      const res = await fetch("/api/ai-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentActive }),
      });
      if (res.ok) {
        toast.success(`API key ${currentActive ? "deactivated" : "activated"}`);
        loadApiKeys();
      }
    } catch {
      toast.error("Failed to update API key");
    }
  }

  const tabs = [
    { id: "assistant", label: "AI Assistant", icon: Bot },
    { id: "keys", label: "API Keys", icon: Key },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">AI-powered assistant and API key management</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "assistant" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
            <div className="lg:col-span-1 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Conversations
                </h3>
                <Button size="sm" variant="ghost" onClick={createNewConversation}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-y-auto flex-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 border-b hover:bg-muted/30 transition-colors ${
                      activeConvId === conv.id ? "bg-muted/50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 border rounded-lg flex flex-col">
              <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="flex h-8 rounded-lg border border-input bg-background px-2 py-1 text-xs"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <Button size="sm" variant="outline" onClick={createNewConversation}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConv?.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] space-y-2`}>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.role === "assistant" && msg.provider && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded ${ICON_COLORS[msg.provider] || "bg-muted text-muted-foreground"}`}>
                              {PROVIDER_ICONS[msg.provider] || msg.provider}
                            </span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === "assistant" && msg.detectedAction && (
                        <div className="flex items-center gap-2 pl-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => executeAction(i)}
                            disabled={executingAction === `${activeConvId}-${i}`}
                          >
                            {executingAction === `${activeConvId}-${i}` ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            Execute
                          </Button>
                          <span className="text-[10px] text-muted-foreground">
                            Action: {msg.detectedAction.action}
                          </span>
                        </div>
                      )}
                      {msg.actionResult && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 ml-1">
                          <div className="flex items-center gap-1 mb-1">
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-600">Result</span>
                          </div>
                          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{msg.actionResult}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={loading}
                  />
                  <Button onClick={sendMessage} disabled={!input.trim() || loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keys" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium">API Keys</h3>
              <p className="text-sm text-muted-foreground">Manage AI provider API keys.</p>
            </div>
            <div className="lg:col-span-2">
              <BentoCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {apiKeys.length} key{apiKeys.length !== 1 ? "s" : ""} configured
                    </p>
                    <Button size="sm" onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Key
                    </Button>
                  </div>
                  {keysLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No API keys configured. Add your first key to get started.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 pr-4 font-medium">Provider</th>
                            <th className="text-left py-2 px-2 font-medium">API Key</th>
                            <th className="text-center py-2 px-2 font-medium">Scope</th>
                            <th className="text-center py-2 px-2 font-medium">Active</th>
                            <th className="text-left py-2 px-2 font-medium">Last Used</th>
                            <th className="text-right py-2 pl-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiKeys.map((key) => (
                            <tr key={key.id} className="border-b last:border-0">
                              <td className="py-3 pr-4">
                                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${ICON_COLORS[key.provider] || "bg-muted text-muted-foreground"}`}>
                                  {PROVIDER_ICONS[key.provider] || key.provider}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <code className="text-xs bg-muted px-2 py-0.5 rounded">{key.key_masked}</code>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <Badge variant={key.scope === "workspace" ? "default" : "secondary"}>
                                  {key.scope === "workspace" ? "Workspace" : "User"}
                                </Badge>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <button
                                  onClick={() => toggleApiKey(key.id, key.is_active)}
                                  className={`relative w-9 h-5 rounded-full transition-colors ${
                                    key.is_active ? "bg-primary" : "bg-muted"
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                      key.is_active ? "translate-x-4" : ""
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="py-3 px-2 text-xs text-muted-foreground">
                                {key.last_used
                                  ? new Date(key.last_used).toLocaleDateString()
                                  : "Never"}
                              </td>
                              <td className="py-3 pl-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => deleteApiKey(key.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add API Key</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Provider</label>
                <select
                  value={newKeyProvider}
                  onChange={(e) => setNewKeyProvider(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">API Key</label>
                <div className="relative">
                  <Input
                    type={showNewKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewKey(!showNewKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Scope</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="user"
                      checked={newKeyScope === "user"}
                      onChange={() => setNewKeyScope("user")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">My Keys</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="workspace"
                      checked={newKeyScope === "workspace"}
                      onChange={() => setNewKeyScope("workspace")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Workspace Keys</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={addApiKey} disabled={!newKeyValue.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
