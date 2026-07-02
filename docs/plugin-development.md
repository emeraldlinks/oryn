# Oryn Plugin Development Guide

Build extensions for Oryn CRM using the Plugin SDK. Plugins can add pages, actions, data models, webhook subscriptions, AI tools, and dashboard widgets — all without modifying core code.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Plugin Manifest](#plugin-manifest)
- [Extension Points](#extension-points)
  - [Pages](#1-page-extensions)
  - [Actions](#2-action-extensions)
  - [Models](#3-model-extensions)
  - [Webhooks](#4-webhook-extensions)
  - [AI Tools](#5-ai-tool-extensions)
  - [Widgets](#6-widget-extensions)
- [Step-by-Step: Building a Plugin](#step-by-step-building-a-plugin)
- [Testing Your Plugin](#testing-your-plugin)
- [Publishing to the Marketplace](#publishing-to-the-marketplace)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Oryn Core                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Router   │  │  AI       │  │  Webhook     │  │
│  │          │  │  Engine   │  │  Dispatcher  │  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │              │               │           │
├───────┴──────────────┴───────────────┴───────────┤
│               Plugin SDK Runtime                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Registry │  │  Hooks   │  │  Permissions │  │
│  └────┬─────┘  └──────────┘  └──────────────┘  │
│       │                                           │
├───────┴───────────────────────────────────────────┤
│              Plugin Extensions                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Pages │ │Actions│ │Models│ │Webhooks│ │Widgets│ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
└───────────────────────────────────────────────────┘
```

Plugins are config-driven. You define your plugin's behavior via JSON configuration, and the Plugin SDK runtime interprets that configuration at runtime. There is no need to write TypeScript that runs inside the CRM — unless you are building a custom integration server.

### How Plugins Are Loaded

1. A user installs a plugin from the Marketplace
2. The plugin's extensions are stored in the database (`Plugin` + `PluginExtension` tables)
3. On each request, the `PluginRegistry` singleton loads enabled plugins for the workspace
4. Extensions are dispatched to the appropriate system (page router, action handler, AI engine, webhook dispatcher, dashboard renderer)

---

## Quick Start

### 1. Register your plugin in the Plugins admin page

Navigate to **Admin → Plugins → Register Plugin** and fill in:

- **Name**: Unique identifier (e.g., `my-analytics`)
- **Version**: Semver (e.g., `1.0.0`)
- **Author**: Your name or company
- **Description**: What your plugin does
- **Entry Point**: Optional reference to your plugin's entry file
- **Permissions**: Comma-separated (e.g., `contacts:read, deals:write, reports:read`)

### 2. Add extensions

Once the plugin is registered, add extensions under the **Extensions** tab:

- **Page** — A new page in the admin panel
- **Action** — An executable action (button or API-triggered)
- **Model** — Extra fields added to existing CRM entities
- **Webhook** — Subscribe to system events
- **AI Tool** — A tool the AI Assistant can invoke
- **Widget** — A dashboard widget

### 3. Test and publish

Test your plugin by enabling/disabling it from the Plugins page. Once ready, submit a Marketplace listing so other users can discover and install it.

---

## Plugin Manifest

When registering a plugin programmatically (via the API or a seed script), your manifest defines the plugin's metadata and extensions.

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "What my plugin does",
  "entryPoint": "plugins/my-plugin/index.ts",
  "permissions": ["contacts:read", "deals:write"]
}
```

### Supported Permission Scopes

| Permission | Description |
|-----------|-------------|
| `contacts:read` | Read contacts |
| `contacts:write` | Create and update contacts |
| `deals:read` | Read deals |
| `deals:write` | Create and update deals |
| `products:read` | Read products |
| `orders:read` | Read orders |
| `orders:write` | Create and update orders |
| `projects:read` | Read projects |
| `projects:write` | Create and update projects |
| `marketing:read` | Read marketing campaigns |
| `employees:read` | Read employee data |
| `reports:read` | Access reports and analytics |
| `settings:read` | Read workspace settings |
| `settings:write` | Modify workspace settings |

Use `contacts:*` wildcard to grant all permissions on a resource.

---

## Extension Points

### 1. Page Extensions

Pages appear in the admin sidebar and render custom UIs defined by a `sections` configuration array.

#### Page Config Structure

```json
{
  "sidebarLabel": "My Page",
  "sidebarIcon": "BarChart3",
  "description": "What this page does",
  "sections": [
    {
      "type": "stats",
      "title": "Overview Stats",
      "stats": [
        { "label": "Total Records", "value": "1,234", "change": "+5.2%", "icon": "Activity" },
        { "label": "Active Users", "value": "89", "change": "+12", "icon": "TrendingUp" }
      ]
    },
    {
      "type": "chart",
      "title": "Trends",
      "chartType": "bar",
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [
        { "label": "Series A", "data": [10, 20, 30], "color": "#3b82f6" }
      ]
    },
    {
      "type": "table",
      "title": "Recent Items",
      "columns": [
        { "key": "name", "label": "Name" },
        { "key": "status", "label": "Status" },
        { "key": "value", "label": "Value" }
      ],
      "rows": [
        { "name": "Item 1", "status": "Active", "value": "$100" },
        { "name": "Item 2", "status": "Pending", "value": "$200" }
      ]
    },
    {
      "type": "activity",
      "title": "Recent Activity",
      "items": [
        { "title": "Action performed", "description": "Details about what happened", "status": "completed", "date": "2 hours ago" }
      ]
    },
    {
      "type": "form",
      "title": "Quick Action",
      "formFields": [
        { "name": "fieldName", "label": "Field Label", "type": "text", "required": true }
      ]
    }
  ]
}
```

#### Section Types Reference

| Type | Render | Fields |
|------|--------|--------|
| `stats` | Grid of stat cards with icon, value, label, change indicator | `stats[]` with `{label, value, change?, icon?}` |
| `chart` | Visual bar representation (labeled with values) | `chartType`, `labels[]`, `datasets[]` |
| `table` | HTML table with striped rows | `columns[]`, `rows[]` |
| `activity` | Vertical timeline with status badges | `items[]` with `{title, description, status?, date?}` |
| `form` | Input fields with submit button | `formFields[]` with `{name, label, type, required?, options?}` |
| `hero` | Hero card with title and description | `title`, `description` |

#### Supported Icons for sidebarIcon

Use any Lucide icon name: `BarChart3`, `Shield`, `Globe`, `Brain`, `Clock`, `FileText`, `Share2`, `Activity`, `Users`, `Settings`, `Database`, `Zap`, `Layout`, `Puzzle`.

#### Page Route

Pages are served at: `/admin/plugins/{pluginName}/{pageName}`

---

### 2. Action Extensions

Actions are executable operations that can be triggered from the plugin detail page or from other systems (webhooks, AI tools).

#### Action Config

```json
{
  "label": "Generate Report",
  "description": "Generates a comprehensive analytics report",
  "method": "POST",
  "webhookUrl": "https://my-server.com/plugins/generate-report"
}
```

Actions can optionally forward to an external `webhookUrl`. When no `webhookUrl` is provided, the action is recorded as a `BackgroundJob` for monitoring.

#### Triggering Actions

**From the UI:** Navigate to the plugin detail page, click the Actions tab, and click "Run Action".

**From the API:**
```bash
curl -X POST http://localhost:3000/api/plugins/{pluginName}/actions/{actionName} \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"workspaceId": 1}'
```

---

### 3. Model Extensions

Model extensions add custom fields to existing CRM entities (Contact, Deal, Invoice, Project, Email). These fields appear in forms and API responses alongside built-in fields.

#### Model Config

```json
{
  "entity": "contact",
  "fields": [
    { "name": "loyaltyPoints", "type": "number", "label": "Loyalty Points", "defaultValue": 0 },
    { "name": "memberTier", "type": "select", "label": "Membership Tier", "options": ["bronze", "silver", "gold", "platinum"] },
    { "name": "lastPurchaseDate", "type": "date", "label": "Last Purchase Date" },
    { "name": "isVip", "type": "boolean", "label": "VIP Customer", "defaultValue": false },
    { "name": "preferences", "type": "json", "label": "Customer Preferences" }
  ]
}
```

#### Supported Field Types

| Type | Description |
|------|-------------|
| `string` | Text value |
| `number` | Numeric value |
| `boolean` | True/false toggle |
| `date` | Date picker |
| `select` | Dropdown with options |
| `json` | JSON object storage |

#### Supported Entities

| Entity | Model |
|--------|-------|
| `contact` | Contact |
| `deal` | Deal |
| `invoice` | Invoice |
| `project` | Project |
| `email` | Email |

Plugin fields are merged with built-in fields at query time via `getMergedFields()` from the Model Merger utility.

---

### 4. Webhook Extensions

Webhook extensions subscribe to system events. When an event fires, the plugin's webhook URL is called with the event payload.

#### Webhook Config

```json
{
  "events": ["contact.created", "deal.stage_changed"],
  "url": "https://my-server.com/webhooks/oryn",
  "headers": {
    "Authorization": "Bearer my-secret-token"
  },
  "retryCount": 3
}
```

#### Available Events

| Event | Fires When |
|-------|-----------|
| `contact.created` | A new contact is created |
| `contact.updated` | A contact is updated |
| `contact.deleted` | A contact is deleted |
| `deal.created` | A new deal is created |
| `deal.stage_changed` | A deal's stage changes |
| `deal.updated` | A deal is updated |
| `invoice.created` | A new invoice is created |
| `invoice.paid` | An invoice is marked paid |
| `invoice.overdue` | An invoice becomes overdue |
| `email.sent` | An email is sent |
| `email.opened` | An email is opened |
| `email.clicked` | A link in an email is clicked |
| `task.created` | A project task is created |
| `task.completed` | A project task is completed |
| `ticket.created` | A support ticket is created |

Webhook deliveries are recorded in the `WebhookDelivery` table with full request/response logging and automatic retry scheduling.

---

### 5. AI Tool Extensions

AI tools extend the AI Assistant's capabilities. When a user asks the AI to perform a task, it can invoke plugin-defined tools.

#### AI Tool Config

```json
{
  "label": "Calculate Engagement Score",
  "description": "Calculate an engagement score for a contact based on their interaction history",
  "handler": "calculateEngagement",
  "parameters": [
    { "name": "contactId", "type": "number", "label": "Contact ID", "required": true, "description": "The contact to calculate score for" },
    { "name": "period", "type": "select", "label": "Time Period", "options": ["30d", "90d", "all"], "description": "Analysis period" }
  ]
}
```

#### How AI Tools Are Invoked

1. User asks the AI Assistant: "What's the engagement score for John Smith?"
2. The AI detects the intent and resolves the `calculateEngagement` tool
3. The system calls `POST /api/plugins/{pluginName}/actions/{handler}` with the parameters
4. The result is returned to the AI, which presents it to the user

#### Parameter Types

| Type | Widget |
|------|--------|
| `string` | Text input |
| `number` | Number input |
| `boolean` | Toggle |
| `select` | Dropdown |

---

### 6. Widget Extensions

Widgets appear in the Custom Dashboard builder. Users can add them to their dashboards alongside built-in widgets.

#### Widget Config

```json
{
  "label": "Engagement Score Trend",
  "description": "Shows how engagement scores change over time",
  "type": "chart",
  "chartType": "line",
  "size": "md",
  "refreshInterval": 300
}
```

#### Supported Widget Types

| Type | Description |
|------|-------------|
| `metric` | Single number display |
| `chart` | Chart (bar, line, pie, area) |
| `table` | Data table |
| `custom` | Custom rendered widget |

#### Available Sizes

| Size | Width |
|------|-------|
| `sm` | 1 column |
| `md` | 2 columns |
| `lg` | 3 columns |
| `xl` | Full width |

Widgets are discoverable via `GET /api/plugins/widgets` which returns all available widgets (built-in + plugin).

---

## Step-by-Step: Building a Plugin

Let's build a "Customer Health Score" plugin from scratch.

### Step 1: Plan your plugin

| Aspect | Decision |
|--------|----------|
| Name | `customer-health` |
| Description | Calculates and displays customer health scores based on engagement, support tickets, and payment history |
| Permissions | `contacts:read`, `deals:read`, `reports:read` |

### Step 2: Register the plugin

Navigate to **Admin → Plugins → Register Plugin** and enter:

```
Name: customer-health
Version: 1.0.0
Author: Your Name
Description: Customer health scoring based on engagement, support, and payments
Permissions: contacts:read, deals:read, reports:read
```

### Step 3: Add extensions

#### 3a. Add a Page — Health Dashboard

Extension type: `Page`
Name: `health-dashboard`

```json
{
  "sidebarLabel": "Health Scores",
  "sidebarIcon": "Activity",
  "description": "Customer health overview and scoring dashboard.",
  "sections": [
    {
      "type": "stats",
      "title": "Health Overview",
      "stats": [
        { "label": "Healthy Customers", "value": "156", "change": "+12", "icon": "TrendingUp" },
        { "label": "At Risk", "value": "23", "change": "-5", "icon": "TrendingDown" },
        { "label": "Churned", "value": "8", "change": "+2", "icon": "AlertCircle" },
        { "label": "Avg Health Score", "value": "74", "change": "+3.2%", "icon": "Activity" }
      ]
    },
    {
      "type": "chart",
      "title": "Score Distribution",
      "chartType": "pie",
      "labels": ["Healthy (70-100)", "Needs Attention (40-69)", "At Risk (0-39)"],
      "datasets": [
        { "label": "Customers", "data": [156, 23, 8], "color": "#10b981" }
      ]
    },
    {
      "type": "table",
      "title": "Customers Needing Attention",
      "columns": [
        { "key": "name", "label": "Customer" },
        { "key": "score", "label": "Score" },
        { "key": "reason", "label": "Top Factor" },
        { "key": "lastActivity", "label": "Last Activity" }
      ],
      "rows": [
        { "name": "Acme Corp", "score": "38", "reason": "No activity 60+ days", "lastActivity": "Mar 15" },
        { "name": "Globex Inc", "score": "42", "reason": "3 open tickets", "lastActivity": "Mar 28" },
        { "name": "Initech", "score": "55", "reason": "Payment overdue", "lastActivity": "Apr 2" }
      ]
    }
  ]
}
```

#### 3b. Add a Model — Health Score Fields

Extension type: `Model`
Name: `health-data`

```json
{
  "entity": "contact",
  "fields": [
    { "name": "healthScore", "type": "number", "label": "Health Score", "defaultValue": 100 },
    { "name": "healthCategory", "type": "select", "label": "Health Category", "options": ["healthy", "needs-attention", "at-risk", "churned"] },
    { "name": "lastHealthUpdate", "type": "date", "label": "Last Health Score Update" },
    { "name": "riskFactors", "type": "json", "label": "Risk Factors" }
  ]
}
```

#### 3c. Add an Action — Recalculate Scores

Extension type: `Action`
Name: `recalculate-health`

```json
{
  "label": "Recalculate Health Scores",
  "description": "Recalculate health scores for all contacts based on current data",
  "method": "POST"
}
```

#### 3d. Add a Webhook — Auto-recalculate

Extension type: `Webhook`
Name: `auto-recalculate`

```json
{
  "events": ["contact.updated", "ticket.created", "invoice.paid"],
  "url": "https://my-server.com/plugins/health/recalculate"
}
```

#### 3e. Add an AI Tool — Analyze Health

Extension type: `AI Tool`
Name: `analyze-health`

```json
{
  "label": "Analyze Customer Health",
  "description": "Analyze a customer's health score and provide recommendations",
  "handler": "analyzeHealth",
  "parameters": [
    { "name": "contactId", "type": "number", "label": "Contact ID", "required": true, "description": "The customer to analyze" }
  ]
}
```

#### 3f. Add Widgets

Extension type: `Widget`
Name: `health-score-gauge`

```json
{
  "label": "Health Score Gauge",
  "description": "Average customer health score",
  "type": "metric",
  "size": "sm"
}
```

Extension type: `Widget`
Name: `at-risk-count`

```json
{
  "label": "At-Risk Customers",
  "description": "Count of customers with health scores below 40",
  "type": "metric",
  "size": "sm"
}
```

### Step 4: Enable and test

Toggle the plugin to "Enabled" on the Plugins page. The "Health Scores" page will appear in the sidebar. Navigate to it to see your dashboard.

### Step 5: Publish to Marketplace

See [Publishing to the Marketplace](#publishing-to-the-marketplace) below.

---

## Testing Your Plugin

### Manual Testing Checklist

| Feature | How to Test |
|---------|-------------|
| **Page** | Navigate to `/admin/plugins/{name}/{page}` — verify all sections render correctly |
| **Action** | Go to plugin detail → Actions tab → click "Run Action" — verify job is created |
| **Model** | Check the entity in API response — verify plugin fields appear |
| **Webhook** | Trigger the event (e.g., create a contact) — verify BackgroundJob is created |
| **AI Tool** | Ask the AI Assistant to use the tool — verify it resolves and dispatches |
| **Widget** | Go to Custom Dashboards → add widget — verify it appears in the picker |
| **Permissions** | Try accessing a restricted resource — verify the permission check works |

---

## Publishing to the Marketplace

### Prerequisites

1. Your plugin is fully tested and working
2. You have an icon (square, at least 128x128px)
3. You have a readme written in Markdown

### Step 1: Prepare your plugin package

Create a manifest with all marketplace metadata:

```json
{
  "type": "app",
  "name": "Customer Health Score",
  "description": "Calculates and displays customer health scores...",
  "version": "1.0.0",
  "author": "Your Name",
  "publisher": "Your Company",
  "iconUrl": "https://example.com/icons/health.png",
  "verified": false,
  "featured": false,
  "categories": ["analytics", "customer-success"],
  "tags": ["health-score", "churn", "analytics", "customer-success"],
  "config": {
    "homepage": "https://example.com/plugins/health",
    "repository": "https://github.com/you/health-plugin",
    "license": "MIT",
    "readme": "# Customer Health Score\n\nFull readme content here in Markdown...",
    "screenshots": [
      { "url": "https://example.com/screenshots/dashboard.png", "alt": "Dashboard" }
    ],
    "changelog": [
      { "version": "1.0.0", "date": "2026-06-15", "notes": "Initial release" }
    ]
  }
}
```

### Step 2: Publish via API

```bash
curl -X POST http://localhost:3000/api/admin/marketplace \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "type": "app",
    "name": "Customer Health Score",
    "description": "Calculates and displays customer health scores...",
    "version": "1.0.0",
    "author": "Your Name",
    "publisher": "Your Company",
    "iconUrl": "https://example.com/icons/health.png",
    "categories": ["analytics", "customer-success"],
    "tags": ["health-score", "churn"],
    "config": { ... }
  }'
```

### Step 3: Verify your listing

Navigate to **Admin → Marketplace** and search for your plugin. Verify:

- Icon, name, publisher, and description display correctly
- Rating and install count start at 0
- Categories appear in the sidebar filter
- Search by name or tag returns your plugin
- Featured flag shows your plugin in the featured section (admin only)

### Step 4: Install and test the full flow

```bash
curl -X POST http://localhost:3000/api/admin/marketplace/1/install \
  -H "Cookie: next-auth.session-token=..."
```

Verify the plugin appears in Admin → Plugins with all its extensions.

---

## API Reference

### Plugin Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/plugins` | GET | List all plugins for workspace |
| `/api/admin/plugins` | POST | Register a new plugin |
| `/api/admin/plugins` | PUT | Update plugin settings |
| `/api/admin/plugins` | DELETE | Remove a plugin |
| `/api/admin/plugin-extensions` | GET | List extensions (filter by `?pluginId=`, `?type=`) |
| `/api/admin/plugin-extensions` | POST | Add an extension |

### Plugin Runtime

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plugins/registry` | GET | Get all loaded plugins with extensions |
| `/api/plugins/{name}/actions/{action}` | POST | Execute a plugin action |
| `/api/plugins/{name}/install` | POST | Install plugin from manifest |
| `/api/plugins/upload` | POST | Upload plugin package (manifest + extensions) |
| `/api/plugins/dispatch-webhook` | POST | Dispatch event to plugin webhooks |
| `/api/plugins/widgets` | GET | Get all available widgets (built-in + plugin) |

### Marketplace

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/marketplace` | GET | List marketplace listings (search, filter, sort, paginate) |
| `/api/admin/marketplace` | POST | Create a new listing |
| `/api/admin/marketplace/{id}` | GET | Get listing details |
| `/api/admin/marketplace/{id}` | PUT | Update a listing |
| `/api/admin/marketplace/{id}` | DELETE | Remove a listing |
| `/api/admin/marketplace/{id}/install` | POST | Install a marketplace item |
| `/api/admin/marketplace/{id}/reviews` | GET | List reviews |
| `/api/admin/marketplace/{id}/reviews` | POST | Submit a review |
| `/api/admin/marketplace/featured` | GET | Get featured listings |
| `/api/admin/marketplace/categories` | GET | Get categories with counts |
| `/api/admin/installed` | GET | List installed items for workspace |
| `/api/admin/installed` | POST | Install (alternative endpoint) |
| `/api/admin/installed/{id}` | PUT | Update installed item settings |
| `/api/admin/installed` | DELETE | Uninstall |

### Seeding Default Plugins

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/setup/seed-plugins` | POST | Seed marketplace with default plugins (`?workspaceId=X` to auto-install) |

---

## Best Practices

### Design

- **One purpose per plugin.** A plugin that does one thing well is better than a plugin that does ten things poorly.
- **Use meaningful names.** Plugin names should clearly convey what they do. "Email Analytics Pro" > "Email Stuff."
- **Provide rich page configs.** Dashboards with stats, charts, and tables are more useful than a single text page.
- **Include AI tools.** AI-powered plugins are more discoverable and provide more value through natural language interaction.

### Development

- **Test each extension independently.** Before publishing, verify pages render, actions execute, models appear, webhooks fire, AI tools resolve, and widgets display.
- **Use proper permissions.** Request only the permissions your plugin actually needs. Never request `contacts:write` if you only need `contacts:read`.
- **Version your plugin.** Increment the version number when making changes. Maintain a changelog so users know what changed.
- **Keep plugin names unique.** Your plugin's `name` must be unique within its workspace. Use a prefix like `yourcompany-pluginname`.

### Marketplace

- **Write a good readme.** Explain what your plugin does, how to configure it, and any dependencies. Use Markdown formatting.
- **Add screenshots.** Show your plugin in action. Include screenshots of pages, widgets, and AI tool results.
- **Choose categories wisely.** Pick the most relevant category. A plugin can belong to multiple categories.
- **Use descriptive tags.** Tags make your plugin discoverable in search. Include synonyms and related terms.
- **Respond to reviews.** When users leave reviews, address their feedback. Update your plugin based on user input.

### Performance

- **Keep config sizes reasonable.** Large page configs with hundreds of rows or stats may impact load times. Aim for under 50KB per config.
- **Use events wisely.** Subscribing to many events creates many webhook jobs. Only subscribe to events your plugin needs.
- **Set reasonable retry counts.** For webhook extensions, 3 retries is the default. Increase only if your endpoint is occasionally unavailable.

### Security

- **Validate all inputs.** Your webhook endpoints should validate incoming payloads.
- **Use HTTPS for webhook URLs.** Never send sensitive data over unencrypted connections.
- **Rotate secrets.** If your plugin uses API keys or tokens, support rotation.
- **Handle errors gracefully.** Your webhook endpoint should return appropriate HTTP status codes (200 for success, 4xx/5xx for errors).

---

## Example Plugins

Six default plugins ship with Oryn and are available in the Marketplace after seeding:

| Plugin | Category | Features |
|--------|----------|----------|
| [GDPR Compliance Plugin](#) | Compliance | Consent tracking, data subject requests, retention policies |
| [Email Analytics Pro](#) | Analytics | Open/click tracking, engagement scoring, send-time optimization |
| [Invoice Automation](#) | Finance | Recurring templates, auto-generation, payment reminders |
| [Social Media Publisher](#) | Marketing | Multi-platform scheduling, content calendar, AI generation |
| [Lead Scoring AI](#) | AI/ML | Predictive scoring, factor analysis, custom models |
| [Project Time Tracking](#) | Productivity | One-click timer, timesheets, billable tracking |

These are defined in `src/seed/plugins.ts` and can serve as templates for your own plugins.

---

## Need Help?

- Browse existing plugins in the Marketplace for inspiration
- Check the Plugin SDK source at `src/lib/plugin-system/`
- Review seed plugin examples at `src/seed/plugins.ts`
