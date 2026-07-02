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
  Terminal,
  DollarSign,
  Heart,
  BookOpen,
  Headphones,
  Code2,
  Users2,
  Wallet,
  CalendarDays,
  Lock,
  Activity,
  HardDrive,
  Palette,
  Database,
  Puzzle,
  Package,
  Briefcase,
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
    { label: "Inventory", href: "/admin/inventory", icon: Package },
    { label: "Employees", href: "/admin/employees", icon: Users },
    { label: "Staff", href: "/admin/staff", icon: Users2 },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    { label: "Social Media", href: "/admin/social", icon: Share2 },
    { label: "Sales", href: "/admin/sales", icon: DollarSign },
    { label: "Communications", href: "/admin/communications", icon: MessageSquare },
    { label: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    { label: "Help Desk", href: "/admin/help-desk", icon: Headphones },
    { label: "Customer Portal", href: "/admin/portal", icon: BookOpen },
    { label: "Projects", href: "/admin/projects", icon: Kanban },
    { label: "Automation", href: "/admin/automation", icon: Zap },
    { label: "Documents", href: "/admin/documents", icon: FileSignature },
    { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
    { label: "AI Assistant", href: "/admin/ai", icon: Brain },
    { label: "Bot Connections", href: "/admin/bot-connections", icon: Terminal },
    { label: "Bots", href: "/admin/bots", icon: Bot },
    { label: "Developer", href: "/admin/developer", icon: Code2 },
    { label: "Finance", href: "/admin/finance", icon: Wallet },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Billing", href: "/admin/billing", icon: DollarSign },
    { label: "Customer Success", href: "/admin/customer-success", icon: Heart },
    { label: "Support", href: "/admin/support", icon: Ticket },
    { label: "Jobs", href: "/admin/jobs", icon: Activity },
    { label: "Hiring", href: "/admin/hiring", icon: Briefcase },
    { label: "Webhooks", href: "/admin/webhooks", icon: Code2 },
    { label: "Email Log", href: "/admin/email", icon: MessageSquare },
    { label: "System Health", href: "/admin/health", icon: Shield },
    { label: "Storage", href: "/admin/storage", icon: HardDrive },
    { label: "Branding", href: "/admin/branding", icon: Palette },
    { label: "Domains", href: "/admin/domains", icon: Globe },
    { label: "Backups", href: "/admin/backups", icon: FileSignature },
    { label: "Data Retention", href: "/admin/data-retention", icon: Database },
    { label: "Quotas", href: "/admin/multi-tenancy", icon: Building2 },
    { label: "Feature Flags", href: "/admin/feature-flags", icon: Zap },
    { label: "i18n", href: "/admin/i18n", icon: Globe },
    { label: "Marketplace", href: "/admin/marketplace", icon: ShoppingCart },
    { label: "Plugins", href: "/admin/plugins", icon: Puzzle },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "WordPress", href: "/admin/wordpress", icon: Globe },
    { label: "Team Collab", href: "/admin/collaboration", icon: Users2 },
    { label: "Security", href: "/admin/security", icon: Lock },
    { label: "Audit", href: "/admin/audit", icon: Activity },
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
