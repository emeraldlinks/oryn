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

interface Skill {
  id: number;
  name: string;
  category?: string;
}

interface EmployeeSkill {
  id: number;
  employeeId: number;
  skillId: number;
  proficiencyLevel: number;
  isPrimary: boolean;
}

const skillColumns: Column<Skill>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", render: (s) => s.category || "-" },
];

const empSkillColumns: Column<EmployeeSkill>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "employeeId", label: "Employee", render: (e) => `#${e.employeeId}` },
  { key: "skillId", label: "Skill ID", render: (e) => `#${e.skillId}` },
  { key: "proficiencyLevel", label: "Proficiency", render: (e) => `${e.proficiencyLevel}/5` },
  { key: "isPrimary", label: "Primary", render: (e) => <Badge variant={e.isPrimary ? "default" : "secondary"}>{e.isPrimary ? "Yes" : "No"}</Badge> },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [empSkills, setEmpSkills] = useState<EmployeeSkill[]>([]);
  const [showSkillAdd, setShowSkillAdd] = useState(false);
  const [showEmpSkillAdd, setShowEmpSkillAdd] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", category: "" });
  const [empSkillForm, setEmpSkillForm] = useState({ employeeId: "", skillId: "", proficiencyLevel: "3", isPrimary: "false" });

  useEffect(() => {
    fetch("/api/admin/staff/skills").then((r) => r.json()).then(setSkills);
    fetch("/api/admin/staff/employee-skills").then((r) => r.json()).then(setEmpSkills);
  }, []);

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: skillForm.name, category: skillForm.category || undefined }),
    });
    if (res.ok) {
      setShowSkillAdd(false);
      setSkillForm({ name: "", category: "" });
      setSkills(await fetch("/api/admin/staff/skills").then((r) => r.json()));
    }
  }

  async function addEmpSkill(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/staff/employee-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: Number(empSkillForm.employeeId), skillId: Number(empSkillForm.skillId), proficiencyLevel: Number(empSkillForm.proficiencyLevel), isPrimary: empSkillForm.isPrimary === "true" }),
    });
    if (res.ok) {
      setShowEmpSkillAdd(false);
      setEmpSkillForm({ employeeId: "", skillId: "", proficiencyLevel: "3", isPrimary: "false" });
      setEmpSkills(await fetch("/api/admin/staff/employee-skills").then((r) => r.json()));
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">Manage skills and employee skills</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Skills" value={skills.length} icon={Zap} />
          <StatCard title="Total Employee Skills" value={empSkills.length} icon={Zap} />
        </BentoGrid>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Skill Definitions</h2>
            <Button onClick={() => setShowSkillAdd(!showSkillAdd)}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          {showSkillAdd && (
            <form onSubmit={addSkill} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
                <Input placeholder="Category" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
              </div>
              <Button type="submit">Save Skill</Button>
            </form>
          )}

          <DataTable columns={skillColumns} data={skills} searchKeys={["name", "category"]} />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Employee Skills</h2>
            <Button onClick={() => setShowEmpSkillAdd(!showEmpSkillAdd)}>
              <Plus className="mr-2 h-4 w-4" /> Assign Skill
            </Button>
          </div>

          {showEmpSkillAdd && (
            <form onSubmit={addEmpSkill} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Employee ID" type="number" value={empSkillForm.employeeId} onChange={(e) => setEmpSkillForm({ ...empSkillForm, employeeId: e.target.value })} required />
                <Input placeholder="Skill ID" type="number" value={empSkillForm.skillId} onChange={(e) => setEmpSkillForm({ ...empSkillForm, skillId: e.target.value })} required />
                <Input placeholder="Proficiency (1-5)" type="number" min="1" max="5" value={empSkillForm.proficiencyLevel} onChange={(e) => setEmpSkillForm({ ...empSkillForm, proficiencyLevel: e.target.value })} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={empSkillForm.isPrimary === "true"} onChange={(e) => setEmpSkillForm({ ...empSkillForm, isPrimary: e.target.checked ? "true" : "false" })} />
                  Primary Skill
                </label>
              </div>
              <Button type="submit">Assign Skill</Button>
            </form>
          )}

          <DataTable columns={empSkillColumns} data={empSkills} searchKeys={["employeeId"]} />
        </div>
      </div>
    </DashboardShell>
  );
}
