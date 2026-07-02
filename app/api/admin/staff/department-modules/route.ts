import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const DEFAULT_MODULES = [
  { key: "hr-employees", name: "Employees", description: "Manage employee profiles", category: "HR", href: "/admin/employees", icon: "Users", sortOrder: 1 },
  { key: "hr-attendance", name: "Attendance", description: "Track daily attendance", category: "HR", href: "/admin/staff/attendance", icon: "CalendarCheck", sortOrder: 2 },
  { key: "hr-leave", name: "Leave Management", description: "Manage leave requests", category: "HR", href: "/admin/staff/leave", icon: "CalendarCheck", sortOrder: 3 },
  { key: "hr-performance", name: "Performance Reviews", description: "Conduct evaluations", category: "HR", href: "/admin/staff/performance", icon: "Users", sortOrder: 4 },
  { key: "hr-goals", name: "Goals & OKRs", description: "Track objectives", category: "HR", href: "/admin/staff/goals", icon: "Users", sortOrder: 5 },
  { key: "hr-training", name: "Training Courses", description: "Manage training", category: "HR", href: "/admin/staff/training", icon: "BookOpen", sortOrder: 6 },
  { key: "hr-enrollments", name: "Training Enrollments", description: "Track enrollments", category: "HR", href: "/admin/staff/enrollments", icon: "BookOpen", sortOrder: 7 },
  { key: "hr-certifications", name: "Certifications", description: "Track certifications", category: "HR", href: "/admin/staff/certifications", icon: "Award", sortOrder: 8 },
  { key: "hr-skills", name: "Skills Matrix", description: "Manage skill definitions", category: "HR", href: "/admin/staff/skills", icon: "Zap", sortOrder: 9 },
  { key: "hr-employee-skills", name: "Employee Skills", description: "Assign skills to employees", category: "HR", href: "/admin/staff/employee-skills", icon: "Zap", sortOrder: 10 },
  { key: "hr-documents", name: "Staff Documents", description: "Contracts, NDAs, etc.", category: "HR", href: "/admin/staff/documents", icon: "FileText", sortOrder: 11 },
  { key: "hr-compliance", name: "Compliance", description: "Track compliance items", category: "HR", href: "/admin/staff/compliance", icon: "AlertTriangle", sortOrder: 12 },
  { key: "hr-disciplinary", name: "Disciplinary", description: "Manage disciplinary actions", category: "HR", href: "/admin/staff/disciplinary", icon: "AlertTriangle", sortOrder: 13 },
  { key: "hr-expenses", name: "Staff Expenses", description: "Expense reports", category: "HR", href: "/admin/staff/expenses", icon: "DollarSign", sortOrder: 14 },
  { key: "hr-positions", name: "Positions", description: "Job roles per department", category: "HR", href: "/admin/staff/positions", icon: "Briefcase", sortOrder: 15 },
  { key: "hr-shifts", name: "Shifts", description: "Shift templates", category: "HR", href: "/admin/staff/shifts", icon: "Calendar", sortOrder: 16 },
  { key: "hr-schedules", name: "Schedules", description: "Employee shift assignments", category: "HR", href: "/admin/staff/schedules", icon: "Calendar", sortOrder: 17 },
  { key: "hr-timesheets", name: "Timesheets", description: "Time tracking", category: "HR", href: "/admin/staff/timesheets", icon: "CalendarCheck", sortOrder: 18 },
  { key: "hr-departments", name: "Departments", description: "Department configuration", category: "HR", href: "/admin/staff/departments", icon: "Building2", sortOrder: 19 },
  { key: "hr-hiring", name: "Hiring Pipeline", description: "Job postings and candidates", category: "HR", href: "/admin/jobs", icon: "Briefcase", sortOrder: 20 },
  { key: "sales-crm", name: "CRM", description: "Contact and lead management", category: "Sales", href: "/admin/crm", icon: "Users", sortOrder: 1 },
  { key: "sales-pipeline", name: "Pipeline", description: "Deal pipeline management", category: "Sales", href: "/admin/crm/pipeline", icon: "TrendingUp", sortOrder: 2 },
  { key: "sales-contacts", name: "Contacts", description: "Contact directory", category: "Sales", href: "/admin/crm/contacts", icon: "Users", sortOrder: 3 },
  { key: "sales-activities", name: "Activities", description: "Sales activities log", category: "Sales", href: "/admin/crm/activities", icon: "Activity", sortOrder: 4 },
  { key: "sales-products", name: "Products", description: "Product catalog", category: "Sales", href: "/admin/products", icon: "Package", sortOrder: 5 },
  { key: "sales-orders", name: "Orders", description: "Order management", category: "Sales", href: "/admin/products/orders", icon: "ShoppingCart", sortOrder: 6 },
  { key: "sales-invoices", name: "Invoices", description: "Invoice management", category: "Sales", href: "/admin/products/invoices", icon: "FileText", sortOrder: 7 },
  { key: "sales-quotes", name: "Quotes", description: "Quote generation", category: "Sales", href: "/admin/sales", icon: "DollarSign", sortOrder: 8 },
  { key: "sales-goals", name: "Sales Goals", description: "Track sales targets", category: "Sales", href: "/admin/sales", icon: "Target", sortOrder: 9 },
  { key: "finance-invoices", name: "Invoicing", description: "Financial invoicing", category: "Finance", href: "/admin/products/invoices", icon: "FileText", sortOrder: 1 },
  { key: "finance-payments", name: "Payments", description: "Payment processing", category: "Finance", href: "/admin/payments", icon: "CreditCard", sortOrder: 2 },
  { key: "finance-expenses", name: "Expenses", description: "Track expenses", category: "Finance", href: "/admin/finance", icon: "DollarSign", sortOrder: 3 },
  { key: "finance-billing", name: "Billing", description: "Billing management", category: "Finance", href: "/admin/billing", icon: "Receipt", sortOrder: 4 },
  { key: "finance-tax", name: "Tax Rates", description: "Configure tax rates", category: "Finance", href: "/admin/finance", icon: "Percent", sortOrder: 5 },
  { key: "finance-reports", name: "Financial Reports", description: "Reporting and analytics", category: "Finance", href: "/admin/reports", icon: "BarChart3", sortOrder: 6 },
  { key: "bizdev-crm", name: "CRM", description: "Contact and pipeline management", category: "Business Development", href: "/admin/crm", icon: "Users", sortOrder: 1 },
  { key: "bizdev-marketing", name: "Marketing", description: "Campaign management", category: "Business Development", href: "/admin/marketing", icon: "Megaphone", sortOrder: 2 },
  { key: "bizdev-social", name: "Social Media", description: "Social presence management", category: "Business Development", href: "/admin/social", icon: "Share2", sortOrder: 3 },
  { key: "bizdev-email", name: "Email Marketing", description: "Email campaigns", category: "Business Development", href: "/admin/email", icon: "Mail", sortOrder: 4 },
  { key: "bizdev-wordpress", name: "WordPress", description: "WordPress site management", category: "Business Development", href: "/admin/wordpress", icon: "Globe", sortOrder: 5 },
  { key: "bizdev-projects", name: "Projects", description: "Project management", category: "Business Development", href: "/admin/projects", icon: "FolderOpen", sortOrder: 6 },
  { key: "bizdev-collab", name: "Collaboration", description: "Team collaboration tools", category: "Business Development", href: "/admin/collaboration", icon: "Users", sortOrder: 7 },
  { key: "operations-inventory", name: "Inventory", description: "Inventory management", category: "Operations", href: "/admin/inventory", icon: "Package", sortOrder: 1 },
  { key: "operations-projects", name: "Projects", description: "Project tracking", category: "Operations", href: "/admin/projects", icon: "FolderOpen", sortOrder: 2 },
  { key: "operations-support", name: "Support Tickets", description: "Customer support", category: "Operations", href: "/admin/support", icon: "Ticket", sortOrder: 3 },
  { key: "operations-calendar", name: "Calendar", description: "Calendar management", category: "Operations", href: "/admin/calendar", icon: "Calendar", sortOrder: 4 },
  { key: "operations-documents", name: "Documents", description: "Document management", category: "Operations", href: "/admin/documents", icon: "FileText", sortOrder: 5 },
  { key: "operations-communications", name: "Communications", description: "Internal communications", category: "Operations", href: "/admin/communications", icon: "MessageSquare", sortOrder: 6 },
  { key: "marketing-campaigns", name: "Campaigns", description: "Marketing campaign management", category: "Marketing", href: "/admin/marketing", icon: "Megaphone", sortOrder: 1 },
  { key: "marketing-social", name: "Social Media", description: "Social posts and scheduling", category: "Marketing", href: "/admin/social", icon: "Share2", sortOrder: 2 },
  { key: "marketing-email", name: "Email", description: "Email marketing campaigns", category: "Marketing", href: "/admin/email", icon: "Mail", sortOrder: 3 },
  { key: "marketing-wordpress", name: "WordPress", description: "Blog and site management", category: "Marketing", href: "/admin/wordpress", icon: "Globe", sortOrder: 4 },
  { key: "marketing-analytics", name: "Analytics", description: "Marketing analytics", category: "Marketing", href: "/admin/reports", icon: "BarChart3", sortOrder: 5 },
  { key: "marketing-segments", name: "Segments", description: "Audience segmentation", category: "Marketing", href: "/admin/marketing", icon: "Users", sortOrder: 6 },
  { key: "marketing-abtesting", name: "A/B Testing", description: "Run experiments", category: "Marketing", href: "/admin/marketing", icon: "Split", sortOrder: 7 },
  { key: "it-developer", name: "Developer", description: "API keys and webhooks", category: "IT / Engineering", href: "/admin/developer", icon: "Code", sortOrder: 1 },
  { key: "it-bots", name: "Bots", description: "AI bot management", category: "IT / Engineering", href: "/admin/bots", icon: "Bot", sortOrder: 2 },
  { key: "it-automation", name: "Automation", description: "Workflow automation", category: "IT / Engineering", href: "/admin/automation", icon: "Zap", sortOrder: 3 },
  { key: "it-webhooks", name: "Webhooks", description: "Webhook endpoints", category: "IT / Engineering", href: "/admin/webhooks", icon: "Webhook", sortOrder: 4 },
  { key: "it-ai", name: "AI", description: "AI configuration", category: "IT / Engineering", href: "/admin/ai", icon: "Brain", sortOrder: 5 },
  { key: "it-storage", name: "Storage", description: "Storage monitoring", category: "IT / Engineering", href: "/admin/storage", icon: "HardDrive", sortOrder: 6 },
  { key: "it-security", name: "Security", description: "Security settings", category: "IT / Engineering", href: "/admin/security", icon: "Shield", sortOrder: 7 },
  { key: "it-backups", name: "Backups", description: "Backup management", category: "IT / Engineering", href: "/admin/backups", icon: "Cloud", sortOrder: 8 },
  { key: "it-health", name: "System Health", description: "System monitoring", category: "IT / Engineering", href: "/admin/health", icon: "Activity", sortOrder: 9 },
  { key: "customer-success", name: "Customer Success", description: "Health scores and NPS", category: "Customer Success", href: "/admin/customer-success", icon: "Smile", sortOrder: 1 },
  { key: "customer-support", name: "Support", description: "Ticket management", category: "Customer Success", href: "/admin/support", icon: "Ticket", sortOrder: 2 },
  { key: "customer-helpdesk", name: "Help Desk", description: "Knowledge base", category: "Customer Success", href: "/admin/help-desk", icon: "BookOpen", sortOrder: 3 },
  { key: "customer-portal", name: "Client Portal", description: "Client self-service", category: "Customer Success", href: "/admin/portal", icon: "Globe", sortOrder: 4 },
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const existing = await db.DepartmentModule.query().where("workspaceId", "=", wsId).limit(1).first();
  if (!existing) {
    for (const mod of DEFAULT_MODULES) {
      await db.DepartmentModule.insert({
        workspaceId: wsId,
        ...mod,
        isActive: true,
      });
    }
  }

  let query = db.DepartmentModule.query().where("workspaceId", "=", wsId);
  if (category) query = query.where("category", "=", category);
  const items = await query.orderBy("sortOrder", "ASC").orderBy("name", "ASC").get();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const body = await req.json();
  const item = await db.DepartmentModule.insert({
    workspaceId: wsId,
    key: body.key,
    name: body.name,
    description: body.description || null,
    icon: body.icon || null,
    category: body.category || "uncategorized",
    href: body.href || null,
    isActive: body.isActive !== false,
    sortOrder: body.sortOrder || 0,
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  await db.DepartmentModule.update({ id: Number(id), workspaceId: Number(session.user.workspaceId) }, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.DepartmentModule.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });
  return NextResponse.json({ success: true });
}
