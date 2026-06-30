"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Target,
  ShoppingCart,
  FileText,
  Calendar,
  MessageSquare,
  Share2,
  Globe,
  BarChart3,
  Settings,
  HelpCircle,
  Building2,
  Ticket,
  FileSignature,
  Zap,
  Shield,
  CreditCard,
  Megaphone,
  PhoneCall,
  Bot,
  Brain,
  Kanban,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const roleNavItems: Record<string, NavItem[]> = {
  superadmin: [
    { label: "Overview", href: "/superadmin", icon: LayoutDashboard },
    { label: "Workspaces", href: "/superadmin/workspaces", icon: Building2 },
    { label: "Users", href: "/superadmin/users", icon: Users },
    { label: "Billing", href: "/superadmin/billing", icon: CreditCard },
    { label: "System Health", href: "/superadmin/health", icon: Shield },
    { label: "Analytics", href: "/superadmin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/superadmin/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "CRM", href: "/admin/crm", icon: Target },
    { label: "Products", href: "/admin/products", icon: ShoppingCart },
    { label: "Employees", href: "/admin/employees", icon: Users },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    { label: "Social Media", href: "/admin/social", icon: Share2 },
    { label: "WordPress", href: "/admin/wordpress", icon: Globe },
    { label: "Communications", href: "/admin/communications", icon: MessageSquare },
    { label: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    { label: "Projects", href: "/admin/projects", icon: Kanban },
    { label: "Documents", href: "/admin/documents", icon: FileSignature },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "AI Assistant", href: "/admin/ai", icon: Brain },
    { label: "Bots", href: "/admin/bots", icon: Bot },
    { label: "Automation", href: "/admin/automation", icon: Zap },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  manager: [
    { label: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { label: "Leads", href: "/manager/leads", icon: Target },
    { label: "Deals", href: "/manager/deals", icon: ShoppingCart },
    { label: "Tasks", href: "/manager/tasks", icon: Calendar },
    { label: "Team", href: "/manager/team", icon: Users },
    { label: "Social", href: "/manager/social", icon: Share2 },
    { label: "Reports", href: "/manager/reports", icon: BarChart3 },
  ],
  employee: [
    { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { label: "Tasks", href: "/employee/tasks", icon: Calendar },
    { label: "Leads", href: "/employee/leads", icon: Target },
    { label: "Deals", href: "/employee/deals", icon: ShoppingCart },
    { label: "Inbox", href: "/employee/inbox", icon: MessageSquare },
    { label: "Social", href: "/employee/social", icon: Share2 },
    { label: "Calls", href: "/employee/calls", icon: PhoneCall },
  ],
  client: [
    { label: "Dashboard", href: "/client", icon: LayoutDashboard },
    { label: "Orders", href: "/client/orders", icon: ShoppingCart },
    { label: "Invoices", href: "/client/invoices", icon: FileText },
    { label: "Tickets", href: "/client/tickets", icon: Ticket },
    { label: "Documents", href: "/client/documents", icon: FileSignature },
    { label: "Privacy", href: "/client/privacy", icon: Shield },
  ],
};

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const items = roleNavItems[role] || roleNavItems.employee;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-muted px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
          <span className="text-sm font-bold text-white">O</span>
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">Oryn</span>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                active ? "sidebar-link-active" : "sidebar-link-inactive"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-muted p-4">
        <Link
          href="/help"
          className="sidebar-link sidebar-link-inactive"
        >
          <HelpCircle className="h-5 w-5" />
          Help & Support
        </Link>
      </div>
    </aside>
  );
}
