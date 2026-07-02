"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, FileText, Layout, Plus, X, Loader2, Search, Users,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  bodyHtml: string;
  user?: { name: string; avatar?: string };
  mentions?: string;
  createdAt: string;
  replies?: Comment[];
}

interface SharedNote {
  id: number;
  title: string;
  creator?: { name: string };
  sharedWith?: string;
  bodyHtml?: string;
  createdAt: string;
}

interface Whiteboard {
  id: number;
  name: string;
  participantCount?: number;
  data?: string;
  createdAt: string;
}

const entityTypes = ["ticket", "deal", "contact", "invoice", "order"];

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState("comments");
  const [submitting, setSubmitting] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentSearch, setCommentSearch] = useState({ entityType: "ticket", entityId: "" });
  const [commentForm, setCommentForm] = useState({ entityType: "ticket", entityId: "", bodyHtml: "", mentions: "" });
  const [showNewComment, setShowNewComment] = useState(false);

  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const [noteForm, setNoteForm] = useState({ title: "", bodyHtml: "", sharedWith: "" });
  const [showNewNote, setShowNewNote] = useState(false);

  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [wbForm, setWbForm] = useState({ name: "", data: "{}" });
  const [showNewWb, setShowNewWb] = useState(false);

  useEffect(() => {
    loadNotes();
    loadWhiteboards();
  }, []);

  async function loadComments() {
    if (!commentSearch.entityId) return;
    try {
      const r = await fetch(`/api/collaboration/comments?entityType=${commentSearch.entityType}&entityId=${commentSearch.entityId}`);
      if (r.ok) setComments(await r.json());
    } catch {}
  }

  async function loadNotes() { try { const r = await fetch("/api/collaboration/notes"); if (r.ok) setNotes(await r.json()); } catch {} }
  async function loadWhiteboards() { try { const r = await fetch("/api/collaboration/whiteboards"); if (r.ok) setWhiteboards(await r.json()); } catch {} }

  async function createComment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/collaboration/comments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...commentForm, entityId: Number(commentForm.entityId), mentions: commentForm.mentions.split(",").map((m) => m.trim()).filter(Boolean) }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewComment(false);
      setCommentForm({ entityType: "ticket", entityId: "", bodyHtml: "", mentions: "" });
      setCommentSearch({ entityType: commentForm.entityType, entityId: commentForm.entityId });
      toast.success("Comment added");
    }
  }

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/collaboration/notes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...noteForm,
        sharedWith: noteForm.sharedWith.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewNote(false);
      setNoteForm({ title: "", bodyHtml: "", sharedWith: "" });
      await loadNotes();
      toast.success("Note created");
    }
  }

  async function createWhiteboard(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/collaboration/whiteboards", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(wbForm),
    });
    setSubmitting(false);
    if (r.ok) {
      setShowNewWb(false);
      setWbForm({ name: "", data: "{}" });
      await loadWhiteboards();
      toast.success("Whiteboard created");
    }
  }

  const tabs = [
    { id: "comments", label: "Comments", icon: MessageSquare },
    { id: "notes", label: "Shared Notes", icon: FileText },
    { id: "whiteboards", label: "Whiteboards", icon: Layout },
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
          <h1 className="text-3xl font-bold">Collaboration</h1>
          <p className="text-muted-foreground">Comments, shared notes, and whiteboards</p>
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

        {activeTab === "comments" && (
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div>
                <label className="text-sm font-medium mb-1 block">Entity Type</label>
                <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={commentSearch.entityType} onChange={(e) => setCommentSearch({ ...commentSearch, entityType: e.target.value })}>
                  {entityTypes.map((et) => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Entity ID</label>
                <Input placeholder="e.g. 42" value={commentSearch.entityId} onChange={(e) => setCommentSearch({ ...commentSearch, entityId: e.target.value })} />
              </div>
              <Button onClick={loadComments}><Search className="mr-2 h-4 w-4" /> Search</Button>
              <Button variant="outline" onClick={() => {
                setCommentForm({ ...commentForm, entityType: commentSearch.entityType, entityId: commentSearch.entityId });
                setShowNewComment(true);
              }}><Plus className="mr-2 h-4 w-4" /> Add Comment</Button>
            </div>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments found. Search for an entity above.</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <BentoCard key={c.id}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {c.user?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                        </div>
                        <span className="text-sm font-medium">{c.user?.name || "Unknown"}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm" dangerouslySetInnerHTML={{ __html: c.bodyHtml }} />
                      {c.mentions && (
                        <p className="text-xs text-muted-foreground">Mentions: {c.mentions}</p>
                      )}
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-6 space-y-2 border-l-2 pl-3">
                          {c.replies.map((r) => (
                            <div key={r.id} className="text-sm">
                              <span className="font-medium">{r.user?.name}</span>: <span dangerouslySetInnerHTML={{ __html: r.bodyHtml }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewComment} onClose={() => setShowNewComment(false)} title="New Comment">
              <form onSubmit={createComment} className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Entity Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={commentForm.entityType} onChange={(e) => setCommentForm({ ...commentForm, entityType: e.target.value })}>
                    {entityTypes.map((et) => <option key={et} value={et}>{et}</option>)}
                  </select>
                </div>
                <Input placeholder="Entity ID" type="number" value={commentForm.entityId} onChange={(e) => setCommentForm({ ...commentForm, entityId: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body HTML</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={commentForm.bodyHtml} onChange={(e) => setCommentForm({ ...commentForm, bodyHtml: e.target.value })} required />
                </div>
                <Input placeholder="Mentions (comma separated usernames)" value={commentForm.mentions} onChange={(e) => setCommentForm({ ...commentForm, mentions: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Comment
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewNote(true)}><Plus className="mr-2 h-4 w-4" /> New Note</Button>
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <BentoCard key={n.id}>
                    <div>
                      <button className="w-full text-left" onClick={() => setExpandedNote(expandedNote === n.id ? null : n.id)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{n.title}</h4>
                              <Badge variant="secondary">
                                <Users className="h-3 w-3 mr-1" />
                                {typeof n.sharedWith === "string" ? n.sharedWith.split(",").length : Array.isArray(n.sharedWith) ? n.sharedWith.length : 0} shared
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {n.creator?.name} · {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                      {expandedNote === n.id && n.bodyHtml && (
                        <div className="mt-3 border-t pt-3">
                          <div className="text-sm" dangerouslySetInnerHTML={{ __html: n.bodyHtml }} />
                        </div>
                      )}
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewNote} onClose={() => setShowNewNote(false)} title="New Note">
              <form onSubmit={createNote} className="space-y-3">
                <Input placeholder="Note Title" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Body HTML</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[150px]" value={noteForm.bodyHtml} onChange={(e) => setNoteForm({ ...noteForm, bodyHtml: e.target.value })} required />
                </div>
                <Input placeholder="Shared With (comma separated user IDs)" value={noteForm.sharedWith} onChange={(e) => setNoteForm({ ...noteForm, sharedWith: e.target.value })} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Note
                </Button>
              </form>
            </Modal>
          </div>
        )}

        {activeTab === "whiteboards" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewWb(true)}><Plus className="mr-2 h-4 w-4" /> New Whiteboard</Button>
            </div>
            {whiteboards.length === 0 ? (
              <p className="text-sm text-muted-foreground">No whiteboards yet.</p>
            ) : (
              <div className="space-y-3">
                {whiteboards.map((w) => (
                  <BentoCard key={w.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{w.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {w.participantCount != null && `${w.participantCount} participants · `}
                          Created {new Date(w.createdAt).toLocaleDateString()}
                        </p>
                        {w.data && (
                          <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto max-w-lg">
                            {w.data.length > 120 ? w.data.slice(0, 120) + "..." : w.data}
                          </pre>
                        )}
                      </div>
                    </div>
                  </BentoCard>
                ))}
              </div>
            )}
            <Modal open={showNewWb} onClose={() => setShowNewWb(false)} title="New Whiteboard">
              <form onSubmit={createWhiteboard} className="space-y-3">
                <Input placeholder="Whiteboard Name" value={wbForm.name} onChange={(e) => setWbForm({ ...wbForm, name: e.target.value })} required />
                <div>
                  <label className="text-sm font-medium mb-1 block">Data JSON</label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] font-mono" value={wbForm.data} onChange={(e) => setWbForm({ ...wbForm, data: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Whiteboard
                </Button>
              </form>
            </Modal>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
