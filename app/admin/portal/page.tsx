"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, HelpCircle, MessageSquare, FolderOpen, Plus, X, Loader2,
  Eye, ThumbsUp, Check, ToggleLeft, ToggleRight, Search,
} from "lucide-react";
import { toast } from "sonner";

interface KnowledgeArticle {
  id: number;
  title: string;
  status: string;
  views: number;
  helpfulPercent?: number;
  bodyHtml?: string;
  categories?: string;
  tags?: string;
}

interface FAQItem {
  id: number;
  question: string;
  category: string;
  published: boolean;
  sortOrder: number;
  bodyHtml?: string;
}

interface ForumTopic {
  id: number;
  title: string;
  author?: { name: string };
  status: string;
  views: number;
  lastActivityAt?: string;
  posts?: ForumPost[];
}

interface ForumPost {
  id: number;
  body: string;
  author?: { name: string };
  createdAt: string;
}

interface Asset {
  id: number;
  name: string;
  type: string;
  contact?: { name: string };
  purchaseDate?: string;
  warrantyEnd?: string;
}

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState("knowledge");
  const [submitting, setSubmitting] = useState(false);

  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [articleForm, setArticleForm] = useState({ title: "", bodyHtml: "", categories: "", tags: "", status: "draft" });
  const [showNewArticle, setShowNewArticle] = useState(false);

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqForm, setFaqForm] = useState({ question: "", bodyHtml: "", category: "", published: true, sortOrder: 0 });
  const [showNewFaq, setShowNewFaq] = useState(false);

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [topicForm, setTopicForm] = useState({ title: "", body: "" });
  const [showNewTopic, setShowNewTopic] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetForm, setAssetForm] = useState({ name: "", type: "document", contactId: "" });
  const [showNewAsset, setShowNewAsset] = useState(false);

  useEffect(() => {
    loadArticles();
    loadFaqs();
    loadTopics();
    loadAssets();
  }, []);

  async function loadArticles() {
    try { const r = await fetch("/api/portal/knowledge"); if (r.ok) setArticles(await r.json()); } catch {}
  }
  async function loadFaqs() {
    try { const r = await fetch("/api/portal/faq"); if (r.ok) setFaqs(await r.json()); } catch {}
  }
  async function loadTopics() {
    try { const r = await fetch("/api/portal/forum"); if (r.ok) setTopics(await r.json()); } catch {}
  }
  async function loadAssets() {
    try { const r = await fetch("/api/portal/assets"); if (r.ok) setAssets(await r.json()); } catch {}
  }

  async function createArticle(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/portal/knowledge", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(articleForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewArticle(false);
      setArticleForm({ title: "", bodyHtml: "", categories: "", tags: "", status: "draft" });
      await loadArticles();
      toast.success("Article created");
    }
  }

  async function createFaq(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/portal/faq", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(faqForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewFaq(false);
      setFaqForm({ question: "", bodyHtml: "", category: "", published: true, sortOrder: 0 });
      await loadFaqs();
      toast.success("FAQ created");
    }
  }

  async function toggleFaq(item: FAQItem) {
    await fetch(`/api/portal/faq?id=${item.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: !item.published }),
    });
    await loadFaqs();
    toast.success(item.published ? "FAQ unpublished" : "FAQ published");
  }

  async function createTopic(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/portal/forum", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(topicForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewTopic(false);
      setTopicForm({ title: "", body: "" });
      await loadTopics();
      toast.success("Topic created");
    }
  }

  async function loadTopicPosts(topicId: number) {
    try {
      const r = await fetch(`/api/portal/forum?posts=1&id=${topicId}`);
      if (r.ok) {
        const data = await r.json();
        setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, posts: data.posts || [] } : t)));
      }
    } catch {}
  }

  function toggleExpandTopic(topicId: number) {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicId);
      loadTopicPosts(topicId);
    }
  }

  async function createAsset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/portal/assets", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...assetForm, contactId: Number(assetForm.contactId) }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewAsset(false);
      setAssetForm({ name: "", type: "document", contactId: "" });
      await loadAssets();
      toast.success("Asset created");
    }
  }

  const tabs = [
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "forum", label: "Community Forum", icon: MessageSquare },
    { id: "assets", label: "Assets", icon: FolderOpen },
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
          <h1 className="text-3xl font-bold">Portal</h1>
          <p className="text-muted-foreground">Knowledge base, FAQ, community, and assets</p>
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

        {activeTab === "knowledge" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewArticle(true)}><Plus className="mr-2 h-4 w-4" /> New Article</Button>
            </div>
            {articles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No articles yet.</p>
            ) : (
              <div className="space-y-3">
                {articles.map((a) => (
                  <BentoCard key={a.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{a.title}</h4>
                          <Badge variant={a.status === "published" ? "success" : "secondary"}>{a.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <Eye className="inline h-3 w-3 mr-1" />{a.views} views
                          {a.helpfulPercent != null && <> · <ThumbsUp className="inline h-3 w-3 mr-1" />{a.helpfulPercent}% helpful</>}
                        </p>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewArticle} onClose={() => setShowNewArticle(false)} title="New Article">
              <form onSubmit={createArticle} className="space-y-3">
                <Input placeholder="Title" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body HTML</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px] font-mono" value={articleForm.bodyHtml} onChange={(e) => setArticleForm({ ...articleForm, bodyHtml: e.target.value })} required />
                </div>
                <Input placeholder="Categories (comma separated)" value={articleForm.categories} onChange={(e) => setArticleForm({ ...articleForm, categories: e.target.value })} />
                <Input placeholder="Tags (comma separated)" value={articleForm.tags} onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Article
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewFaq(true)}><Plus className="mr-2 h-4 w-4" /> New FAQ</Button>
            </div>
            {faqs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No FAQ items yet.</p>
            ) : (
              <div className="space-y-3">
                {faqs.map((f) => (
                  <BentoCard key={f.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{f.question}</h4>
                          <Badge variant="secondary">{f.category}</Badge>
                          {f.published ? <Badge variant="success"><Check className="h-3 w-3 mr-1" />Published</Badge> : <Badge variant="outline">Draft</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">Sort order: {f.sortOrder}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleFaq(f)}>
                        {f.published ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewFaq} onClose={() => setShowNewFaq(false)} title="New FAQ">
              <form onSubmit={createFaq} className="space-y-3">
                <Input placeholder="Question" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Answer HTML</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]" value={faqForm.bodyHtml} onChange={(e) => setFaqForm({ ...faqForm, bodyHtml: e.target.value })} required />
                </div>
                <Input placeholder="Category" value={faqForm.category} onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })} required />
                <Input placeholder="Sort Order" type="number" value={faqForm.sortOrder} onChange={(e) => setFaqForm({ ...faqForm, sortOrder: Number(e.target.value) })} />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Published</label>
                  <button type="button" onClick={() => setFaqForm({ ...faqForm, published: !faqForm.published })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${faqForm.published ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${faqForm.published ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create FAQ
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "forum" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewTopic(true)}><Plus className="mr-2 h-4 w-4" /> New Topic</Button>
            </div>
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topics yet.</p>
            ) : (
              <div className="space-y-3">
                {topics.map((t) => (
                  <BentoCard key={t.id}>
                    <div>
                      <button className="w-full text-left" onClick={() => toggleExpandTopic(t.id)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{t.title}</h4>
                              <Badge variant={t.status === "open" ? "success" : t.status === "closed" ? "secondary" : "default"}>{t.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t.author?.name} · <Eye className="inline h-3 w-3" /> {t.views} views
                              {t.lastActivityAt && ` · ${new Date(t.lastActivityAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      </button>
                      {expandedTopic === t.id && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          {(t.posts || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">Loading posts...</p>
                          ) : (t.posts || []).map((p) => (
                            <div key={p.id} className="p-3 rounded-lg bg-muted/50">
                              <p className="text-xs text-muted-foreground mb-1">{p.author?.name} · {new Date(p.createdAt).toLocaleString()}</p>
                              <p className="text-sm">{p.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewTopic} onClose={() => setShowNewTopic(false)} title="New Topic">
              <form onSubmit={createTopic} className="space-y-3">
                <Input placeholder="Topic Title" value={topicForm.title} onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">First Post</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]" value={topicForm.body} onChange={(e) => setTopicForm({ ...topicForm, body: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Topic
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewAsset(true)}><Plus className="mr-2 h-4 w-4" /> New Asset</Button>
            </div>
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets yet.</p>
            ) : (
              <div className="space-y-3">
                {assets.map((a) => (
                  <BentoCard key={a.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{a.name}</h4>
                          <Badge variant="secondary">{a.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {a.contact?.name && `Contact: ${a.contact.name}`}
                          {a.purchaseDate && ` · Purchased: ${new Date(a.purchaseDate).toLocaleDateString()}`}
                          {a.warrantyEnd && ` · Warranty: ${new Date(a.warrantyEnd).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewAsset} onClose={() => setShowNewAsset(false)} title="New Asset">
              <form onSubmit={createAsset} className="space-y-3">
                <Input placeholder="Asset Name" value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}>
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input placeholder="Contact ID" type="number" value={assetForm.contactId} onChange={(e) => setAssetForm({ ...assetForm, contactId: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Asset
                </Button>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
