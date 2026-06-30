# Oryn — All-in-One CRM Platform

## Overview
Oryn is a full-stack CRM platform (HubSpot/Zoho alternative) built with Next.js 14, SlintORM (PostgreSQL), NextAuth, and shadcn/ui. 47 database models, 53 REST API routes, 18 admin pages, and an embeddable widget for external sites.

---

## Database Models (47)

| Module | Models |
|--------|--------|
| **Core** | Workspace, User, Branch |
| **CRM** | Contact, Deal, Activity |
| **Products & Orders** | Product, Order, OrderItem, Invoice |
| **HR** | Employee, Attendance, LeaveRequest |
| **Marketing** | EmailCampaign, EmailTemplate, LandingPage, Form, FormSubmission |
| **Social** | SocialAccount, SocialPost, SocialReply, AdCampaign |
| **WordPress** | WordpressSite, WordpressPost |
| **Communications** | Message, Call, Meeting |
| **Support** | Ticket, TicketMessage |
| **Documents** | Document |
| **Notifications** | Notification, AuditLog |
| **Custom Fields** | CustomFieldDef, CustomFieldValue |
| **Automation** | Workflow, EmailSync |
| **Live Chat** | LiveChatSettings, ChatMessage |
| **Project Management** | Project, ProjectTask, ProjectMilestone |
| **AI & Bots** | Bot, WidgetSettings, AIApiKey, AIConversation, AIAction, BotConnection |

---

## Authentication & Authorization

- **NextAuth v4** with 3 providers: Google OAuth, Facebook OAuth, Credentials (email/password)
- JWT session with `id`, `role`, `workspaceId` attached
- **5 roles**: superadmin, admin, manager, employee, client
- Middleware enforces role-based route access with redirects
- Public paths excluded: `/login`, `/register`, `/forgot-password`, `/api/auth/*`
- Registration API creates workspace + superadmin user

---

## CRM Module

### Contacts
- Full CRUD with preloaded relations
- Source tracking (direct, referral, social, email, call, website)
- Status workflow: lead → active → qualified → inactive → unsubscribed
- Deal score calculation
- Custom fields support (entity-attribute-value pattern)
- CSV import & export
- Contact detail page with timeline (activities, tickets, calls, meetings)
- Duplicate detection & merge (email + name/company fuzzy match)

### Deals
- Full CRUD with pipeline stage tracking
- 6 stages: lead → qualified → proposal → negotiation → closed-won → closed-lost
- Probability scoring per stage
- Stage transition with auto-logged activity + notification to assignee
- Pipeline forecasting API (stage-weighted + assignee breakdown)
- Kanban board with drag-and-drop (dnd-kit)

### Activities
- Unified timeline logging (call, email, meeting, task, note, deal-status-change, social)
- Linked to contacts, deals, and users

### Custom Fields
- Dynamic field definitions per entity type (contact, deal, ticket, order, product)
- Field types: text, number, date, select, boolean
- CustomFieldDef + CustomFieldValue tables (EAV pattern)

---

## Products & Orders

### Products
- CRUD with SKU, price, stock tracking, categories
- Service toggle (physical vs service products)

### Orders
- Full lifecycle: pending → confirmed → processing → shipped → delivered → cancelled → refunded
- Line items with product references
- Automatic invoice generation

### Invoices
- Status: draft → sent → paid → overdue → cancelled
- Invoice numbering, PDF URL tracking

---

## HR & Branch Management

### Employees
- Employee profiles linked to User accounts
- Department, job title, salary, branch assignment

### Attendance
- Clock in/out tracking with notes

### Leave Requests
- Types: vacation, sick, personal, other
- Approval workflow (pending → approved/rejected/cancelled)

### Branches
- Multi-location support with address, phone, manager assignment

---

## Marketing

### Email Campaigns
- Name, subject, HTML body, scheduled sending
- Status: draft → scheduled → sending → sent → failed
- Open & click tracking via transparent 1×1 pixel
- Recipient targeting with filter JSON

### Email Templates
- Reusable templates with subject + HTML body
- Variable injection support
- Status: active/archived

### Landing Pages
- Slug-based routing, drag-and-drop JSON content
- View & conversion tracking

### Forms
- Dynamic JSON field definitions
- Submission tracking with contact linking

---

## Communications

### Unified Inbox
- Multi-channel messages (email, chat, SMS)
- Direction tracking (inbound/outbound)
- Read/delivery status

### Calls
- Inbound/outbound logging
- Duration, recording URL, transcript, sentiment analysis
- Contact & user linking

### Meetings
- Scheduled with title, duration, URL
- Status: scheduled → ongoing → completed → cancelled
- Linked to contacts and deals

### Email Sync
- Gmail/Outlook inbox sync config per user
- OAuth token management (access + refresh)

### Bulk Email Send
- Nodemailer SMTP integration
- Open tracking pixel injection

### SMS / WhatsApp
- Twilio integration
- Outbound message logging

---

## Support / Ticketing

- Full ticket lifecycle: open → waiting → answered → resolved → closed
- Priority levels: low, medium, high, urgent
- Assignee assignment
- Ticket messages with client/agent indicator

---

## Live Chat

- Real-time messaging with visitor tracking
- Chat widget config (color, welcome message, email collection, agent names)
- Embeddable widget for external websites (`public/widget.js`)
- Visitor ID tracking via localStorage
- Admin chat management page with conversation list

---

## Social Media Management

### Connected Accounts
- Platform support: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube
- OAuth token management with refresh

### Posts
- Post composer with media URLs, character count
- Status: draft → scheduled → published → failed
- Content calendar with monthly aggregation view
- Engagement metrics (likes, comments, shares, reach)

### Replies
- Comment tracking with reply composition

### Ad Campaigns
- Objective, budget, spent tracking
- Impressions, clicks, conversions

---

## WordPress

### Site Management
- Connect WordPress sites via Application Password (Basic Auth)
- Site name, URL tracking

### Posts
- Create/manage posts with HTML content
- Categories, tags, featured images
- AI draft generation
- Status: draft → scheduled → published → failed

---

## Project Management

### Projects
- Full CRUD with name, description, tags
- Status: active, on hold, completed, cancelled
- Priority: low, medium, high, urgent
- Owner assignment, start/end dates

### Tasks
- Kanban status: todo → in_progress → review → done
- Subtasks support (parentTaskId)
- Assignee + milestone linking
- Estimated vs actual hours tracking

### Milestones
- Due-date-based milestones with completion tracking
- Progress calculated from completed tasks

### Admin Page
- Kanban board view + DataTable toggle
- Detail panel with task lanes and milestone progress bars

---

## Documents & E-Sign

- Document types with JSON content
- Status: draft → final → sent → signed → expired
- PDF URL storage
- Linked to contacts and deals

---

## Automation Engine

### Workflows
- Trigger types: contact.created, deal.stage_changed, deal.created, form.submitted, email.opened, ticket.created
- Actions: create_activity, update_field, notify_user, create_deal, webhook
- Conditional trigger configuration (JSON)
- Active/paused toggle, run count tracking
- Visual workflow builder UI

### Trigger Execution
- Single POST endpoint checks all active workflows matching event
- Executes actions in sequence
- Used by CRM mutation APIs

---

## AI Assistant

### Conversational AI
- Chat interface with message history
- Provider selection: GPT-4, Gemini, DeepSeek, Claude, Qwen, Kimi, NVIDIA, OpenCode
- Intent detection from natural language
- Action confirmation flow (detect → confirm → execute)

### Supported Actions
- create_contact, create_deal, update_deal_stage
- send_email, create_activity, create_ticket
- create_notification, list_contacts, list_deals
- get_forecast, create_project, list_projects

### API Key Management
- Per-user and workspace-level API keys
- 8 providers supported: OpenAI, Gemini, DeepSeek, Claude, Qwen, Kimi, NVIDIA, OpenCode
- Active/inactive toggle, masked display

---

## Bot Connections (External AI Bots)

Users connect external AI bots (Claude connectors, Perplexity, Make.com, Zapier, OpenAI Assistant, custom) to perform tasks via scoped API key authentication.

- Auto-generated API key (`oryn_` prefix) + secret (`sk-` prefix)
- Provider types: claude_connector, perplexity, custom, openai_assistant, make.com, zapier
- Scoped permissions: individual action-level allowlist per connection
- Key rotation endpoint
- Public `/api/bot-actions` endpoint authenticates via `X-API-Key` header using `crypto.timingSafeEqual`
- Full audit trail via AIAction records with botConnectionId
- Developer dashboard with one-time secret display, masked keys, copy buttons

---

## Chatbot Automation (Bots)

- Channel support: chat, email, social, slack, whatsapp
- AI model: keyword matching or AI provider (OpenAI, Gemini, DeepSeek, Claude, Qwen, Kimi)
- Trigger keyword configuration
- Response template with variable interpolation
- Test modal for simulating bot responses
- Active/inactive toggle

---

## Embeddable Widget

- Standalone vanilla JS widget (`public/widget.js`) — no framework dependencies
- Configuration via HTML data attributes: `data-workspace-id`, `data-primary-color`, `data-welcome-message`
- UUID v4 visitor tracking via localStorage
- 3-second polling for new messages
- Mobile-responsive inline CSS
- Welcome message, color customization
- CORS-enabled API endpoint at `/api/widget/embed`

---

## Web Tracking

- Embeddable JS snippet for external websites
- Tracks page views by domain + page path
- Visitor session tracking

---

## Notifications & Search

### Real-time Notifications
- CRUD API with mark-read / mark-all-read
- Bell dropdown in Topbar with unread count
- Type-based notifications (deal update, assignment, etc.)

### Global Search
- Unified search across contacts, deals, products, tickets
- Type-ahead dropdown in Topbar
- Role-scoped results

---

## Reports & Analytics

### Pipeline Forecasting
- Stage-weighted deal analysis
- Assignee breakdown
- Win rate calculation

### Dashboard Charts (Recharts)
- Revenue over time (area chart)
- Deals by stage (pie chart)
- Team performance (bar chart)
- Deal conversion funnel
- Pipeline value

### Custom Report Builder
- Entity selection
- Metric/group configuration
- Visualization type selection

---

## Roles & Permissions

- Role-based permission map per entity (contacts, deals, products, orders, invoices, tickets, email, reports, automation, settings)
- 4 roles × 10 entities permission matrix
- Permission levels: Read, Own, Write
- Visual permission table in Settings

---

## Billing

- Plan comparison (Starter, Growth, Scale, Enterprise)
- Feature list per plan
- Upgrade flow

## Client Portal

- Orders view
- Invoices view
- Support tickets
- Documents with e-sign
- Privacy & GDPR page

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Database** | PostgreSQL via SlintORM v1.1.5 (pg driver) |
| **ORM** | SlintORM with 47 annotated model interfaces |
| **Auth** | NextAuth.js v4 (Google + Facebook + Credentials) |
| **UI** | Tailwind CSS, shadcn/ui Radix primitives |
| **Icons** | Lucide React |
| **Charts** | Recharts v2 |
| **Drag & Drop** | dnd-kit |
| **Forms** | native + sonner toasts |
| **Email** | Nodemailer (SMTP) |
| **SMS** | Twilio |
| **State** | Zustand |
| **Dates** | date-fns v4 |
| **CSV** | csv-parse + csv-stringify |
