"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, Users, Puzzle, Settings, ArrowLeft, CheckCircle, XCircle, Loader2, Plus } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Users, Building2, Puzzle, Settings,
};

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ employeeCount: 0, moduleCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/admin/staff/departments/${id}/dashboard`).then((r) => r.json()),
      fetch(`/api/admin/staff/departments/${id}/modules`).then((r) => r.json()),
    ]).then(([dash, mod]) => {
      setDepartment(dash.department);
      setStats(dash.stats);
      setModules(mod.modules || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function toggleModule(moduleId: number, assigned: boolean) {
    if (assigned) {
      await fetch(`/api/admin/staff/departments/${id}/modules?moduleId=${moduleId}`, { method: "DELETE" });
    } else {
      await fetch(`/api/admin/staff/departments/${id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
    }
    const res = await fetch(`/api/admin/staff/departments/${id}/modules`);
    if (res.ok) {
      const data = await res.json();
      setModules(data.modules || []);
      setStats((prev: any) => ({
        ...prev,
        moduleCount: data.modules.filter((m: any) => m.assigned).length,
      }));
      toast.success(assigned ? "Module removed" : "Module added");
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  if (!department) {
    return (
      <DashboardShell>
        <div className="text-center py-12 text-muted-foreground">Department not found</div>
      </DashboardShell>
    );
  }

  const assignedModules = modules.filter((m: any) => m.assigned);
  const unassignedModules = modules.filter((m: any) => !m.assigned);
  const categoryOrder = [...new Set(modules.map((m: any) => m.category))];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/staff/departments" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{department.name}</h1>
                <Badge variant={department.isActive ? "default" : "secondary"}>
                  {department.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {department.description && <p className="text-muted-foreground">{department.description}</p>}
            </div>
          </div>
        </div>

        <BentoGrid>
          <StatCard title="Employees" value={stats.employeeCount} icon={Users} />
          <StatCard title="Assigned Tools" value={stats.moduleCount} icon={Puzzle} />
        </BentoGrid>

        {assignedModules.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Department Tools ({assignedModules.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {assignedModules.map((m: any) => {
                const Icon = ICON_MAP[m.icon as string] || Puzzle;
                return (
                  <Link
                    key={m.id}
                    href={m.href || "#"}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{m.name}</p>
                      {m.description && <p className="text-[10px] text-muted-foreground">{m.description}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {unassignedModules.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Modules ({unassignedModules.length})</h2>
            {categoryOrder.map((cat) => {
              const catModules = unassignedModules.filter((m: any) => m.category === cat);
              if (catModules.length === 0) return null;
              return (
                <div key={cat} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {catModules.map((m: any) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 cursor-pointer"
                        onClick={() => toggleModule(m.id, false)}
                      >
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.key}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Assigned Module Toggle</h2>
          <div className="space-y-2">
            {modules.map((m: any) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  {m.assigned ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.category} · {m.key}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={m.assigned ? "destructive" : "default"}
                  onClick={() => toggleModule(m.id, m.assigned)}
                >
                  {m.assigned ? "Remove" : "Add"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
