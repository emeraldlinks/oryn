# Oryn — All-in-One CRM Platform

## Overview
Oryn is a full-stack CRM platform (HubSpot/Zoho alternative) built with Next.js 16, SlintORM (PostgreSQL), NextAuth, and shadcn/ui. **170+ database models, 155+ REST API routes, 100+ UI pages across 5 roles, and an embeddable widget** for external sites.

---

## Database Models (170+)

| Module | Models |
|--------|--------|
| **Core** | Workspace, User, Branch |
| **CRM** | Contact, Deal, Activity |
| **Products & Orders** | Product, Order, OrderItem, Invoice |
| **HR** | Employee, Attendance, LeaveRequest |
| **Marketing** | EmailCampaign, EmailTemplate, LandingPage, Form, FormSubmission, MarketingJourney, SMSCampaign, PushNotification, SocialMention, UTMLink, SEOConfig, ABTest, MarketingSegment, LeadScoreRule |
| **Social** | SocialAccount, SocialPost, SocialReply, AdCampaign |
| **WordPress** | WordpressSite, WordpressPost |
| **Communications** | Message, Call, Meeting |
| **Support** | Ticket, TicketMessage |
| **Documents** | Document |
| **Notifications** | Notification, AuditLog |
| **Custom Fields** | CustomFieldDef, CustomFieldValue |
| **Automation** | Workflow, WorkflowTemplate, WorkflowVersion, EmailSync |
| **Live Chat** | LiveChatSettings, ChatMessage |
| **Project Management** | Project, ProjectTask, ProjectMilestone |
| **AI & Bots** | Bot, WidgetSettings, AIApiKey, AIConversation, AIAction, BotConnection |
| **Customer Success** | HealthScore, NPSResponse, CSATResponse, OnboardingTask, ChurnPrediction |
| **Sales** | SalesPipeline, SalesGoal, CommissionPlan, CommissionEarning, Quote, QuoteLineItem, ProductDiscount, Territory, Subscription, SubscriptionPlan, SubscriptionInvoice |
| **Customer Portal** | KnowledgeArticle, FAQItem, ForumTopic, ForumPost |
| **Help Desk** | SLAPolicy, CannedResponse, Macro, EscalationRule, Asset |
| **Analytics** | CustomDashboard, ScheduledReport, CohortData, CLVCalculation |
| **Security** | TwoFactorSetting, UserDevice, IPAllowlistEntry |
| **Developer** | WebhookEndpoint, OAuthApp, APILogEntry |
| **Collaboration** | InternalComment, SharedNote, Whiteboard |
| **Finance** | Expense, PaymentGateway, TaxRate, Refund |
| **Calendar** | CalendarEvent, BookingLink, CalendarSync |
| **Administration** | BrandingConfig, CustomDomain, FeatureFlag, BackupRecord, DataRetentionPolicy, AuditSetting |
| **Observability** | BackgroundJob, WebhookDelivery, EmailDelivery, SystemHealthMetric |
| **Multi-tenancy** | WorkspaceQuota, UsageRecord |
| **Internationalization** | LanguagePack, TranslationEntry |
| **Marketplace** | MarketplaceListing, InstalledItem |
| **Plugin SDK** | Plugin, PluginExtension |
| **Payments** | PaystackPayment |
| **Hiring** | JobPosting, Candidate, JobApplication, Interview, OfferLetter, HiringMetric, HiringStage |
| **Staff Management (19)** | StaffDepartment, StaffPosition, StaffShift, StaffSchedule, StaffTimesheet, StaffAttendanceRecord, StaffLeaveType, StaffLeaveRequest, StaffPerformanceReview, StaffGoal, StaffTrainingCourse, StaffTrainingEnrollment, StaffCertification, StaffSkill, StaffEmployeeSkill, StaffDocument, StaffComplianceItem, StaffDisciplinaryAction, StaffExpenseReport |
| **Inventory (17)** | InventoryWarehouse, InventoryCategory, InventoryBrand, InventoryItem, InventoryVariant, InventoryStock, InventoryMovement, InventorySupplier, InventoryPurchaseOrder, InventoryPurchaseOrderItem, InventoryGoodsReceivedNote, InventoryStockTransfer, InventoryStockCount, InventoryReorderRule, InventoryBatch, InventoryReturn, InventoryCostHistory |
| **Department Dashboard** | DepartmentModule, DepartmentModuleAssignment |

---

## Authentication & Authorization

- **NextAuth v4** with 3 providers: Google OAuth, Facebook OAuth, Credentials (email/password)
- JWT session with `id`, `role`, `workspaceId`, `canUseStaffManagement`, `canUseInventory` attached
- **5 roles**: superadmin, admin, manager, employee, client
- **Proxy.ts** (Next.js 16) replaces deprecated middleware.ts — enforces role-based route access with redirects
- Staff & Inventory feature flags enforced at proxy level (403 for APIs, redirect for pages)
- Public paths excluded: `/login`, `/register`, `/forgot-password`, `/api/auth/*`
- Registration API creates workspace + superadmin user, redirects to `/admin`
- Password reset API at `/api/auth/forgot-password` with security best practices

---

## Security

### Two-Factor Authentication (2FA)
- Enable/disable 2FA with TOTP secret generation
- One-time backup codes display
- Token verification to confirm setup

### Device Management
- Track all user devices with name, type, IP, user agent
- Trust/untrust devices, view last used timestamp
- Remove unrecognized devices

### IP Allowlisting
- Workspace-level IP allowlist entries
- Active/inactive toggle per entry
- Description annotation

### Session History
- Track recent login activity

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

## Sales Enhancement

### Multiple Sales Pipelines
- Custom pipeline definitions with configurable stages
- Stage objects with name, probability, sort order
- Default pipeline designation, active/inactive toggle

### Sales Goals & Quotas
- Per-user sales goals with target amounts
- Period types: monthly, quarterly, yearly
- Progress tracking with achieved amount vs target
- Aggregate stats: total target, total achieved, average progress, on-track count

### Commission Tracking
- Commission plans with percentage or fixed rate types
- Tiered commission structures (min/max amount brackets with different rates)
- Automatic commission calculation per deal
- Commission earnings with status workflow: pending → approved → paid → cancelled

### Quote Generation
- Auto-generated quote numbers (`QTE-2026-0001`)
- Line items with quantity, unit price, discount percent/amount
- Automatic subtotal, tax, and total calculation
- Status: draft → sent → accepted → rejected → expired → cancelled
- Sent/accepted timestamps, terms and notes

### Product Catalog with Discounts
- Product-level and global discount rules
- Discount types: percentage or fixed amount
- Min/max quantity conditions, date validity ranges

### Territory Management
- Sales territory definitions with regions (JSON)
- Territory manager assignment
- Territory-based contact/deal routing

### Recurring Subscriptions
- Subscription plans with pricing, billing cycle (monthly/yearly/quarterly), features list
- Active subscription tracking per contact
- Status: active, paused, cancelled, expired, trialing
- Next billing date and auto-invoice generation
- Subscription-linked invoices with period tracking

---

## Products & Orders

### Products
- CRUD with SKU, price, stock tracking, categories
- Service toggle (physical vs service products)
- Discount rules engine

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
- Department FK relationship (`departmentId` → `StaffDepartment`)
- Job title, salary, branch assignment

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
- SEO configuration (meta title, description, keywords, OG image, canonical URL, noIndex, structured data)

### Forms
- Dynamic JSON field definitions
- Submission tracking with contact linking

### Marketing Automation Journeys
- Multi-step automation journeys with triggers and steps (JSON)
- Status: draft → active → paused → completed
- Entered/converted tracking with conversion rate

### SMS Campaigns
- SMS body with scheduled sending
- Status: draft → scheduled → sending → sent → failed
- Recipient count and delivery tracking
- Target filtering

### Push Notifications
- Send push notifications to users
- Status: pending → sent → delivered → read → failed
- Custom data payload support

### Social Listening
- Track mentions across platforms (Twitter, Facebook, etc.)
- Author info, content, sentiment analysis
- Status workflow: unread → read → replied → ignored

### UTM Campaign Tracking
- Trackable UTM links with source, medium, campaign, content, term
- Click counting per link

### SEO Configuration
- Per-landing-page SEO settings
- Meta title, description, keywords
- OG image, canonical URL, noIndex toggle
- Structured data (JSON-LD)

### A/B Testing
- Create A/B tests with multiple variants and traffic distribution
- Status: draft → running → paused → completed
- Impression/conversion tracking per variant
- Automatic winner calculation

### Lead Scoring
- Rule-based lead scoring (contact or deal entity)
- Conditional scoring with field/operator/value conditions
- Positive or negative score values
- Active rule toggling

### Marketing Segments
- Dynamic contact segments with filter conditions
- AND/OR logic for complex segmentation
- Contact count tracking

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
- Support stats API (avg resolution time, status distribution)

---

## Help Desk

### SLA Policies
- Response time and resolution time targets (in minutes)
- Conditional matching rules (JSON)
- Escalation rules within SLA

### Canned Responses
- Pre-written response templates with shortcuts
- Categorized for easy finding

### Macros
- Automated action sequences for common tasks
- One-click execution on tickets

### Escalation Rules
- Trigger types: priority, time-based, keyword, assignment
- Conditional evaluation with automated actions
- Active rule toggling

### Asset Management
- Track customer assets with type, purchase date, warranty end
- Linked to contacts
- Metadata storage (JSON)

### Satisfaction Surveys
- Post-ticket CSAT surveys (1-5 score)
- NPS surveys (0-10 score with promoter/detractor/passive classification)

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

### Workflow Templates
- Pre-built workflow definitions
- Category organization
- Usage counting for popularity tracking

### Workflow Version History
- Versioned workflow definitions with auto-increment
- Comparison between versions
- Change notes per version

### Trigger Execution
- Single POST endpoint checks all active workflows matching event
- Executes actions in sequence
- Used by CRM mutation APIs

### Scheduled Workflows
- Time-based triggers (time-elapsed)

---

## Customer Success

### Health Scores
- Contact health scoring (0-100) with color-coded categories
- Needs attention (<40), At risk (40-69), Good (>=70)
- Factors breakdown (JSON)
- Category classification (Onboarding, Active, At Risk, Churned)

### NPS Surveys
- Net Promoter Score (0-10) collection
- Promoter (9-10), Passive (7-8), Detractor (0-6) classification
- Overall NPS score calculation: `(promoters - detractors) / total × 100`
- Comment collection

### CSAT Surveys
- Customer Satisfaction Score (1-5) collection
- Ticket-linked surveys
- Average CSAT tracking

### Customer Onboarding
- Contact-level onboarding task checklists
- Status: pending → in_progress → completed → skipped
- Due date tracking, assignee assignment
- Sortable task ordering

### Churn Prediction
- Risk scoring (0-100) with levels: low, medium, high, critical
- Risk factor breakdown (JSON)
- Average risk score tracking
- Per-contact churn risk monitoring

### Renewal Reminders
- Upcoming subscription renewals (configurable window, default 30 days)
- Days-until-expiry calculation
- Automated notification sending to contact owner

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
- 13 supported action types

---

## Chatbot Automation (Bots)

- Channel support: chat, email, social, slack, whatsapp
- AI model: keyword matching or AI provider (OpenAI, Gemini, DeepSeek, Claude, Qwen, Kimi)
- Trigger keyword configuration
- Response template with variable interpolation
- Test modal for simulating bot responses
- Active/inactive toggle

---

## Customer Portal

### Knowledge Base
- Published/draft articles with HTML body
- Categories and tags for organization
- View tracking, helpful/not helpful feedback
- Search by title/category

### FAQ
- Categorized FAQ items with sort order
- Published toggle for visibility control

### Community Forum
- Discussion topics with author tracking
- Post replies with solution marking
- Status: open, resolved, closed, locked
- Pin important topics, view tracking

### Self-Service (Live API Integration)
- Orders view with real API data
- Invoices view with real API data
- Support tickets with create/view via API
- Documents view with real API data
- Dashboard with aggregated stats
- Privacy & GDPR page
- Password reset flow

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

## Team Collaboration

### Internal Comments
- Entity-linked commenting (deals, contacts, tickets, etc.)
- @mentions support with user ID references
- Edit tracking with editedAt timestamp

### Shared Notes
- Workspace-wide shared notes with HTML body
- Selective sharing with specific users
- Creator attribution

### Whiteboards
- Collaborative whiteboard sessions with JSON data
- Participant tracking
- Creator attribution

---

## Calendar

### Calendar Events
- Full event management with start/end times
- All-day event support, color coding
- Attendee tracking, location
- Contact linking, user assignment
- Date range filtering, month grid view

### Booking Links
- Public booking links with unique slugs
- Configurable duration, availability windows
- Buffer time configuration
- Total bookings counter

### Calendar Sync
- Google Calendar sync configuration
- Outlook Calendar sync configuration
- OAuth token management with refresh
- Last synced timestamp tracking

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

## Analytics & Reports

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

### Custom Dashboards
- User-defined dashboard layouts with widget configuration
- Sortable, shareable dashboards
- JSON widget definitions

### Scheduled Reports
- Automated report generation on configurable frequency
- Email recipient lists
- Active/inactive scheduling

### Cohort Analysis
- Period-based cohort tracking (monthly, weekly)
- Retention data per cohort
- User count per cohort

### Customer Lifetime Value (CLV)
- CLV calculation: AOV × purchase frequency × customer lifespan
- Per-contact and workspace-wide averages

### Churn Reports
- Churn risk distribution across contacts
- Risk factor analysis

---

## Developer Platform

### Webhooks
- Register webhook endpoints for event notifications
- Event-type subscription (JSON array)
- Custom header injection
- Success/failure counting with health monitoring
- Test endpoint for webhook payload simulation

### OAuth Apps
- Register OAuth applications with auto-generated client ID/secret
- Redirect URI management
- Scope-based permissions
- Client secret rotation
- Active/inactive app management

### API Logs
- Full API request logging with method, path, status code
- Duration tracking, IP address capture
- User attribution
- Filterable by method, status code, user

### API Rate Limiting
- Configurable rate limits per endpoint

---

## Finance

### Expense Tracking
- Expense recording with amount, currency, category
- Date tracking, receipt URL storage
- Reimbursement status tracking
- Filter by category, user, date range

### Payment Gateways
- Multi-provider gateway configuration (Stripe, Paystack, Flutterwave, etc.)
- API key/secret management (masked display)
- Webhook secret for event processing
- Default gateway designation

### Tax Configuration
- Tax rate definitions with regional support
- Percentage-based rates
- Active rate toggling

### Refund Management
- Invoice-linked refund processing
- Status: pending → approved → rejected → processed
- Reason tracking, processed date

### Subscription Billing
- Recurring billing via subscription plans
- Automated invoice generation per billing cycle
- Subscription status management

---

## Paystack Payment System

### Secure Payment Processing
- AES-256-GCM encrypted API key storage at rest
- Server-authoritative amounts (amount always fetched from DB invoice, client-supplied amount ignored)
- HMAC-SHA256 webhook signature verification with `crypto.timingSafeEqual`
- IP allowlisting as secondary webhook filter
- Webhook re-verification with Paystack API before processing (defense in depth)

### Payment Flow
- Customer payment page at `/pay/:reference`
- Initialize transaction via Paystack API with invoice data
- Verify transaction before processing
- Webhook receives payment confirmation asynchronously

### Receipts & Invoices
- HTML invoice generation (professional layout with logo, billing info, line items)
- Email receipts sent via nodemailer (SMTP)
- Payment confirmation with transaction reference
- Admin payment dashboard with full history

### Admin Settings
- Configure Paystack public + secret keys (encrypted at rest)
- Webhook URL display for Paystack dashboard configuration
- Test webhook endpoint for debugging

---

## Hiring Management

### Job Postings
- Full CRUD for job listings
- Status: draft, published, closed, filled
- Department and location tracking

### Candidates
- Applicant tracking with contact info, resume URL, current role
- AI CV scanning with 8-metric scoring engine
- Metrics: Experience, Education, Skills, Certifications, Stability, Communication, Leadership, Cultural Fit

### Job Applications
- Link candidates to job postings
- Stage tracking through hiring pipeline
- AI-generated scoring and notes

### Interviews
- Schedule interviews linked to applications
- Interviewer assignment, location/URL tracking
- Feedback and rating collection

### Offer Letters
- Generate offer letters for candidates
- Status: draft, sent, accepted, rejected, withdrawn
- Salary, start date, and terms tracking

### Hiring Metrics
- Configurable metric definitions for CV scoring
- Customizable weights, max scores, and enable/disable per metric
- 8 default metrics with sensible defaults

### Hiring Stages
- Configurable hiring pipeline stages per job
- Stage ordering, active/inactive toggle
- Default stages: Applied, Screening, Interviewing, Shortlisted, Offer, Hired, Rejected

### Dashboard
- Pipeline funnel visualization
- Recent applications feed
- Quick-nav to Jobs, Candidates, Interviews, Offers, Metrics, Stages

---

## Staff Management

### Departments
- Hierarchical departments with parent-child relationships
- Head employee assignment
- Department color coding
- Configurable department modules (see Department Dashboard section)

### Positions
- Job positions linked to departments
- Position hierarchy with parent-child relationships
- Active/inactive toggle

### Shifts & Schedules
- Shift templates with start/end times
- Employee shift scheduling
- Schedule date ranges

### Timesheets
- Employee time tracking with start/end times
- Break duration tracking
- Hourly rate calculation for cost tracking

### Attendance
- Daily attendance records per employee
- Status: present, absent, late, half-day, holiday
- Check-in/check-out time tracking

### Leave Management
- Leave types (vacation, sick, personal, etc.) with policies
- Leave requests with date range and reason
- Approval workflow: pending → approved → rejected → cancelled
- Half-day option per request

### Performance Reviews
- Employee performance evaluations
- Rating system, strengths, areas for improvement
- Reviewer assignment, review period tracking

### Goals & OKRs
- Employee goals with key results (JSON)
- Status: draft, active, completed, cancelled
- Progress percentage tracking

### Training & Development
- Training courses with description, duration, max participants
- Training enrollments with status, score tracking
- Certification management with expiry tracking

### Skills Matrix
- Skill definitions (name, category, description)
- Employee skill assignments with proficiency levels (1-5)
- Primary skill designation per employee

### Staff Documents
- Upload contracts, NDAs, and other staff documents
- Document type categorization
- Status: active, archived, expired
- Expiry date tracking

### Compliance
- Compliance item definitions per department
- Employee assignments with status tracking
- Due date monitoring

### Disciplinary Actions
- Record disciplinary actions per employee
- Type: written_warning, final_warning, suspension, termination
- Status: pending, active, resolved, appealed
- Description and resolution tracking

### Staff Expenses
- Expense reports by employees
- Categories, amounts, receipt tracking
- Status: pending, approved, reimbursed, rejected
- Approval workflow with admin review

### Dashboard & Stats
- Aggregated stats across all staff modules
- Quick-nav grid to all 19 sub-pages
- Key metrics: total employees, departments, positions, schedules, pending leave, open disciplinary

---

## Inventory Management

### Warehouses
- Multi-warehouse support with location tracking
- Contact person and contact info
- Active/inactive toggle

### Categories & Brands
- Hierarchical inventory categories
- Brand management with description
- Category-brand associations

### Items & Variants
- Full item catalog with SKU, barcode, dimensions, weight
- Item types: physical, digital, service
- Tracking flags: serialized, batch_tracked, perishable
- Variant support (size, color, etc.) with JSON attributes
- Unit price, cost price, tax rate, reorder point

### Stock Management
- Per-warehouse stock levels with reserved and available quantities
- Minimum and maximum stock thresholds
- Reorder point alerts

### Stock Movements
- Complete audit trail of all stock changes
- Movement types: purchase_received, sale, transfer, adjustment, return, write_off
- Quantity before/after tracking
- Reference linking (PO, transfer, etc.)

### Suppliers
- Supplier management with payment terms
- Contact info, rating system
- Active/inactive toggle

### Purchase Orders
- Create POs with line items (products, quantity, unit price)
- Status: draft, pending, approved, sent, partially_received, received, cancelled
- Expected delivery date, shipping cost, tax
- Full preloading of items and product details

### Goods Received Notes
- Record receipt of purchase orders
- Line-item quantity acceptance
- Decrement remaining PO quantities
- Auto-receipt completion detection

### Stock Transfers
- Inter-warehouse stock transfers
- Status: draft, in_transit, received, cancelled
- Expected and actual arrival dates
- Partial receipt support

### Stock Counts
- Physical inventory counting
- Count types: full, partial, spot_check, cycle_count
- Discrepancy calculation
- Status: draft, in_progress, completed, verified

### Reorder Rules
- Automated reorder point rules per item
- Lead time, safety stock, economic order quantity
- Preferred supplier assignment
- Active/inactive toggle

### Batch Tracking
- Lot/batch tracking for batch-tracked items
- Manufacturing date, expiry date tracking
- Quantity tracking per batch

### Returns
- Customer returns and supplier returns
- Return reasons, condition assessment
- Status: pending, approved, rejected, restocked, refunded
- Quantity and refund amount tracking

### Cost History (Audit)
- Immutable audit log of cost price changes
- Old cost, new cost tracking
- Changed by attribution

### Dashboard & Stats
- Aggregated stats: total items, warehouses, categories, brands, suppliers, low stock alerts
- Quick-nav grid to all 17 sub-pages
- DataTable access to all inventory entities

---

## Department Dashboard (Configurable)

### Module Catalog
- Pre-seeded 65+ system modules across 8 categories on first visit
- Categories: HR (20 modules), Sales (9), Finance (6), Business Development (7), Operations (6), Marketing (7), IT/Engineering (9), Customer Success (4)
- Each module has: key, name, description, icon, category, route href
- Create custom modules with any name, key, icon, and route
- Modules page at `/admin/staff/departments/modules`

### Module Assignment
- Per-department module assignment (toggle on/off)
- Department detail page at `/admin/staff/departments/[id]`
- Two views: assigned "Department Tools" grid with working links, and full "Available Modules" browser
- Quick add/remove with one click

### Department Dashboard
- Department info display with stats (employee count, module count)
- Assigned tool grid with icon cards linking to feature pages
- Department names link to detail pages from Departments list
- Staff dashboard includes "Dept. Modules" nav link

### Departments List
- Hierarchical department management with parent-child
- Head employee assignment, color coding
- Active/inactive toggle, DataTable display
- "Manage Modules" button linking to module catalog

---

## Roles & Permissions

- Role-based permission map per entity (contacts, deals, products, orders, invoices, tickets, email, reports, automation, settings)
- 5 roles × 10 entities permission matrix
- Permission levels: create, read, update, delete, export, import, send
- Visual permission table in Settings

---

## Billing

- Plan comparison (Starter, Growth, Scale, Enterprise)
- Feature list per plan with Staff Management + Inventory
- Upgrade flow
- Usage tracking per plan

---

## Feature Flag Enforcement

### Multi-tenancy Feature Toggles
- Toggle AI, API, Automation, Staff Management, Inventory per workspace
- WorkspaceQuota model with all feature flags
- Admin toggle page at `/admin/multi-tenancy`

### Proxy-Level Enforcement
- JWT-stamped feature flags (no DB query on every request)
- Lazy DB fallback if flags missing from token
- API routes return 403 JSON when feature disabled
- Page routes redirect when feature disabled
- Staff and Inventory routes fully gate-checked

---

## Administration

### Branding
- Company name, logo URL, favicon URL with live preview
- Primary & secondary color pickers
- Custom CSS and JS injection
- Find-or-create pattern (one branding config per workspace)

### Custom Domains
- Add custom domain names per workspace
- Domain verification workflow (verify button marks verified)
- SSL status tracking, active/inactive toggle
- Unique domain constraint per workspace

### Feature Flags
- Per-workspace feature toggles with unique key names
- Enable/disable toggle per flag
- Descriptive annotations for each flag

### Backups
- Manual backup creation with type tracking
- Status workflow: pending → running → completed → failed
- File URL and size tracking
- Error capture on failure

### Data Retention Policies
- Per-entity-type retention rules (contacts, deals, tickets, etc.)
- Configurable retention days and action (delete/archive)
- Active/inactive toggle per policy

### Audit Settings
- Enable/disable workspace audit logging
- Configurable retention days for audit events
- Tracked events selection (login, logout, create, update, delete, export, settings_change, permission_change)
- Excluded users list to skip specific user activity

---

## Observability

### Background Jobs
- Job queue with type, status, payload, and result tracking
- Status: pending → running → completed → failed
- Attempt counting with configurable max attempts (default 3)
- Scheduled, started, completed, and next-retry timestamps
- Retry mechanism for failed jobs (resets to pending)

### Webhook Deliveries
- Per-delivery tracking with HTTP status, duration, request/response bodies
- Status tracking with error capture
- Retry scheduling with nextRetryAt timestamp
- Filterable by status and endpoint ID

### Email Delivery Log
- Per-email tracking with recipient, subject, status
- Open and click counting with timestamps
- Status values: sent, delivered, bounced, failed, opened, clicked
- Error message capture on failure
- Searchable by recipient or subject

### System Health Metrics
- Custom metric recording (name, value, unit)
- Tagged metrics for dimensional analysis
- Date-range filtering for trend analysis
- Common metrics: cpu_usage, memory_usage, response_time, active_users, error_rate

### Storage Usage
- Workspace quota limits (max storage GB, max users, max contacts, max deals, max projects)
- Real-time usage aggregation from entity counts
- Storage usage percentage calculation
- Entity breakdown: contacts, deals, products, projects, documents

---

## Multi-tenancy

### Workspace Quotas
- Configurable per-workspace limits: max users, storage, contacts, deals, projects
- Feature toggles: canUseAI, canUseAPI, canUseAutomation, canUseStaffManagement, canUseInventory
- Custom limits via JSON for extensibility
- Find-or-create pattern with sensible defaults (10 users, 5GB, 1000 contacts, 500 deals, 20 projects)

### Usage Records
- Periodic usage snapshots per entity type
- Period-based tracking (monthly, weekly, daily)
- Aggregate consumption monitoring across workspaces

---

## Internationalization

### Language Packs
- Per-workspace language definitions with locale codes
- Native name display, RTL layout support
- Default language designation per workspace
- Active/inactive toggle per language

### Translation Entries
- Key-value translation storage linked to language packs
- Namespace organization for modular translations
- Approval workflow with approvedBy user tracking
- Key search for easy translation management

---

## Marketplace & Integrations

### Marketplace Listings
- Multi-type listing support: apps, connectors, themes, workflow packs, extensions
- Version tracking with author attribution
- Verified publisher badge, published/unpublished toggle
- JSON config for flexible extension points
- Global listing view (no workspace isolation)

### Installed Items
- Per-workspace installation tracking with settings storage
- Active/inactive toggle per installed item
- Installation audit with installed-by tracking
- Eager-loaded listing details on fetch

---

## Plugin / Extension SDK

### Plugin Registration
- Workspace-scoped plugin definitions with name, version, author
- Description and entry point specification
- Permissions declaration (JSON array)
- Enable/disable toggle per plugin

### Plugin Extensions
- Extension types: page, model, action, webhook, ai_tool, widget
- JSON config for flexible extension definitions
- Active/inactive toggle per extension
- Cascade delete on plugin removal
- Eager-loaded plugin details

### Lifecycle Hooks
- Plugin lifecycle hooks: onInstall, onUninstall, onActivate, onDeactivate
- Background job queue for async hook execution
- Plugin manifest validation

---

## Mobile

### Progressive Web App (PWA)
- PWA manifest support for installable web app
- Service worker ready for offline capability

### Push Notifications
- Push notification support for mobile devices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Database** | PostgreSQL via SlintORM v1.1.5 (pg driver) |
| **ORM** | SlintORM with 170+ annotated model interfaces |
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
| **Encryption** | Node.js crypto (AES-256-GCM) |
