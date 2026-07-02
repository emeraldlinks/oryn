"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { DataTable, type Column } from "@/components/shared/data-table";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus } from "lucide-react";

interface EmployeeSkill {
  id: number;
  employeeId: number;
  skillId: number;
  proficiencyLevel: number;
  yearsOfExperience?: number;
  isPrimary: boolean;
  lastUsedAt?: string;
}

const columns: Column<EmployeeSkill>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (e) => `#${e.employeeId}` },
  { key: "skillId", label: "Skill", render: (e) => `#${e.skillId}` },
  { key: "proficiencyLevel", label: "Level", render: (e) => `${e.proficiencyLevel}/5` },
  { key: "yearsOfExperience", label: "Years", render: (e) => e.yearsOfExperience ?? "-" },
  { key: "isPrimary", label: "Primary", render: (e) => <Badge variant={e.isPrimary ? "default" : "secondary"}>{e.isPrimary ? "Yes" : "No"}</Badge> },
  { key: "lastUsedAt", label: "Last Used", render: (e) => e.lastUsedAt ? new Date(e.lastUsedAt).toLocaleDateString() : "-" },
];

export default function EmployeeSkillsPage() {
  const [data, setData] = useState<EmployeeSkill[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: "", skillId: "", proficiencyLevel: "3", yearsOfExperience: "", isPrimary: "false" });

  useEffect(() => {
    fetch("/api/admin/staff/employee-skills").then((r) => r.json()).then(setData);
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/employee-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: Number(form.employeeId),
        skillId: Number(form.skillId),
        proficiencyLevel: Number(form.proficiencyLevel),
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        isPrimary: form.isPrimary === "true",
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ employeeId: "", skillId: "", proficiencyLevel: "3", yearsOfExperience: "", isPrimary: "false" });
      setData(await fetch("/api/admin/staff/employee-skills").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Skills</h1>
            <p className="text-muted-foreground">Manage skill assignments and proficiency</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="mr-2 h-4 w-4" /> Assign Skill</Button>
        </div>

        <BentoGrid>
          <StatCard title="Total Assignments" value={data.length} icon={Zap} />
          <StatCard title="Primary Skills" value={data.filter((e) => e.isPrimary).length} icon={Zap} />
          <StatCard title="Avg Proficiency" value={data.length ? (data.reduce((s, e) => s + e.proficiencyLevel, 0) / data.length).toFixed(1) : "0"} icon={Zap} />
        </BentoGrid>

        {showAdd && (
          <form onSubmit={addItem} className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Employee ID" type="number" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
              <Input placeholder="Skill ID" type="number" value={form.skillId} onChange={(e) => setForm({ ...form, skillId: e.target.value })} required />
              <Input placeholder="Proficiency (1-5)" type="number" min={1} max={5} value={form.proficiencyLevel} onChange={(e) => setForm({ ...form, proficiencyLevel: e.target.value })} />
              <Input placeholder="Years of Experience" type="number" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.isPrimary} onChange={(e) => setForm({ ...form, isPrimary: e.target.value })}>
                <option value="false">Not Primary</option>
                <option value="true">Primary Skill</option>
              </select>
            </div>
            <Button type="submit">Save Assignment</Button>
          </form>
        )}

        <DataTable columns={columns} data={data} searchKeys={["employeeId"]} />
      </div>
    </DashboardShell>
  );
}
