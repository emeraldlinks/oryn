"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, GripVertical, Loader2, X } from "lucide-react";

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contactId: number;
  currency: string;
}

const stages = [
  { key: "lead", label: "Lead", color: "bg-blue-500" },
  { key: "qualified", label: "Qualified", color: "bg-indigo-500" },
  { key: "proposal", label: "Proposal", color: "bg-violet-500" },
  { key: "negotiation", label: "Negotiation", color: "bg-amber-500" },
  { key: "closed-won", label: "Closed Won", color: "bg-emerald-500" },
  { key: "closed-lost", label: "Closed Lost", color: "bg-red-500" },
];

function SortableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { type: "deal", deal },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 rounded-lg bg-card border shadow-sm cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium leading-tight">{deal.title}</p>
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {deal.currency === "EUR" ? "€" : "$"}{deal.value.toLocaleString()}
        </span>
        <Badge variant="outline" className="text-xs">{deal.probability}%</Badge>
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  deals,
  onAddDeal,
}: {
  stage: (typeof stages)[0];
  deals: Deal[];
  onAddDeal: (stage: string) => void;
}) {
  const ids = deals.map((d) => d.id);
  const total = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col rounded-xl bg-muted/30 border min-w-[240px] max-h-[calc(100vh-12rem)]">
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
            <h3 className="font-semibold text-sm">{stage.label}</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          ${total.toLocaleString()}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 h-7 text-xs"
          onClick={() => onAddDeal(stage.key)}
        >
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", value: "", contactId: "", probability: "10" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/deals");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDeals(data);
    } catch (err) {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  function getStageDeals(stage: string) {
    return deals.filter((d) => d.stage === stage);
  }

  async function moveDeal(dealId: number, newStage: string) {
    const previous = deals;
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));

    try {
      const res = await fetch("/api/crm/deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dealId, stage: newStage }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Deal moved to ${stages.find((s) => s.key === newStage)?.label}`);
    } catch {
      setDeals(previous);
      toast.error("Failed to move deal");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find((d) => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const activeDealData = deals.find((d) => d.id === active.id);
    if (!activeDealData) return;

    const overStage = over.data?.current?.type === "stage" ? over.data.current.stage : null;

    if (overStage && overStage !== activeDealData.stage) {
      moveDeal(activeDealData.id, overStage);
    }
  }

  async function handleAddDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!showAddForm) return;

    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          value: Number(form.value),
          contactId: form.contactId ? Number(form.contactId) : 0,
          probability: Number(form.probability),
          stage: showAddForm,
          currency: "USD",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Deal created");
      setShowAddForm(null);
      setForm({ title: "", value: "", contactId: "", probability: "10" });
      fetchDeals();
    } catch {
      toast.error("Failed to create deal");
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pipeline</h1>
            <p className="text-muted-foreground">Drag deals between stages to update</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{deals.length} deals</span>
            <span>·</span>
            <span>${deals.reduce((s, d) => s + d.value, 0).toLocaleString()} total</span>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
            {stages.map((stage) => (
              <StageColumn
                key={stage.key}
                stage={stage}
                deals={getStageDeals(stage.key)}
                onAddDeal={(s) => setShowAddForm(s)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal && (
              <div className="p-3 rounded-lg bg-card border shadow-xl opacity-90">
                <p className="text-sm font-medium">{activeDeal.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${activeDeal.value.toLocaleString()}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Add Deal to {stages.find((s) => s.key === showAddForm)?.label}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddForm(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddDeal} className="space-y-3">
                <Input
                  placeholder="Deal Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Value"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                />
                <Input
                  placeholder="Contact ID (optional)"
                  type="number"
                  value={form.contactId}
                  onChange={(e) => setForm({ ...form, contactId: e.target.value })}
                />
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Probability</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.probability}
                    onChange={(e) => setForm({ ...form, probability: e.target.value })}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{form.probability}%</span>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Deal</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
