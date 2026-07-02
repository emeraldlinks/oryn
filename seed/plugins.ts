export interface PluginSeedManifest {
  name: string;
  version: string;
  author: string;
  description: string;
  entryPoint?: string;
  permissions: string[];
}

export interface PluginSeedExtension {
  extensionType: string;
  name: string;
  config: Record<string, unknown>;
}

export interface PluginSeed {
  marketplace: {
    type: string;
    name: string;
    description: string;
    version: string;
    author: string;
    publisher: string;
    iconUrl: string;
    config: Record<string, unknown>;
    verified: boolean;
    published: boolean;
    featured: boolean;
    categories: string[];
    tags: string[];
  };
  manifest: PluginSeedManifest;
  extensions: PluginSeedExtension[];
}

export const PLUGIN_SEEDS: PluginSeed[] = [
  {
    marketplace: {
      type: "app",
      name: "GDPR Compliance Plugin",
      description: "Manage data privacy compliance including consent tracking, data subject access requests, data retention policies, and right-to-erasure workflows. Helps you stay compliant with GDPR, CCPA, and other privacy regulations.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=gdpr&backgroundColor=indigo",
      config: {
        homepage: "https://oryn.ai/plugins/gdpr",
        repository: "https://github.com/oryn/plugins/gdpr",
        license: "MIT",
        readme: "# GDPR Compliance Plugin\n\nHelps manage data privacy compliance across your workspace.\n\n## Features\n\n- **Consent Management**: Track opt-in/opt-out for marketing, analytics, and communications\n- **Data Subject Requests**: Handle access, rectification, erasure, and portability requests\n- **Data Retention**: Automatically enforce retention policies per data category\n- **Audit Trail**: Full audit log of all privacy-related actions\n- **Impact Assessments**: Conduct and store Data Protection Impact Assessments\n\n## Getting Started\n\nInstall from the marketplace and configure your consent categories in the GDPR dashboard.",
        screenshots: [
          { url: "/screenshots/gdpr-dashboard.png", alt: "GDPR Dashboard Overview" },
          { url: "/screenshots/gdpr-consent.png", alt: "Consent Management" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-06-01", notes: "Initial release with consent management, data subject requests, and retention policies." },
        ],
      },
      verified: true,
      published: true,
      featured: true,
      categories: ["compliance", "security", "privacy"],
      tags: ["gdpr", "ccpa", "privacy", "consent", "data-protection"],
    },
    manifest: {
      name: "gdpr-compliance",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "GDPR compliance and data privacy management",
      entryPoint: "plugins/gdpr/index.ts",
      permissions: ["contacts:read", "contacts:write", "deals:read", "settings:write"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "gdpr-dashboard",
        config: {
          sidebarLabel: "GDPR Dashboard",
          sidebarIcon: "Shield",
          description: "Overview of GDPR compliance status and recent data subject requests.",
          sections: [
            {
              type: "stats",
              title: "Compliance Overview",
              stats: [
                { label: "Consent Rate", value: "87%", change: "+3.2%", icon: "CheckCircle" },
                { label: "Pending Requests", value: "12", change: "-2", icon: "Clock" },
                { label: "Data Exports", value: "45", change: "+8", icon: "Activity" },
                { label: "Retention Tasks", value: "6", change: "Due today", icon: "AlertCircle" },
              ],
            },
            {
              type: "activity",
              title: "Recent Data Subject Requests",
              items: [
                { title: "Data Export Request", description: "John Smith requested export of all personal data", status: "completed", date: "2 hours ago" },
                { title: "Right to Erasure", description: "Alice Johnson requested deletion of account data", status: "in-progress", date: "Yesterday" },
                { title: "Data Rectification", description: "Bob Williams requested correction of email address", status: "completed", date: "3 days ago" },
                { title: "Consent Withdrawal", description: "Carol Brown withdrew marketing consent", status: "completed", date: "5 days ago" },
                { title: "Access Request", description: "David Miller requested copy of all personal data", status: "pending", date: "1 week ago" },
              ],
            },
            {
              type: "table",
              title: "Active Consents by Category",
              columns: [
                { key: "category", label: "Category" },
                { key: "optIn", label: "Opt-In" },
                { key: "optOut", label: "Opt-Out" },
                { key: "rate", label: "Rate" },
                { key: "trend", label: "Trend" },
              ],
              rows: [
                { category: "Marketing Emails", optIn: "1,245", optOut: "186", rate: "87%", trend: "+3.2%" },
                { category: "Analytics Tracking", optIn: "1,102", optOut: "329", rate: "77%", trend: "+1.8%" },
                { category: "Third-Party Sharing", optIn: "892", optOut: "539", rate: "62%", trend: "-0.5%" },
                { category: "SMS Communications", optIn: "756", optOut: "675", rate: "53%", trend: "+5.1%" },
                { category: "Cookie Consent", optIn: "1,380", optOut: "51", rate: "96%", trend: "+0.2%" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "page",
        name: "consent-manager",
        config: {
          sidebarLabel: "Consent Manager",
          sidebarIcon: "CheckSquare",
          description: "Manage consent preferences across all contacts.",
          sections: [
            {
              type: "form",
              title: "Create Consent Record",
              formFields: [
                { name: "contactId", label: "Contact", type: "select", required: true, options: ["Search contacts..."] },
                { name: "category", label: "Consent Category", type: "select", required: true, options: ["Marketing", "Analytics", "Third-Party", "SMS", "Cookie"] },
                { name: "status", label: "Status", type: "select", required: true, options: ["Granted", "Withdrawn", "Expired"] },
                { name: "source", label: "Source", type: "select", required: true, options: ["Form", "Email", "API", "Manual", "Import"] },
                { name: "notes", label: "Notes", type: "text" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "export-user-data",
        config: { label: "Export User Data", description: "Export all personal data for a contact", method: "POST" },
      },
      {
        extensionType: "action",
        name: "anonymize-user",
        config: { label: "Anonymize User", description: "Anonymize personal data while retaining analytics", method: "POST" },
      },
      {
        extensionType: "action",
        name: "delete-user-data",
        config: { label: "Delete User Data", description: "Permanently delete all personal data for a contact", method: "POST" },
      },
      {
        extensionType: "model",
        name: "gdpr-consent",
        config: {
          entity: "contact",
          fields: [
            { name: "consentMarketing", type: "boolean", label: "Marketing Consent", defaultValue: false },
            { name: "consentAnalytics", type: "boolean", label: "Analytics Consent", defaultValue: true },
            { name: "consentThirdParty", type: "boolean", label: "Third-Party Sharing Consent", defaultValue: false },
            { name: "consentSms", type: "boolean", label: "SMS Consent", defaultValue: false },
            { name: "consentUpdatedAt", type: "date", label: "Consent Last Updated" },
            { name: "dataRetentionDate", type: "date", label: "Data Retention Expiry" },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "gdpr-contact-deleted",
        config: { events: ["contact.deleted"], url: "/api/plugins/gdpr-compliance/actions/handle-contact-deletion" },
      },
      {
        extensionType: "webhook",
        name: "gdpr-consent-change",
        config: { events: ["contact.updated"], url: "/api/plugins/gdpr-compliance/actions/track-consent-changes" },
      },
      {
        extensionType: "ai_tool",
        name: "find-personal-data",
        config: {
          label: "Find Personal Data",
          description: "Search contacts for personally identifiable information (PII)",
          handler: "findPersonalData",
          parameters: [
            { name: "query", type: "string", label: "Search query", required: true, description: "Email, name, phone, or other identifier" },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "gdpr-compliance-score",
        config: { label: "GDPR Compliance Score", description: "Overall GDPR compliance score", type: "metric", size: "sm" },
      },
      {
        extensionType: "widget",
        name: "pending-requests",
        config: { label: "Pending Data Requests", description: "Count of pending data subject requests", type: "metric", size: "sm" },
      },
    ],
  },

  {
    marketplace: {
      type: "app",
      name: "Email Analytics Pro",
      description: "Advanced email analytics with open/click tracking, send-time optimization, engagement scoring, and campaign performance dashboards. Integrates with email campaigns to provide real-time insights.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=email&backgroundColor=blue",
      config: {
        homepage: "https://oryn.ai/plugins/email-analytics",
        repository: "https://github.com/oryn/plugins/email-analytics",
        license: "MIT",
        readme: "# Email Analytics Pro\n\nAdvanced email analytics for your CRM campaigns.\n\n## Features\n\n- **Open & Click Tracking**: Real-time engagement metrics for every campaign\n- **Send-Time Optimization**: AI-powered recommendations for optimal send times\n- **Engagement Scoring**: Score contacts based on email interaction history\n- **Campaign Benchmarks**: Compare performance against industry averages\n- **Revenue Attribution**: Track revenue generated from email campaigns",
        screenshots: [
          { url: "/screenshots/email-analytics.png", alt: "Email Analytics Dashboard" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-05-15", notes: "Initial release with open/click tracking, engagement scoring, and campaign dashboards." },
        ],
      },
      verified: true,
      published: true,
      featured: true,
      categories: ["analytics", "email", "marketing"],
      tags: ["email", "analytics", "tracking", "campaigns", "engagement"],
    },
    manifest: {
      name: "email-analytics-pro",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "Advanced email analytics and engagement tracking",
      entryPoint: "plugins/email-analytics/index.ts",
      permissions: ["contacts:read", "marketing:read", "reports:read"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "email-analytics",
        config: {
          sidebarLabel: "Email Analytics",
          sidebarIcon: "BarChart3",
          description: "Campaign performance analytics and engagement metrics.",
          sections: [
            {
              type: "stats",
              title: "Campaign Performance",
              stats: [
                { label: "Avg Open Rate", value: "24.8%", change: "+2.1%", icon: "Activity" },
                { label: "Click Rate", value: "3.2%", change: "+0.8%", icon: "TrendingUp" },
                { label: "Sent This Month", value: "12,450", change: "+1,230", icon: "Send" },
                { label: "Bounce Rate", value: "1.2%", change: "-0.3%", icon: "TrendingDown" },
              ],
            },
            {
              type: "chart",
              title: "Email Performance Over Time",
              chartType: "bar",
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                { label: "Sent", data: [8500, 9200, 10100, 11000, 11800, 12450], color: "#3b82f6" },
                { label: "Opens", data: [2100, 2300, 2500, 2700, 2900, 3100], color: "#10b981" },
                { label: "Clicks", data: [280, 310, 340, 360, 390, 420], color: "#f59e0b" },
              ],
            },
            {
              type: "table",
              title: "Recent Campaigns",
              columns: [
                { key: "name", label: "Campaign" },
                { key: "sent", label: "Sent" },
                { key: "opens", label: "Opens" },
                { key: "clicks", label: "Clicks" },
                { key: "revenue", label: "Revenue" },
              ],
              rows: [
                { name: "June Newsletter", sent: "12,450", opens: "3,088 (24.8%)", clicks: "398 (3.2%)", revenue: "$12,450" },
                { name: "Product Launch", sent: "11,800", opens: "3,304 (28.0%)", clicks: "472 (4.0%)", revenue: "$28,320" },
                { name: "May Newsletter", sent: "11,000", opens: "2,640 (24.0%)", clicks: "330 (3.0%)", revenue: "$9,900" },
                { name: "Webinar Invite", sent: "10,100", opens: "2,727 (27.0%)", clicks: "404 (4.0%)", revenue: "$0" },
                { name: "April Promo", sent: "9,200", opens: "2,116 (23.0%)", clicks: "276 (3.0%)", revenue: "$18,400" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "generate-email-report",
        config: { label: "Generate Email Report", description: "Generate a comprehensive email analytics report", method: "POST" },
      },
      {
        extensionType: "action",
        name: "export-campaign-data",
        config: { label: "Export Campaign Data", description: "Export campaign analytics to CSV", method: "GET" },
      },
      {
        extensionType: "model",
        name: "email-engagement",
        config: {
          entity: "email",
          fields: [
            { name: "emailScore", type: "number", label: "Engagement Score", defaultValue: 0 },
            { name: "lastEngagedAt", type: "date", label: "Last Engaged" },
            { name: "emailFrequency", type: "select", label: "Preferred Frequency", options: ["daily", "weekly", "monthly", "never"] },
            { name: "totalOpens", type: "number", label: "Total Opens", defaultValue: 0 },
            { name: "totalClicks", type: "number", label: "Total Clicks", defaultValue: 0 },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "email-tracked",
        config: { events: ["email.sent", "email.opened", "email.clicked"], url: "/api/plugins/email-analytics-pro/actions/track" },
      },
      {
        extensionType: "ai_tool",
        name: "analyze-campaign",
        config: {
          label: "Analyze Campaign",
          description: "Analyze email campaign performance and provide insights",
          handler: "analyzeCampaign",
          parameters: [
            { name: "campaignId", type: "number", label: "Campaign ID", required: true, description: "The campaign to analyze" },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "open-rate-trend",
        config: { label: "Open Rate Trend", description: "Email open rate over time", type: "chart", chartType: "line", size: "md" },
      },
      {
        extensionType: "widget",
        name: "click-rate-chart",
        config: { label: "Click Rate Chart", description: "Email click rate over time", type: "chart", chartType: "line", size: "md" },
      },
      {
        extensionType: "widget",
        name: "send-volume",
        config: { label: "Send Volume", description: "Email send volume by month", type: "chart", chartType: "bar", size: "md" },
      },
      {
        extensionType: "widget",
        name: "best-send-time",
        config: { label: "Best Time to Send", description: "Optimal send time recommendations", type: "metric", size: "sm" },
      },
    ],
  },

  {
    marketplace: {
      type: "app",
      name: "Invoice Automation",
      description: "Automate recurring invoice generation, payment reminders, and revenue forecasting. Set up templates for subscriptions, retainer agreements, and installment plans.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=invoice&backgroundColor=emerald",
      config: {
        homepage: "https://oryn.ai/plugins/invoice-automation",
        repository: "https://github.com/oryn/plugins/invoice-automation",
        license: "MIT",
        readme: "# Invoice Automation\n\nAutomate your billing and invoicing workflows.\n\n## Features\n\n- **Recurring Templates**: Create invoice templates for subscriptions, retainers, and installments\n- **Auto-Generation**: Automatically generate invoices on schedule\n- **Payment Reminders**: Send automated reminders before and after due dates\n- **Revenue Forecasting**: Predict future revenue based on active recurring invoices\n- **Payment Tracking**: Monitor payment status and follow up automatically",
        screenshots: [
          { url: "/screenshots/invoice-automation.png", alt: "Invoice Automation Dashboard" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-04-20", notes: "Initial release with recurring templates, auto-generation, and payment reminders." },
        ],
      },
      verified: true,
      published: true,
      featured: false,
      categories: ["finance", "automation", "billing"],
      tags: ["invoices", "billing", "automation", "recurring", "revenue"],
    },
    manifest: {
      name: "invoice-automation",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "Recurring invoice automation and payment reminders",
      entryPoint: "plugins/invoices/index.ts",
      permissions: ["orders:read", "orders:write", "contacts:read", "settings:write"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "invoice-automation",
        config: {
          sidebarLabel: "Invoice Automation",
          sidebarIcon: "FileText",
          description: "Manage recurring invoice templates and automation settings.",
          sections: [
            {
              type: "stats",
              title: "Invoice Overview",
              stats: [
                { label: "Active Templates", value: "8", change: "+2", icon: "FileText" },
                { label: "Generated This Month", value: "156", change: "+12", icon: "Activity" },
                { label: "Payment Rate", value: "94%", change: "+1.5%", icon: "TrendingUp" },
                { label: "Outstanding", value: "$24,500", change: "-$3,200", icon: "AlertCircle" },
              ],
            },
            {
              type: "form",
              title: "Create Recurring Template",
              formFields: [
                { name: "templateName", label: "Template Name", type: "text", required: true },
                { name: "amount", label: "Amount", type: "number", required: true },
                { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD"] },
                { name: "frequency", label: "Frequency", type: "select", required: true, options: ["Weekly", "Monthly", "Quarterly", "Yearly"] },
                { name: "interval", label: "Interval", type: "number", required: true },
                { name: "contactId", label: "Bill To Contact", type: "select", required: true, options: ["Search contacts..."] },
              ],
            },
            {
              type: "table",
              title: "Recently Generated Invoices",
              columns: [
                { key: "number", label: "Invoice #" },
                { key: "contact", label: "Contact" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "dueDate", label: "Due Date" },
              ],
              rows: [
                { number: "INV-2026-0891", contact: "Acme Corp", amount: "$2,500", status: "Paid", dueDate: "Jun 15" },
                { number: "INV-2026-0890", contact: "Globex Inc", amount: "$5,000", status: "Sent", dueDate: "Jun 20" },
                { number: "INV-2026-0889", contact: "Initech", amount: "$1,200", status: "Overdue", dueDate: "Jun 1" },
                { number: "INV-2026-0888", contact: "Umbrella Co", amount: "$3,800", status: "Paid", dueDate: "Jun 10" },
                { number: "INV-2026-0887", contact: "Stark Industries", amount: "$10,000", status: "Draft", dueDate: "Jul 1" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "generate-recurring-invoices",
        config: { label: "Generate Recurring Invoices", description: "Generate all due recurring invoices", method: "POST" },
      },
      {
        extensionType: "action",
        name: "send-payment-reminders",
        config: { label: "Send Payment Reminders", description: "Send payment reminders for overdue invoices", method: "POST" },
      },
      {
        extensionType: "model",
        name: "invoice-settings",
        config: {
          entity: "invoice",
          fields: [
            { name: "autoGenerated", type: "boolean", label: "Auto-Generated", defaultValue: false },
            { name: "templateName", type: "string", label: "Template Name" },
            { name: "nextBillingDate", type: "date", label: "Next Billing Date" },
            { name: "recurringFrequency", type: "select", label: "Frequency", options: ["weekly", "monthly", "quarterly", "yearly"] },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "invoice-events",
        config: { events: ["invoice.created", "invoice.paid", "invoice.overdue"], url: "/api/plugins/invoice-automation/actions/handle" },
      },
      {
        extensionType: "ai_tool",
        name: "forecast-revenue",
        config: {
          label: "Forecast Revenue",
          description: "Predict future revenue from recurring invoices and active subscriptions",
          handler: "forecastRevenue",
          parameters: [
            { name: "months", type: "number", label: "Months to forecast", required: false, description: "Number of months to forecast (default: 3)" },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "pending-invoices",
        config: { label: "Pending Invoices", description: "Count of unpaid invoices", type: "metric", size: "sm" },
      },
      {
        extensionType: "widget",
        name: "revenue-forecast",
        config: { label: "Revenue Forecast", description: "Projected revenue from recurring invoices", type: "metric", size: "sm" },
      },
    ],
  },

  {
    marketplace: {
      type: "connector",
      name: "Social Media Publisher",
      description: "Schedule, publish, and analyze social media posts across multiple platforms. Create content calendars, auto-schedule posts, and track engagement metrics.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=social&backgroundColor=rose",
      config: {
        homepage: "https://oryn.ai/plugins/social-publisher",
        repository: "https://github.com/oryn/plugins/social-publisher",
        license: "MIT",
        readme: "# Social Media Publisher\n\nSchedule and publish social media content across platforms.\n\n## Features\n\n- **Multi-Platform**: Post to Twitter, LinkedIn, Facebook, and Instagram\n- **Content Calendar**: Visual calendar of scheduled and published posts\n- **Auto-Scheduling**: Optimal posting times based on engagement history\n- **Media Library**: Upload and manage images and videos\n- **Engagement Analytics**: Track likes, shares, comments, and reach\n- **AI Content Generation**: Generate post drafts from natural language prompts",
        screenshots: [
          { url: "/screenshots/social-publisher.png", alt: "Social Media Publisher" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-03-10", notes: "Initial release with Twitter and LinkedIn support." },
          { version: "1.1.0", date: "2026-04-15", notes: "Added Facebook and Instagram support, content calendar view." },
        ],
      },
      verified: true,
      published: true,
      featured: false,
      categories: ["social-media", "marketing", "content"],
      tags: ["social-media", "publishing", "content", "marketing", "scheduling"],
    },
    manifest: {
      name: "social-media-publisher",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "Multi-platform social media scheduling and publishing",
      entryPoint: "plugins/social/index.ts",
      permissions: ["contacts:read", "marketing:read", "settings:write"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "social-composer",
        config: {
          sidebarLabel: "Social Composer",
          sidebarIcon: "Share2",
          description: "Create and schedule social media posts across platforms.",
          sections: [
            {
              type: "form",
              title: "Create Post",
              formFields: [
                { name: "platform", label: "Platform", type: "select", required: true, options: ["Twitter", "LinkedIn", "Facebook", "Instagram"] },
                { name: "content", label: "Content", type: "text", required: true },
                { name: "mediaUrl", label: "Media URL", type: "text" },
                { name: "scheduleDate", label: "Schedule Date", type: "date" },
                { name: "scheduleTime", label: "Schedule Time", type: "text" },
              ],
            },
            {
              type: "stats",
              title: "Account Overview",
              stats: [
                { label: "Posts Published", value: "342", change: "+28", icon: "Activity" },
                { label: "Total Reach", value: "156K", change: "+12.5K", icon: "TrendingUp" },
                { label: "Engagement Rate", value: "4.2%", change: "+0.6%", icon: "TrendingUp" },
                { label: "Scheduled", value: "18", change: "Next 7 days", icon: "Clock" },
              ],
            },
            {
              type: "activity",
              title: "Recent Posts",
              items: [
                { title: "New Product Launch", description: "Excited to announce our latest feature release! Check out what's new.", status: "published", date: "2 hours ago" },
                { title: "Customer Success Story", description: "See how Acme Corp increased revenue by 40% using our platform.", status: "published", date: "Yesterday" },
                { title: "Industry Insights Thread", description: "5 trends shaping the future of CRM in 2026", status: "scheduled", date: "Tomorrow" },
                { title: "Team Spotlight", description: "Meet Sarah, our lead engineer working on AI features.", status: "draft", date: "3 days ago" },
                { title: "Weekly Tip", description: "Pro tip: Use automation rules to streamline your workflow.", status: "scheduled", date: "In 3 days" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "schedule-post",
        config: { label: "Schedule Post", description: "Schedule a social media post for later publishing", method: "POST" },
      },
      {
        extensionType: "action",
        name: "publish-now",
        config: { label: "Publish Now", description: "Immediately publish a social media post", method: "POST" },
      },
      {
        extensionType: "action",
        name: "get-post-insights",
        config: { label: "Get Post Insights", description: "Retrieve engagement analytics for a post", method: "GET" },
      },
      {
        extensionType: "model",
        name: "social-profile",
        config: {
          entity: "contact",
          fields: [
            { name: "socialFollowers", type: "number", label: "Social Followers", defaultValue: 0 },
            { name: "socialEngagement", type: "number", label: "Social Engagement Rate", defaultValue: 0 },
            { name: "socialPlatforms", type: "json", label: "Connected Platforms" },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "social-post-events",
        config: { events: ["social.post_published", "social.post_failed"], url: "/api/plugins/social-media-publisher/actions/handle" },
      },
      {
        extensionType: "ai_tool",
        name: "generate-social-content",
        config: {
          label: "Generate Social Content",
          description: "Generate social media post content from a brief description",
          handler: "generateContent",
          parameters: [
            { name: "topic", type: "string", label: "Topic", required: true, description: "What the post should be about" },
            { name: "platform", type: "select", label: "Platform", options: ["Twitter", "LinkedIn", "Facebook", "Instagram"], description: "Target platform" },
            { name: "tone", type: "select", label: "Tone", options: ["professional", "casual", "humorous", "inspirational"] },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "upcoming-posts",
        config: { label: "Upcoming Posts", description: "Scheduled posts for the next 7 days", type: "metric", size: "md" },
      },
      {
        extensionType: "widget",
        name: "engagement-overview",
        config: { label: "Engagement Overview", description: "Cross-platform engagement metrics", type: "chart", chartType: "bar", size: "md" },
      },
    ],
  },

  {
    marketplace: {
      type: "app",
      name: "Lead Scoring AI",
      description: "AI-powered lead scoring that analyzes deal attributes, contact behavior, and historical conversion patterns to predict lead quality and prioritize sales efforts.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=leadscore&backgroundColor=amber",
      config: {
        homepage: "https://oryn.ai/plugins/lead-scoring",
        repository: "https://github.com/oryn/plugins/lead-scoring",
        license: "MIT",
        readme: "# Lead Scoring AI\n\nAI-powered lead scoring to prioritize your sales efforts.\n\n## Features\n\n- **Predictive Scoring**: ML-based lead quality prediction\n- **Factor Analysis**: Understand why each lead scored the way it did\n- **Custom Models**: Train scoring models on your own conversion data\n- **Real-Time Updates**: Scores update as deal attributes change\n- **Segment Analysis**: Compare score distributions across segments\n- **Actionable Insights**: Get recommendations for improving lead quality",
        screenshots: [
          { url: "/screenshots/lead-scoring.png", alt: "Lead Scoring Dashboard" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-05-01", notes: "Initial release with predictive scoring, factor analysis, and segment breakdown." },
        ],
      },
      verified: true,
      published: true,
      featured: true,
      categories: ["ai", "sales", "analytics"],
      tags: ["lead-scoring", "ai", "sales", "predictive", "analytics"],
    },
    manifest: {
      name: "lead-scoring-ai",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "AI-powered lead scoring and predictive analytics",
      entryPoint: "plugins/lead-scoring/index.ts",
      permissions: ["contacts:read", "deals:read", "deals:write", "reports:read"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "lead-scoring",
        config: {
          sidebarLabel: "Lead Scoring",
          sidebarIcon: "Brain",
          description: "AI-powered lead scores and analytics.",
          sections: [
            {
              type: "stats",
              title: "Scoring Overview",
              stats: [
                { label: "Average Lead Score", value: "62", change: "+5", icon: "Brain" },
                { label: "High-Value Leads", value: "28", change: "+7", icon: "TrendingUp" },
                { label: "Scored This Month", value: "145", change: "+32", icon: "Activity" },
                { label: "Conversion Rate", value: "18.5%", change: "+2.1%", icon: "TrendingUp" },
              ],
            },
            {
              type: "chart",
              title: "Score Distribution",
              chartType: "pie",
              labels: ["Hot (80-100)", "Warm (60-79)", "Cool (40-59)", "Cold (0-39)"],
              datasets: [
                { label: "Leads", data: [28, 42, 35, 40], color: "#10b981" },
              ],
            },
            {
              type: "table",
              title: "Top Scored Leads",
              columns: [
                { key: "name", label: "Contact" },
                { key: "score", label: "Score" },
                { key: "source", label: "Source" },
                { key: "lastActivity", label: "Last Activity" },
                { key: "value", label: "Deal Value" },
              ],
              rows: [
                { name: "Acme Corp", score: "95", source: "Website", lastActivity: "Today", value: "$50,000" },
                { name: "TechStart Inc", score: "88", source: "Referral", lastActivity: "Yesterday", value: "$25,000" },
                { name: "Global Systems", score: "82", source: "Webinar", lastActivity: "2 days ago", value: "$75,000" },
                { name: "DataFlow Ltd", score: "79", source: "LinkedIn", lastActivity: "3 days ago", value: "$15,000" },
                { name: "CloudNine", score: "76", source: "Email Campaign", lastActivity: "1 week ago", value: "$35,000" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "recalculate-scores",
        config: { label: "Recalculate Scores", description: "Recalculate lead scores for all active deals", method: "POST" },
      },
      {
        extensionType: "action",
        name: "apply-scoring-model",
        config: { label: "Apply Scoring Model", description: "Apply a custom scoring model to deals", method: "POST" },
      },
      {
        extensionType: "model",
        name: "scoring-data",
        config: {
          entity: "deal",
          fields: [
            { name: "aiScore", type: "number", label: "AI Score", defaultValue: 0 },
            { name: "scoreFactors", type: "json", label: "Score Factors" },
            { name: "scoreUpdatedAt", type: "date", label: "Score Last Updated" },
            { name: "scoreCategory", type: "select", label: "Score Category", options: ["hot", "warm", "cool", "cold"] },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "score-changed",
        config: { events: ["deal.stage_changed", "deal.updated"], url: "/api/plugins/lead-scoring-ai/actions/recalculate" },
      },
      {
        extensionType: "ai_tool",
        name: "score-lead",
        config: {
          label: "Score Lead",
          description: "Analyze and score a lead with detailed explanations",
          handler: "scoreLead",
          parameters: [
            { name: "dealId", type: "number", label: "Deal ID", required: true, description: "The deal/lead to score" },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "score-distribution",
        config: { label: "Score Distribution", description: "Distribution of leads by score range", type: "chart", chartType: "pie", size: "md" },
      },
      {
        extensionType: "widget",
        name: "high-value-leads",
        config: { label: "High-Value Leads", description: "Count of leads with score > 80", type: "metric", size: "sm" },
      },
      {
        extensionType: "widget",
        name: "scoring-trends",
        config: { label: "Scoring Trends", description: "Average lead score over time", type: "chart", chartType: "line", size: "md" },
      },
    ],
  },

  {
    marketplace: {
      type: "extension",
      name: "Project Time Tracking",
      description: "Track time spent on projects and tasks with a built-in timer, timesheet management, billable hour tracking, and team productivity analytics.",
      version: "1.0.0",
      author: "Oryn Labs",
      publisher: "Oryn Marketplace",
      iconUrl: "https://api.dicebear.com/7.x/icons/svg?seed=timetrack&backgroundColor=violet",
      config: {
        homepage: "https://oryn.ai/plugins/time-tracking",
        repository: "https://github.com/oryn/plugins/time-tracking",
        license: "MIT",
        readme: "# Project Time Tracking\n\nTrack time, manage timesheets, and analyze team productivity.\n\n## Features\n\n- **One-Click Timer**: Start/stop timers for tasks with a single click\n- **Timesheet Management**: Weekly and monthly timesheet views\n- **Billable Hours**: Track billable vs non-billable time\n- **Team Dashboard**: See what your team is working on in real-time\n- **Reports**: Generate time reports by project, task, team member, and date range\n- **Integrations**: Time entries link to project tasks and tickets",
        screenshots: [
          { url: "/screenshots/time-tracking.png", alt: "Time Tracking Dashboard" },
        ],
        changelog: [
          { version: "1.0.0", date: "2026-04-01", notes: "Initial release with timer, timesheets, and team dashboard." },
        ],
      },
      verified: false,
      published: true,
      featured: false,
      categories: ["productivity", "projects", "hr"],
      tags: ["time-tracking", "productivity", "projects", "timesheet", "billable"],
    },
    manifest: {
      name: "project-time-tracking",
      version: "1.0.0",
      author: "Oryn Labs",
      description: "Time tracking and timesheet management for projects",
      entryPoint: "plugins/time-tracking/index.ts",
      permissions: ["projects:read", "projects:write", "employees:read", "reports:read"],
    },
    extensions: [
      {
        extensionType: "page",
        name: "time-tracking",
        config: {
          sidebarLabel: "Time Tracking",
          sidebarIcon: "Clock",
          description: "Track time, manage timesheets, and view team productivity.",
          sections: [
            {
              type: "stats",
              title: "This Week",
              stats: [
                { label: "Hours Logged", value: "142", change: "+12", icon: "Clock" },
                { label: "Active Timers", value: "5", change: "Running now", icon: "Activity" },
                { label: "Billable Hours", value: "118", change: "83%", icon: "TrendingUp" },
                { label: "Team Total", value: "12", change: "members", icon: "Activity" },
              ],
            },
            {
              type: "activity",
              title: "Recent Time Entries",
              items: [
                { title: "Frontend Development", description: "Implementing dashboard charts - 2.5h", status: "billable", date: "1 hour ago" },
                { title: "Client Meeting", description: "Weekly sync with Acme Corp - 1.0h", status: "billable", date: "3 hours ago" },
                { title: "Code Review", description: "Reviewing PR #342 - 1.5h", status: "billable", date: "Yesterday" },
                { title: "Internal Training", description: "New hire onboarding session - 2.0h", status: "non-billable", date: "Yesterday" },
                { title: "Bug Fixing", description: "Fixing login issue on staging - 0.5h", status: "billable", date: "2 days ago" },
              ],
            },
            {
              type: "table",
              title: "Team Overview",
              columns: [
                { key: "name", label: "Team Member" },
                { key: "hours", label: "Hours" },
                { key: "billable", label: "Billable" },
                { key: "idle", label: "Idle" },
                { key: "tasks", label: "Tasks" },
              ],
              rows: [
                { name: "Alice Chen", hours: "38", billable: "35", idle: "3", tasks: "4" },
                { name: "Bob Martinez", hours: "42", billable: "38", idle: "4", tasks: "6" },
                { name: "Carol Smith", hours: "36", billable: "30", idle: "6", tasks: "3" },
                { name: "David Kim", hours: "26", billable: "15", idle: "11", tasks: "5" },
                { name: "Eve Johnson", hours: "40", billable: "36", idle: "4", tasks: "7" },
              ],
            },
          ],
        },
      },
      {
        extensionType: "action",
        name: "start-timer",
        config: { label: "Start Timer", description: "Start a timer for a task", method: "POST" },
      },
      {
        extensionType: "action",
        name: "stop-timer",
        config: { label: "Stop Timer", description: "Stop the currently running timer", method: "POST" },
      },
      {
        extensionType: "action",
        name: "log-time",
        config: { label: "Log Time", description: "Manually log time against a task", method: "POST" },
      },
      {
        extensionType: "model",
        name: "project-time",
        config: {
          entity: "project",
          fields: [
            { name: "estimatedHours", type: "number", label: "Estimated Hours", defaultValue: 0 },
            { name: "trackedHours", type: "number", label: "Tracked Hours", defaultValue: 0 },
            { name: "billableRate", type: "number", label: "Billable Rate ($/hr)", defaultValue: 0 },
            { name: "billableHours", type: "number", label: "Billable Hours", defaultValue: 0 },
          ],
        },
      },
      {
        extensionType: "webhook",
        name: "timer-events",
        config: { events: ["task.created", "task.completed"], url: "/api/plugins/project-time-tracking/actions/handle" },
      },
      {
        extensionType: "ai_tool",
        name: "analyze-time-usage",
        config: {
          label: "Analyze Time Usage",
          description: "Analyze time allocation across projects and team members",
          handler: "analyzeTimeUsage",
          parameters: [
            { name: "projectId", type: "number", label: "Project ID", required: false, description: "Filter by project" },
            { name: "period", type: "select", label: "Period", options: ["week", "month", "quarter"], description: "Time period to analyze" },
          ],
        },
      },
      {
        extensionType: "widget",
        name: "time-breakdown",
        config: { label: "Time Breakdown", description: "Time allocation by project", type: "chart", chartType: "pie", size: "md" },
      },
      {
        extensionType: "widget",
        name: "weekly-hours",
        config: { label: "Weekly Hours", description: "Hours logged this week by day", type: "chart", chartType: "bar", size: "md" },
      },
      {
        extensionType: "widget",
        name: "active-timers",
        config: { label: "Active Timers", description: "Currently running timers count", type: "metric", size: "sm" },
      },
    ],
  },
];
