"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, User, Clock, CheckCheck } from "lucide-react";

export default function ChatAdminPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) loadMessages(selectedChat.id);
  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadChats() {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) setChats(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }

  async function loadMessages(contactId: number) {
    try {
      const res = await fetch(`/api/chat?contactId=${contactId}`);
      if (res.ok) setMessages(await res.json());
    } catch {}
  }

  async function sendReply() {
    if (!reply.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedChat.contactId || selectedChat.id,
          content: reply,
          direction: "outgoing",
        }),
      });
      if (res.ok) {
        setReply("");
        loadMessages(selectedChat.contactId || selectedChat.id);
      }
    } catch {} finally {
      setSending(false);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">Manage conversations with website visitors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          <div className="lg:col-span-1 border rounded-lg overflow-hidden">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-sm font-medium">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-[calc(100%-3rem)]">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">No conversations yet</div>
              ) : (
                chats.map((chat: any) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-3 border-b hover:bg-muted/30 transition-colors ${
                      selectedChat?.id === chat.id ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{chat.name || chat.email || `Visitor ${chat.id}`}</p>
                      {chat.unread > 0 && <Badge variant="default" className="text-xs">{chat.unread}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage || "No messages"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : ""}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 border rounded-lg flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-3 border-b bg-muted/30 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedChat.name || selectedChat.email || "Visitor"}</p>
                    <p className="text-xs text-muted-foreground">{selectedChat.email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                        msg.direction === "outgoing"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          msg.direction === "outgoing" ? "justify-end" : ""
                        }`}>
                          <Clock className="h-3 w-3" />
                          <span className="text-xs opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {msg.direction === "outgoing" && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    />
                    <Button onClick={sendReply} disabled={!reply.trim() || sending}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
