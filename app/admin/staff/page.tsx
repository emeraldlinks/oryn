"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid } from "@/components/shared/bento-grid";
import { StatCard } from "@/components/shared/stat-card";
import { Users, Building2, Briefcase, Calendar, CalendarCheck, AlertTriangle, BookOpen, Zap, Puzzle } from "lucide-react";

interface StaffStats {
  totalEmployees: number;
  totalDepartments: number;
  totalPositions: number;
  activeSchedules: number;
  pendingLeave: number;
  openDisciplinary: number;
}

const links = [
  { href: "/admin/staff/departments", label: "Departments", icon: Building2 },
  { href: "/admin/staff/departments/modules", label: "Dept. Modules", icon: Puzzle },
  { href: "/admin/staff/positions", label: "Positions", icon: Briefcase },
  { href: "/admin/staff/shifts", label: "Shifts", icon: Calendar },
  { href: "/admin/staff/schedules", label: "Schedules", icon: Calendar },
  { href: "/admin/staff/timesheets", label: "Timesheets", icon: CalendarCheck },
  { href: "/admin/staff/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/admin/staff/leave", label: "Leave", icon: CalendarCheck },
  { href: "/admin/staff/performance", label: "Performance", icon: Users },
  { href: "/admin/staff/goals", label: "Goals", icon: Users },
  { href: "/admin/staff/training", label: "Training", icon: Users },
  { href: "/admin/staff/enrollments", label: "Enrollments", icon: BookOpen },
  { href: "/admin/staff/certifications", label: "Certifications", icon: Users },
  { href: "/admin/staff/skills", label: "Skills", icon: Users },
  { href: "/admin/staff/employee-skills", label: "Employee Skills", icon: Zap },
  { href: "/admin/staff/documents", label: "Documents", icon: Users },
  { href: "/admin/staff/compliance", label: "Compliance", icon: AlertTriangle },
  { href: "/admin/staff/disciplinary", label: "Disciplinary", icon: AlertTriangle },
  { href: "/admin/staff/expenses", label: "Expenses", icon: Users },
];

export default function StaffPage() {
  const [stats, setStats] = useState<StaffStats>({
    totalEmployees: 0, totalDepartments: 0, totalPositions: 0,
    activeSchedules: 0, pendingLeave: 0, openDisciplinary: 0,
  });

  useEffect(() => {
    fetch("/api/admin/staff/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>

        <BentoGrid>
          <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} />
          <StatCard title="Departments" value={stats.totalDepartments} icon={Building2} />
          <StatCard title="Positions" value={stats.totalPositions} icon={Briefcase} />
          <StatCard title="Active Schedules" value={stats.activeSchedules} icon={Calendar} />
          <StatCard title="Pending Leave" value={stats.pendingLeave} icon={CalendarCheck} />
          <StatCard title="Open Disciplinary" value={stats.openDisciplinary} icon={AlertTriangle} />
        </BentoGrid>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <l.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
