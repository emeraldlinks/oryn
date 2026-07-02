
// AUTO-GENERATED SCHEMA - DO NOT EDIT
// Schema Hash: c15c7e61f29425de
// Source Hash: 53aa0c2458e29867

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  plan: string;
  active: boolean;
  settings?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  users?: User[];
  branches?: Branch[];
  contacts?: Contact[];
  deals?: Deal[];
  products?: Product[];
  employees?: Employee[];
  tickets?: Ticket[];
}

export interface User {
  id: number;
  workspaceId: number;
  name: string;
  email: string;
  passwordHash?: string;
  role: string;
  avatarUrl?: string;
  lastLoginAt?: string;
  preferences?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  activities?: Activity[];
  employeeProfile?: Employee[];
  calls?: Call[];
  meetings?: Meeting[];
  notifications?: Notification[];
}

export interface Branch {
  id: number;
  workspaceId: number;
  name: string;
  address?: string;
  city?: string;
  country: string;
  phone?: string;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  manager?: User;
  employees?: Employee[];
}

export interface Contact {
  id: number;
  workspaceId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status: string;
  assignedTo?: number;
  tags?: string[];
  customFields?: Record <string ,unknown >;
  lastContactedAt?: string;
  dealScore?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  assignee?: User;
  deals?: Deal[];
  activities?: Activity[];
  messages?: Message[];
  calls?: Call[];
  meetings?: Meeting[];
  tickets?: Ticket[];
  invoices?: Invoice[];
}

export interface Deal {
  id: number;
  workspaceId: number;
  contactId: number;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  assignedTo?: number;
  branchId?: number;
  wonAt?: string;
  lostAt?: string;
  lostReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  contact?: Contact;
  assignee?: User;
  activities?: Activity[];
  meetings?: Meeting[];
}

export interface Activity {
  id: number;
  workspaceId: number;
  type: string;
  subject: string;
  body?: string;
  contactId?: number;
  dealId?: number;
  userId: number;
  dueAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  deal?: Deal;
  user?: User;
}

export interface Product {
  id: number;
  workspaceId: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  currency: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
  isService: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  orderItems?: OrderItem[];
}

export interface Order {
  id: number;
  workspaceId: number;
  contactId: number;
  status: string;
  totalAmount: number;
  currency: string;
  paidAt?: string;
  branchId?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  items?: OrderItem[];
  invoice?: Invoice;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  product?: Product;
}

export interface Invoice {
  id: number;
  workspaceId: number;
  orderId?: number;
  contactId: number;
  status: string;
  dueDate: string;
  totalAmount: number;
  paidAt?: string;
  pdfUrl?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  order?: Order;
  contact?: Contact;
}

export interface Employee {
  id: number;
  workspaceId: number;
  userId: number;
  branchId?: number;
  department?: string;
  jobTitle?: string;
  salary?: number;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  user?: User;
  branch?: Branch;
  attendance?: Attendance[];
  leaveRequests?: LeaveRequest[];
}

export interface Attendance {
  id: number;
  employeeId: number;
  clockedInAt: string;
  clockedOutAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
  approvedBy?: number;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
  approver?: User;
}

export interface EmailCampaign {
  id: number;
  workspaceId: number;
  templateId?: number;
  name: string;
  subject: string;
  bodyHtml: string;
  status: string;
  sentAt?: string;
  scheduledAt?: string;
  recipientCount?: number;
  openCount?: number;
  clickCount?: number;
  targetFilters?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  template?: EmailTemplate;
}

export interface EmailTemplate {
  id: number;
  workspaceId: number;
  name: string;
  subject: string;
  bodyHtml: string;
  variables?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  campaigns?: EmailCampaign[];
}

export interface LandingPage {
  id: number;
  workspaceId: number;
  slug: string;
  title: string;
  contentJson?: Record <string ,unknown >;
  published: boolean;
  views?: number;
  conversions?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface Form {
  id: number;
  workspaceId: number;
  name: string;
  fieldsJson: Record <string ,unknown >;
  submissions?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  submissionsList?: FormSubmission[];
}

export interface FormSubmission {
  id: number;
  formId: number;
  data: Record <string ,unknown >;
  contactId?: number;
  createdAt: string;
  updatedAt: string;
  form?: Form;
  contact?: Contact;
}

export interface SocialAccount {
  id: number;
  workspaceId: number;
  platform: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  profileImageUrl?: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  posts?: SocialPost[];
  adCampaigns?: AdCampaign[];
}

export interface SocialPost {
  id: number;
  workspaceId: number;
  socialAccountId: number;
  content: string;
  mediaUrls?: string[];
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  platformPostId?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  createdAt: string;
  updatedAt: string;
  account?: SocialAccount;
  replies?: SocialReply[];
}

export interface SocialReply {
  id: number;
  socialPostId: number;
  platformCommentId: string;
  authorName: string;
  content: string;
  repliedContent?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  post?: SocialPost;
}

export interface AdCampaign {
  id: number;
  workspaceId: number;
  socialAccountId: number;
  platformCampaignId?: string;
  name: string;
  objective: string;
  status: string;
  budget: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  socialAccount?: SocialAccount;
}

export interface WordpressSite {
  id: number;
  workspaceId: number;
  siteUrl: string;
  appUsername: string;
  appPassword: string;
  siteName?: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  posts?: WordpressPost[];
}

export interface WordpressPost {
  id: number;
  wordpressSiteId: number;
  platformPostId?: number;
  title: string;
  contentHtml: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  categories?: string[];
  tags?: string[];
  featuredImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  site?: WordpressSite;
}

export interface Message {
  id: number;
  workspaceId: number;
  channel: string;
  direction: string;
  contactId?: number;
  fromAddress: string;
  toAddress: string;
  subject?: string;
  body: string;
  status: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface Call {
  id: number;
  workspaceId: number;
  contactId?: number;
  userId: number;
  direction: string;
  phoneNumber: string;
  duration?: number;
  recordingUrl?: string;
  transcript?: string;
  sentiment?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  user?: User;
}

export interface Meeting {
  id: number;
  workspaceId: number;
  title: string;
  contactId?: number;
  dealId?: number;
  userId: number;
  scheduledAt: string;
  duration?: number;
  meetingUrl?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  deal?: Deal;
  user?: User;
}

export interface Ticket {
  id: number;
  workspaceId: number;
  contactId: number;
  subject: string;
  status: string;
  priority: string;
  assignedTo?: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  contact?: Contact;
  assignee?: User;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  userId?: number;
  body: string;
  isFromClient: boolean;
  createdAt: string;
  updatedAt: string;
  ticket?: Ticket;
  user?: User;
}

export interface Document {
  id: number;
  workspaceId: number;
  title: string;
  type: string;
  contentJson?: Record <string ,unknown >;
  pdfUrl?: string;
  contactId?: number;
  dealId?: number;
  status: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  deal?: Deal;
}

export interface Notification {
  id: number;
  workspaceId: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  readAt?: string;
  meta?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface AuditLog {
  id: number;
  workspaceId: number;
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  meta?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface CustomFieldDef {
  id: number;
  workspaceId: number;
  entityType: string;
  fieldName: string;
  fieldType: string;
  options?: string[];
  required: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CustomFieldValue {
  id: number;
  workspaceId: number;
  entityType: string;
  entityId: number;
  fieldDefId: number;
  value?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  fieldDef?: CustomFieldDef;
}

export interface Workflow {
  id: number;
  workspaceId: number;
  name: string;
  triggerType: string;
  triggerConfig: Record <string ,unknown >;
  actions: Record <string ,unknown >;
  active: boolean;
  runCount: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface EmailSync {
  id: number;
  workspaceId: number;
  userId: number;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  email: string;
  lastSyncedAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface LiveChatSettings {
  id: number;
  workspaceId: number;
  enabled: boolean;
  widgetColor?: string;
  welcomeMessage?: string;
  awayMessage?: string;
  collectEmail: boolean;
  showAgentNames: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface ChatMessage {
  id: number;
  workspaceId: number;
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  contactId?: number;
  userId?: number;
  body: string;
  sender: string;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  status: string;
  priority: string;
  ownerId?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  owner?: User;
  tasks?: ProjectTask[];
  milestones?: ProjectMilestone[];
}

export interface ProjectTask {
  id: number;
  projectId: number;
  workspaceId: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: number;
  milestoneId?: number;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  parentTaskId?: number;
  sortOrder: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  project?: Project;
  assignee?: User;
  milestone?: ProjectMilestone;
  parentTask?: ProjectTask;
  subtasks?: ProjectTask[];
}

export interface ProjectMilestone {
  id: number;
  projectId: number;
  workspaceId: number;
  name: string;
  description?: string;
  dueDate: string;
  status: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  tasks?: ProjectTask[];
}

export interface Bot {
  id: number;
  workspaceId: number;
  name: string;
  channel: string;
  triggerKeywords: string;
  responseTemplate: string;
  aiModel: string;
  config?: Record <string ,unknown >;
  active: boolean;
  totalConversations: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface WidgetSettings {
  id: number;
  workspaceId: number;
  enabled: boolean;
  primaryColor: string;
  welcomeMessage?: string;
  awayMessage?: string;
  collectEmail: boolean;
  showAgentNames: boolean;
  enableBots: boolean;
  defaultBotId?: number;
  allowedDomains?: string[];
  customCss?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  defaultBot?: Bot;
}

export interface AIApiKey {
  id: number;
  workspaceId: number;
  userId?: number;
  provider: string;
  apiKey: string;
  scope: string;
  active: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface AIConversation {
  id: number;
  workspaceId: number;
  userId: number;
  title: string;
  messages: Record <string ,unknown >;
  provider: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface AIAction {
  id: number;
  workspaceId: number;
  userId: number;
  conversationId?: number;
  botConnectionId?: number;
  actionType: string;
  actionPayload: Record <string ,unknown >;
  result?: Record <string ,unknown >;
  status: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
  conversation?: AIConversation;
  botConnection?: BotConnection;
}

export interface BotConnection {
  id: number;
  workspaceId: number;
  userId: number;
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
  status: string;
  active: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  allowedActions?: string[];
  totalRequests: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  workspace?: Workspace;
  owner?: User;
  actions?: AIAction[];
}

export interface HealthScore {
  id: number;
  workspaceId: number;
  contactId: number;
  score: number;
  category?: string;
  notes?: string;
  factors?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface NPSResponse {
  id: number;
  workspaceId: number;
  contactId: number;
  score: number;
  comment?: string;
  surveyId?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface CSATResponse {
  id: number;
  workspaceId: number;
  contactId: number;
  ticketId?: number;
  score: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  ticket?: Ticket;
}

export interface OnboardingTask {
  id: number;
  workspaceId: number;
  contactId: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  completedAt?: string;
  assignedTo?: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  assignee?: User;
}

export interface ChurnPrediction {
  id: number;
  workspaceId: number;
  contactId: number;
  riskScore: number;
  riskLevel: string;
  factors?: Record <string ,unknown >;
  predictedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface SalesPipeline {
  id: number;
  workspaceId: number;
  name: string;
  stages: Record <string ,unknown >;
  isDefault: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface SalesGoal {
  id: number;
  workspaceId: number;
  userId: number;
  targetAmount: number;
  period: string;
  periodType: string;
  currency: string;
  achievedAmount: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface CommissionPlan {
  id: number;
  workspaceId: number;
  name: string;
  rateType: string;
  rateValue: number;
  minDealValue?: number;
  maxDealValue?: number;
  tiers?: Record <string ,unknown >;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CommissionEarning {
  id: number;
  workspaceId: number;
  userId: number;
  dealId: number;
  planId: number;
  amount: number;
  status: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
  deal?: Deal;
  plan?: CommissionPlan;
}

export interface Quote {
  id: number;
  workspaceId: number;
  contactId: number;
  quoteNumber: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  validUntil?: string;
  sentAt?: string;
  acceptedAt?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  lineItems?: QuoteLineItem[];
}

export interface QuoteLineItem {
  id: number;
  quoteId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  quote?: Quote;
  product?: Product;
}

export interface ProductDiscount {
  id: number;
  workspaceId: number;
  productId?: number;
  name: string;
  discountType: string;
  discountValue: number;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  product?: Product;
}

export interface Territory {
  id: number;
  workspaceId: number;
  name: string;
  regions?: Record <string ,unknown >;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  manager?: User;
}

export interface Subscription {
  id: number;
  workspaceId: number;
  contactId: number;
  planId: number;
  status: string;
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  amount: number;
  currency: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
  plan?: SubscriptionPlan;
  invoices?: SubscriptionInvoice[];
}

export interface SubscriptionPlan {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle: string;
  features?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  subscriptions?: Subscription[];
}

export interface SubscriptionInvoice {
  id: number;
  subscriptionId: number;
  invoiceId: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
  subscription?: Subscription;
  invoice?: Invoice;
}

export interface ABTest {
  id?: number;
  workspaceId: number;
  name: string;
  description?: string;
  status: string;
  variants: Record <string ,unknown >;
  metrics?: Record <string ,unknown >;
  startedAt?: string;
  completedAt?: string;
  winner?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface MarketingSegment {
  id: number;
  workspaceId: number;
  name: string;
  filters: Record <string ,unknown >;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface LeadScoreRule {
  id: number;
  workspaceId: number;
  name: string;
  entityType: string;
  conditions: Record <string ,unknown >;
  scoreValue: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface MarketingJourney {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  status: string;
  triggers: Record <string ,unknown >;
  steps: Record <string ,unknown >;
  startedAt?: string;
  completedAt?: string;
  totalEntered: number;
  totalConverted: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface SMSCampaign {
  id: number;
  workspaceId: number;
  name: string;
  body: string;
  status: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  deliveredCount: number;
  targetFilters?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface PushNotification {
  id: number;
  workspaceId: number;
  userId: number;
  title: string;
  body: string;
  data?: Record <string ,unknown >;
  status: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface SocialMention {
  id: number;
  workspaceId: number;
  platform: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  postedAt?: string;
  sentiment?: string;
  postUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface UTMLink {
  id: number;
  workspaceId: number;
  sourceUrl: string;
  targetUrl: string;
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
  term?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface SEOConfig {
  id: number;
  workspaceId: number;
  pageId: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  structuredData?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  page?: LandingPage;
}

export interface KnowledgeArticle {
  id: number;
  workspaceId: number;
  title: string;
  bodyHtml: string;
  categories?: string[];
  tags?: string[];
  status: string;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface FAQItem {
  id: number;
  workspaceId: number;
  question: string;
  bodyHtml: string;
  category?: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface ForumTopic {
  id: number;
  workspaceId: number;
  title: string;
  authorId?: number;
  lastActivityAt?: string;
  views: number;
  status: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  author?: User;
}

export interface ForumPost {
  id: number;
  topicId: number;
  authorId?: number;
  bodyHtml: string;
  isSolution: boolean;
  createdAt: string;
  updatedAt: string;
  topic?: ForumTopic;
  author?: User;
}

export interface SLAPolicy {
  id: number;
  workspaceId: number;
  name: string;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  conditions?: Record <string ,unknown >;
  escalationRules?: Record <string ,unknown >;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CannedResponse {
  id: number;
  workspaceId: number;
  title: string;
  bodyHtml: string;
  shortcuts?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface Macro {
  id: number;
  workspaceId: number;
  name: string;
  actions: Record <string ,unknown >;
  description?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface EscalationRule {
  id: number;
  workspaceId: number;
  name: string;
  triggerType: string;
  conditions: Record <string ,unknown >;
  actions: Record <string ,unknown >;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface Asset {
  id: number;
  workspaceId: number;
  contactId?: number;
  name: string;
  type: string;
  purchaseDate?: string;
  warrantyEnd?: string;
  value?: number;
  metadata?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface WorkflowTemplate {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  definition: Record <string ,unknown >;
  category?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface WorkflowVersion {
  id: number;
  workflowId: number;
  version: number;
  definition: Record <string ,unknown >;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  workflow?: Workflow;
}

export interface CustomDashboard {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  widgets: Record <string ,unknown >;
  sortOrder: number;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface ScheduledReport {
  id: number;
  workspaceId: number;
  name: string;
  config: Record <string ,unknown >;
  frequency: string;
  recipients?: string[];
  active: boolean;
  lastSentAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CohortData {
  id: number;
  workspaceId: number;
  cohortDate: string;
  period: string;
  userCount: number;
  retentionData: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CLVCalculation {
  id: number;
  workspaceId: number;
  contactId?: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number;
  clv: number;
  calculatedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  contact?: Contact;
}

export interface TwoFactorSetting {
  id: number;
  userId: number;
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface UserDevice {
  id: number;
  userId: number;
  deviceName: string;
  deviceType: string;
  userAgent: string;
  ipAddress: string;
  lastUsedAt?: string;
  trusted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface IPAllowlistEntry {
  id: number;
  workspaceId: number;
  ipAddress: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface WebhookEndpoint {
  id: number;
  workspaceId: number;
  name: string;
  url: string;
  events: string[];
  headers?: Record <string ,unknown >;
  active: boolean;
  successCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface OAuthApp {
  id: number;
  workspaceId: number;
  name: string;
  redirectUris: string;
  clientId: string;
  clientSecret: string;
  scopes?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface APILogEntry {
  id: number;
  workspaceId: number;
  userId?: number;
  method: string;
  path: string;
  statusCode: number;
  durationMs?: number;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface InternalComment {
  id: number;
  workspaceId: number;
  userId: number;
  entityType: string;
  entityId: number;
  bodyHtml: string;
  mentions?: number[];
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface SharedNote {
  id: number;
  workspaceId: number;
  title: string;
  bodyHtml: string;
  sharedWith?: number[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  creator?: User;
}

export interface Whiteboard {
  id: number;
  workspaceId: number;
  name: string;
  data: Record <string ,unknown >;
  participants?: number[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  creator?: User;
}

export interface Expense {
  id: number;
  workspaceId: number;
  description: string;
  amount: number;
  currency: string;
  category: string;
  expenseDate: string;
  userId?: number;
  receiptUrl?: string;
  reimbursedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface PaymentGateway {
  id: number;
  workspaceId: number;
  provider: string;
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  active: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface TaxRate {
  id: number;
  workspaceId: number;
  name: string;
  rate: number;
  region?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface Refund {
  id: number;
  workspaceId: number;
  invoiceId: number;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  invoice?: Invoice;
}

export interface CalendarEvent {
  id: number;
  workspaceId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color?: string;
  attendees?: string[];
  userId?: number;
  contactId?: number;
  location?: string;
  externalEventId?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
  contact?: Contact;
}

export interface BookingLink {
  id: number;
  workspaceId: number;
  slug: string;
  title: string;
  description?: string;
  durationMinutes: number;
  availability?: Record <string ,unknown >;
  bufferConfig?: Record <string ,unknown >;
  active: boolean;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CalendarSync {
  id: number;
  workspaceId: number;
  userId: number;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  lastSyncedAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface BrandingConfig {
  id: number;
  workspaceId: number;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  faviconUrl?: string;
  customCss?: string;
  customJs?: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface CustomDomain {
  id: number;
  workspaceId: number;
  domain: string;
  verified: boolean;
  verifiedAt?: string;
  sslEnabled: boolean;
  sslExpiresAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface FeatureFlag {
  id: number;
  workspaceId: number;
  key: string;
  enabled: boolean;
  description?: string;
  rules?: Record <string ,unknown >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface BackupRecord {
  id: number;
  workspaceId: number;
  type: string;
  fileUrl?: string;
  fileSize?: number;
  status: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface DataRetentionPolicy {
  id: number;
  workspaceId: number;
  entityType: string;
  retentionDays: number;
  action: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface AuditSetting {
  id: number;
  workspaceId: number;
  enabled: boolean;
  retentionDays: number;
  trackedEvents: string[];
  excludedUsers?: number[];
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface BackgroundJob {
  id: number;
  workspaceId: number;
  type: string;
  payload?: Record <string ,unknown >;
  result?: Record <string ,unknown >;
  status: string;
  errorMessage?: string;
  attempts: number;
  maxAttempts: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  nextRetryAt?: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export interface WebhookDelivery {
  id: number;
  workspaceId: number;
  endpointId: number;
  status: string;
  httpStatus: number;
  requestHeaders?: Record <string ,unknown >;
  requestBody?: string;
  responseHeaders?: Record <string ,unknown >;
  responseBody?: string;
  errorMessage?: string;
  durationMs: number;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface EmailDelivery {
  id: number;
  workspaceId: number;
  recipient: string;
  subject: string;
  status: string;
  errorMessage?: string;
  openedAt?: string;
  clickedAt?: string;
  openCount: number;
  clickCount: number;
  metadata?: Record <string ,unknown >;
  sentById?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  sentBy?: User;
}

export interface SystemHealthMetric {
  id: number;
  workspaceId: number;
  metric: string;
  value: number;
  unit?: string;
  tags?: Record <string ,unknown >;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface WorkspaceQuota {
  id: number;
  workspaceId: number;
  maxUsers: number;
  maxStorageGb: number;
  maxContacts: number;
  maxDeals: number;
  maxProjects: number;
  canUseAI: boolean;
  canUseAPI: boolean;
  canUseAutomation: boolean;
  limits?: Record <string ,number >;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface UsageRecord {
  id: number;
  workspaceId: number;
  entityType: string;
  count: number;
  period: string;
  recordedAt?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface LanguagePack {
  id: number;
  workspaceId: number;
  locale: string;
  name: string;
  nativeName?: string;
  isRtl: boolean;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface TranslationEntry {
  id: number;
  workspaceId: number;
  languagePackId: number;
  key: string;
  value: string;
  namespace?: string;
  approvedById?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  languagePack?: LanguagePack;
  approvedBy?: User;
}

export interface MarketplaceListing {
  id: number;
  type: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
  publisher?: string;
  iconUrl?: string;
  config: Record <string ,unknown >;
  verified: boolean;
  published: boolean;
  installCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  categories?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceReview {
  id: number;
  listingId: number;
  userId: number;
  rating: number;
  content?: string;
  createdAt: string;
  updatedAt: string;
  listing?: MarketplaceListing;
  user?: User;
}

export interface InstalledItem {
  id: number;
  workspaceId: number;
  listingId: number;
  settings?: Record <string ,unknown >;
  active: boolean;
  installedById?: number;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  listing?: MarketplaceListing;
  installedBy?: User;
}

export interface Plugin {
  id: number;
  workspaceId: number;
  name: string;
  version: string;
  author?: string;
  description?: string;
  entryPoint?: string;
  enabled: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface PluginExtension {
  id: number;
  pluginId: number;
  extensionType: string;
  name: string;
  config: Record <string ,unknown >;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  plugin?: Plugin;
}

export type ModelMap = {
  Workspace: Workspace;
  User: User;
  Branch: Branch;
  Contact: Contact;
  Deal: Deal;
  Activity: Activity;
  Product: Product;
  Order: Order;
  OrderItem: OrderItem;
  Invoice: Invoice;
  Employee: Employee;
  Attendance: Attendance;
  LeaveRequest: LeaveRequest;
  EmailCampaign: EmailCampaign;
  EmailTemplate: EmailTemplate;
  LandingPage: LandingPage;
  Form: Form;
  FormSubmission: FormSubmission;
  SocialAccount: SocialAccount;
  SocialPost: SocialPost;
  SocialReply: SocialReply;
  AdCampaign: AdCampaign;
  WordpressSite: WordpressSite;
  WordpressPost: WordpressPost;
  Message: Message;
  Call: Call;
  Meeting: Meeting;
  Ticket: Ticket;
  TicketMessage: TicketMessage;
  Document: Document;
  Notification: Notification;
  AuditLog: AuditLog;
  CustomFieldDef: CustomFieldDef;
  CustomFieldValue: CustomFieldValue;
  Workflow: Workflow;
  EmailSync: EmailSync;
  LiveChatSettings: LiveChatSettings;
  ChatMessage: ChatMessage;
  Project: Project;
  ProjectTask: ProjectTask;
  ProjectMilestone: ProjectMilestone;
  Bot: Bot;
  WidgetSettings: WidgetSettings;
  AIApiKey: AIApiKey;
  AIConversation: AIConversation;
  AIAction: AIAction;
  BotConnection: BotConnection;
  HealthScore: HealthScore;
  NPSResponse: NPSResponse;
  CSATResponse: CSATResponse;
  OnboardingTask: OnboardingTask;
  ChurnPrediction: ChurnPrediction;
  SalesPipeline: SalesPipeline;
  SalesGoal: SalesGoal;
  CommissionPlan: CommissionPlan;
  CommissionEarning: CommissionEarning;
  Quote: Quote;
  QuoteLineItem: QuoteLineItem;
  ProductDiscount: ProductDiscount;
  Territory: Territory;
  Subscription: Subscription;
  SubscriptionPlan: SubscriptionPlan;
  SubscriptionInvoice: SubscriptionInvoice;
  ABTest: ABTest;
  MarketingSegment: MarketingSegment;
  LeadScoreRule: LeadScoreRule;
  MarketingJourney: MarketingJourney;
  SMSCampaign: SMSCampaign;
  PushNotification: PushNotification;
  SocialMention: SocialMention;
  UTMLink: UTMLink;
  SEOConfig: SEOConfig;
  KnowledgeArticle: KnowledgeArticle;
  FAQItem: FAQItem;
  ForumTopic: ForumTopic;
  ForumPost: ForumPost;
  SLAPolicy: SLAPolicy;
  CannedResponse: CannedResponse;
  Macro: Macro;
  EscalationRule: EscalationRule;
  Asset: Asset;
  WorkflowTemplate: WorkflowTemplate;
  WorkflowVersion: WorkflowVersion;
  CustomDashboard: CustomDashboard;
  ScheduledReport: ScheduledReport;
  CohortData: CohortData;
  CLVCalculation: CLVCalculation;
  TwoFactorSetting: TwoFactorSetting;
  UserDevice: UserDevice;
  IPAllowlistEntry: IPAllowlistEntry;
  WebhookEndpoint: WebhookEndpoint;
  OAuthApp: OAuthApp;
  APILogEntry: APILogEntry;
  InternalComment: InternalComment;
  SharedNote: SharedNote;
  Whiteboard: Whiteboard;
  Expense: Expense;
  PaymentGateway: PaymentGateway;
  TaxRate: TaxRate;
  Refund: Refund;
  CalendarEvent: CalendarEvent;
  BookingLink: BookingLink;
  CalendarSync: CalendarSync;
  BrandingConfig: BrandingConfig;
  CustomDomain: CustomDomain;
  FeatureFlag: FeatureFlag;
  BackupRecord: BackupRecord;
  DataRetentionPolicy: DataRetentionPolicy;
  AuditSetting: AuditSetting;
  BackgroundJob: BackgroundJob;
  WebhookDelivery: WebhookDelivery;
  EmailDelivery: EmailDelivery;
  SystemHealthMetric: SystemHealthMetric;
  WorkspaceQuota: WorkspaceQuota;
  UsageRecord: UsageRecord;
  LanguagePack: LanguagePack;
  TranslationEntry: TranslationEntry;
  MarketplaceListing: MarketplaceListing;
  MarketplaceReview: MarketplaceReview;
  InstalledItem: InstalledItem;
  Plugin: Plugin;
  PluginExtension: PluginExtension;
};

export const schema = {
  "Workspace": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "100",
          "not null": true
        }
      },
      "slug": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "50",
          "not null": true
        }
      },
      "plan": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "starter",
          "enum": "(starter,growth,scale,enterprise)"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "settings": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "users": {
        "type": "User[] | undefined",
        "originalType": "User[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "User",
          "foreignKey": "workspaceId"
        }
      },
      "branches": {
        "type": "Branch[] | undefined",
        "originalType": "Branch[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Branch",
          "foreignKey": "workspaceId"
        }
      },
      "contacts": {
        "type": "Contact[] | undefined",
        "originalType": "Contact[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Contact",
          "foreignKey": "workspaceId"
        }
      },
      "deals": {
        "type": "Deal[] | undefined",
        "originalType": "Deal[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Deal",
          "foreignKey": "workspaceId"
        }
      },
      "products": {
        "type": "Product[] | undefined",
        "originalType": "Product[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Product",
          "foreignKey": "workspaceId"
        }
      },
      "employees": {
        "type": "Employee[] | undefined",
        "originalType": "Employee[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "workspaceId"
        }
      },
      "tickets": {
        "type": "Ticket[] | undefined",
        "originalType": "Ticket[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Ticket",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Workspace",
        "fieldName": "users",
        "kind": "onetomany",
        "targetModel": "User",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "User",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "branches",
        "kind": "onetomany",
        "targetModel": "Branch",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Branch",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "contacts",
        "kind": "onetomany",
        "targetModel": "Contact",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Contact",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "deals",
        "kind": "onetomany",
        "targetModel": "Deal",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Deal",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "products",
        "kind": "onetomany",
        "targetModel": "Product",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Product",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "employees",
        "kind": "onetomany",
        "targetModel": "Employee",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Workspace",
        "fieldName": "tickets",
        "kind": "onetomany",
        "targetModel": "Ticket",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetomany": "Ticket",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "workspaces"
  },
  "User": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "email": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "255",
          "not null": true
        }
      },
      "passwordHash": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "255"
        }
      },
      "role": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "employee",
          "enum": "(superadmin,admin,manager,employee,client)"
        }
      },
      "avatarUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "lastLoginAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "preferences": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "activities": {
        "type": "Activity[] | undefined",
        "originalType": "Activity[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "userId"
        }
      },
      "employeeProfile": {
        "type": "Employee[] | undefined",
        "originalType": "Employee[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "userId"
        }
      },
      "calls": {
        "type": "Call[] | undefined",
        "originalType": "Call[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Call",
          "foreignKey": "userId"
        }
      },
      "meetings": {
        "type": "Meeting[] | undefined",
        "originalType": "Meeting[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "userId"
        }
      },
      "notifications": {
        "type": "Notification[] | undefined",
        "originalType": "Notification[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Notification",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "User",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "User",
        "fieldName": "activities",
        "kind": "onetomany",
        "targetModel": "Activity",
        "foreignKey": "userId",
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "User",
        "fieldName": "employeeProfile",
        "kind": "onetomany",
        "targetModel": "Employee",
        "foreignKey": "userId",
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "User",
        "fieldName": "calls",
        "kind": "onetomany",
        "targetModel": "Call",
        "foreignKey": "userId",
        "meta": {
          "@relation onetomany": "Call",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "User",
        "fieldName": "meetings",
        "kind": "onetomany",
        "targetModel": "Meeting",
        "foreignKey": "userId",
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "User",
        "fieldName": "notifications",
        "kind": "onetomany",
        "targetModel": "Notification",
        "foreignKey": "userId",
        "meta": {
          "@relation onetomany": "Notification",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "users"
  },
  "Branch": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "address": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "255"
        }
      },
      "city": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "country": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100"
        }
      },
      "phone": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "30"
        }
      },
      "managerId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "manager": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "managerId"
        }
      },
      "employees": {
        "type": "Employee[] | undefined",
        "originalType": "Employee[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "branchId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Branch",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Branch",
        "fieldName": "manager",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "managerId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "managerId"
        }
      },
      {
        "sourceModel": "Branch",
        "fieldName": "employees",
        "kind": "onetomany",
        "targetModel": "Employee",
        "foreignKey": "branchId",
        "meta": {
          "@relation onetomany": "Employee",
          "foreignKey": "branchId"
        }
      }
    ],
    "table": "branches"
  },
  "Contact": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "firstName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "lastName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "email": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "unique": true,
          "length": "255"
        }
      },
      "phone": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "30"
        }
      },
      "company": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "title": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "source": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "default": "direct",
          "length": "50"
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "lead",
          "enum": "(lead,active,qualified,inactive,unsubscribed)"
        }
      },
      "assignedTo": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "tags": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "customFields": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "lastContactedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "dealScore": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "assignee": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      "deals": {
        "type": "Deal[] | undefined",
        "originalType": "Deal[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Deal",
          "foreignKey": "contactId"
        }
      },
      "activities": {
        "type": "Activity[] | undefined",
        "originalType": "Activity[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "contactId"
        }
      },
      "messages": {
        "type": "Message[] | undefined",
        "originalType": "Message[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Message",
          "foreignKey": "contactId"
        }
      },
      "calls": {
        "type": "Call[] | undefined",
        "originalType": "Call[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Call",
          "foreignKey": "contactId"
        }
      },
      "meetings": {
        "type": "Meeting[] | undefined",
        "originalType": "Meeting[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "contactId"
        }
      },
      "tickets": {
        "type": "Ticket[] | undefined",
        "originalType": "Ticket[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Ticket",
          "foreignKey": "contactId"
        }
      },
      "invoices": {
        "type": "Invoice[] | undefined",
        "originalType": "Invoice[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Invoice",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Contact",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "assignee",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "assignedTo",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "deals",
        "kind": "onetomany",
        "targetModel": "Deal",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Deal",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "activities",
        "kind": "onetomany",
        "targetModel": "Activity",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "messages",
        "kind": "onetomany",
        "targetModel": "Message",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Message",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "calls",
        "kind": "onetomany",
        "targetModel": "Call",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Call",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "meetings",
        "kind": "onetomany",
        "targetModel": "Meeting",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "tickets",
        "kind": "onetomany",
        "targetModel": "Ticket",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Ticket",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Contact",
        "fieldName": "invoices",
        "kind": "onetomany",
        "targetModel": "Invoice",
        "foreignKey": "contactId",
        "meta": {
          "@relation onetomany": "Invoice",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "contacts"
  },
  "Deal": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "value": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "stage": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "lead",
          "enum": "(lead,qualified,proposal,negotiation,closed-won,closed-lost)"
        }
      },
      "probability": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "10"
        }
      },
      "expectedCloseDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "assignedTo": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "branchId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "wonAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "lostAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "lostReason": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "assignee": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      "activities": {
        "type": "Activity[] | undefined",
        "originalType": "Activity[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "dealId"
        }
      },
      "meetings": {
        "type": "Meeting[] | undefined",
        "originalType": "Meeting[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "dealId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Deal",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Deal",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Deal",
        "fieldName": "assignee",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "assignedTo",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      {
        "sourceModel": "Deal",
        "fieldName": "activities",
        "kind": "onetomany",
        "targetModel": "Activity",
        "foreignKey": "dealId",
        "meta": {
          "@relation onetomany": "Activity",
          "foreignKey": "dealId"
        }
      },
      {
        "sourceModel": "Deal",
        "fieldName": "meetings",
        "kind": "onetomany",
        "targetModel": "Meeting",
        "foreignKey": "dealId",
        "meta": {
          "@relation onetomany": "Meeting",
          "foreignKey": "dealId"
        }
      }
    ],
    "table": "deals"
  },
  "Activity": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(call,email,meeting,task,note,deal-status-change,social)",
          "not null": true
        }
      },
      "subject": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "body": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "dealId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "dueAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "deal": {
        "type": "Deal | undefined",
        "originalType": "Deal",
        "optional": true,
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Activity",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Activity",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Activity",
        "fieldName": "deal",
        "kind": "manytoone",
        "targetModel": "Deal",
        "foreignKey": "dealId",
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      {
        "sourceModel": "Activity",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "activities"
  },
  "Product": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "sku": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "unique": true,
          "length": "50"
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "price": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0.00"
        }
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "stock": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "default": "0"
        }
      },
      "category": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "imageUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "isService": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "orderItems": {
        "type": "OrderItem[] | undefined",
        "originalType": "OrderItem[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "OrderItem",
          "foreignKey": "productId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Product",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Product",
        "fieldName": "orderItems",
        "kind": "onetomany",
        "targetModel": "OrderItem",
        "foreignKey": "productId",
        "meta": {
          "@relation onetomany": "OrderItem",
          "foreignKey": "productId"
        }
      }
    ],
    "table": "products"
  },
  "Order": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,confirmed,processing,shipped,delivered,cancelled,refunded)"
        }
      },
      "totalAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "paidAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "branchId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "items": {
        "type": "OrderItem[] | undefined",
        "originalType": "OrderItem[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "OrderItem",
          "foreignKey": "orderId"
        }
      },
      "invoice": {
        "type": "Invoice | undefined",
        "originalType": "Invoice",
        "optional": true,
        "meta": {
          "@relation onetoone": "Invoice",
          "foreignKey": "orderId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Order",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Order",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Order",
        "fieldName": "items",
        "kind": "onetomany",
        "targetModel": "OrderItem",
        "foreignKey": "orderId",
        "meta": {
          "@relation onetomany": "OrderItem",
          "foreignKey": "orderId"
        }
      },
      {
        "sourceModel": "Order",
        "fieldName": "invoice",
        "kind": "onetoone",
        "targetModel": "Invoice",
        "foreignKey": "orderId",
        "meta": {
          "@relation onetoone": "Invoice",
          "foreignKey": "orderId"
        }
      }
    ],
    "table": "orders"
  },
  "OrderItem": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "orderId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "productId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "quantity": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "unitPrice": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "order": {
        "type": "Order | undefined",
        "originalType": "Order",
        "optional": true,
        "meta": {
          "@relation manytoone": "Order",
          "foreignKey": "orderId",
          "onDelete": "CASCADE"
        }
      },
      "product": {
        "type": "Product | undefined",
        "originalType": "Product",
        "optional": true,
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "OrderItem",
        "fieldName": "order",
        "kind": "manytoone",
        "targetModel": "Order",
        "foreignKey": "orderId",
        "meta": {
          "@relation manytoone": "Order",
          "foreignKey": "orderId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "OrderItem",
        "fieldName": "product",
        "kind": "manytoone",
        "targetModel": "Product",
        "foreignKey": "productId",
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    ],
    "table": "order_items"
  },
  "Invoice": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "orderId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,sent,paid,overdue,cancelled)"
        }
      },
      "dueDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "totalAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "paidAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "pdfUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "invoiceNumber": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "50"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "order": {
        "type": "Order | undefined",
        "originalType": "Order",
        "optional": true,
        "meta": {
          "@relation onetoone": "Order",
          "foreignKey": "orderId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Invoice",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Invoice",
        "fieldName": "order",
        "kind": "onetoone",
        "targetModel": "Order",
        "foreignKey": "orderId",
        "meta": {
          "@relation onetoone": "Order",
          "foreignKey": "orderId"
        }
      },
      {
        "sourceModel": "Invoice",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "invoices"
  },
  "Employee": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@unique": true,
          "index": true,
          "not null": true
        }
      },
      "branchId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "department": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "jobTitle": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "salary": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "startDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      "branch": {
        "type": "Branch | undefined",
        "originalType": "Branch",
        "optional": true,
        "meta": {
          "@relation manytoone": "Branch",
          "foreignKey": "branchId"
        }
      },
      "attendance": {
        "type": "Attendance[] | undefined",
        "originalType": "Attendance[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Attendance",
          "foreignKey": "employeeId"
        }
      },
      "leaveRequests": {
        "type": "LeaveRequest[] | undefined",
        "originalType": "LeaveRequest[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "LeaveRequest",
          "foreignKey": "employeeId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Employee",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Employee",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "Employee",
        "fieldName": "branch",
        "kind": "manytoone",
        "targetModel": "Branch",
        "foreignKey": "branchId",
        "meta": {
          "@relation manytoone": "Branch",
          "foreignKey": "branchId"
        }
      },
      {
        "sourceModel": "Employee",
        "fieldName": "attendance",
        "kind": "onetomany",
        "targetModel": "Attendance",
        "foreignKey": "employeeId",
        "meta": {
          "@relation onetomany": "Attendance",
          "foreignKey": "employeeId"
        }
      },
      {
        "sourceModel": "Employee",
        "fieldName": "leaveRequests",
        "kind": "onetomany",
        "targetModel": "LeaveRequest",
        "foreignKey": "employeeId",
        "meta": {
          "@relation onetomany": "LeaveRequest",
          "foreignKey": "employeeId"
        }
      }
    ],
    "table": "employees"
  },
  "Attendance": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "employeeId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "clockedInAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "clockedOutAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "employee": {
        "type": "Employee | undefined",
        "originalType": "Employee",
        "optional": true,
        "meta": {
          "@relation manytoone": "Employee",
          "foreignKey": "employeeId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Attendance",
        "fieldName": "employee",
        "kind": "manytoone",
        "targetModel": "Employee",
        "foreignKey": "employeeId",
        "meta": {
          "@relation manytoone": "Employee",
          "foreignKey": "employeeId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "attendance"
  },
  "LeaveRequest": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "employeeId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(vacation,sick,personal,other)",
          "not null": true
        }
      },
      "startDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "endDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,approved,rejected,cancelled)"
        }
      },
      "reason": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "approvedBy": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "employee": {
        "type": "Employee | undefined",
        "originalType": "Employee",
        "optional": true,
        "meta": {
          "@relation manytoone": "Employee",
          "foreignKey": "employeeId",
          "onDelete": "CASCADE"
        }
      },
      "approver": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "approvedBy"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "LeaveRequest",
        "fieldName": "employee",
        "kind": "manytoone",
        "targetModel": "Employee",
        "foreignKey": "employeeId",
        "meta": {
          "@relation manytoone": "Employee",
          "foreignKey": "employeeId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "LeaveRequest",
        "fieldName": "approver",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "approvedBy",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "approvedBy"
        }
      }
    ],
    "table": "leave_requests"
  },
  "EmailCampaign": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "templateId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "subject": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,scheduled,sending,sent,failed)"
        }
      },
      "sentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "scheduledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "recipientCount": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "openCount": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "clickCount": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "targetFilters": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "template": {
        "type": "EmailTemplate | undefined",
        "originalType": "EmailTemplate",
        "optional": true,
        "meta": {
          "@relation manytoone": "EmailTemplate",
          "foreignKey": "templateId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "EmailCampaign",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "EmailCampaign",
        "fieldName": "template",
        "kind": "manytoone",
        "targetModel": "EmailTemplate",
        "foreignKey": "templateId",
        "meta": {
          "@relation manytoone": "EmailTemplate",
          "foreignKey": "templateId"
        }
      }
    ],
    "table": "email_campaigns"
  },
  "EmailTemplate": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "subject": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "variables": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,archived)"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "campaigns": {
        "type": "EmailCampaign[] | undefined",
        "originalType": "EmailCampaign[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "EmailCampaign",
          "foreignKey": "templateId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "EmailTemplate",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "EmailTemplate",
        "fieldName": "campaigns",
        "kind": "onetomany",
        "targetModel": "EmailCampaign",
        "foreignKey": "templateId",
        "meta": {
          "@relation onetomany": "EmailCampaign",
          "foreignKey": "templateId"
        }
      }
    ],
    "table": "email_templates"
  },
  "LandingPage": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "slug": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "100",
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "contentJson": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "published": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "views": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "conversions": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "LandingPage",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "landing_pages"
  },
  "Form": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "fieldsJson": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "submissions": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "submissionsList": {
        "type": "FormSubmission[] | undefined",
        "originalType": "FormSubmission[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "FormSubmission",
          "foreignKey": "formId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Form",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Form",
        "fieldName": "submissionsList",
        "kind": "onetomany",
        "targetModel": "FormSubmission",
        "foreignKey": "formId",
        "meta": {
          "@relation onetomany": "FormSubmission",
          "foreignKey": "formId"
        }
      }
    ],
    "table": "forms"
  },
  "FormSubmission": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "formId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "data": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "form": {
        "type": "Form | undefined",
        "originalType": "Form",
        "optional": true,
        "meta": {
          "@relation manytoone": "Form",
          "foreignKey": "formId",
          "onDelete": "CASCADE"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "FormSubmission",
        "fieldName": "form",
        "kind": "manytoone",
        "targetModel": "Form",
        "foreignKey": "formId",
        "meta": {
          "@relation manytoone": "Form",
          "foreignKey": "formId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "FormSubmission",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "form_submissions"
  },
  "SocialAccount": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "platform": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(facebook,instagram,twitter,linkedin,tiktok,youtube)",
          "not null": true
        }
      },
      "accountName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "accessToken": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "refreshToken": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "expiresAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "profileImageUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "connectedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "posts": {
        "type": "SocialPost[] | undefined",
        "originalType": "SocialPost[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "SocialPost",
          "foreignKey": "socialAccountId"
        }
      },
      "adCampaigns": {
        "type": "AdCampaign[] | undefined",
        "originalType": "AdCampaign[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "AdCampaign",
          "foreignKey": "socialAccountId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SocialAccount",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "SocialAccount",
        "fieldName": "posts",
        "kind": "onetomany",
        "targetModel": "SocialPost",
        "foreignKey": "socialAccountId",
        "meta": {
          "@relation onetomany": "SocialPost",
          "foreignKey": "socialAccountId"
        }
      },
      {
        "sourceModel": "SocialAccount",
        "fieldName": "adCampaigns",
        "kind": "onetomany",
        "targetModel": "AdCampaign",
        "foreignKey": "socialAccountId",
        "meta": {
          "@relation onetomany": "AdCampaign",
          "foreignKey": "socialAccountId"
        }
      }
    ],
    "table": "social_accounts"
  },
  "SocialPost": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "socialAccountId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "content": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "mediaUrls": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,scheduled,published,failed)"
        }
      },
      "scheduledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "publishedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "platformPostId": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "likes": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "comments": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "shares": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "reach": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "account": {
        "type": "SocialAccount | undefined",
        "originalType": "SocialAccount",
        "optional": true,
        "meta": {
          "@relation manytoone": "SocialAccount",
          "foreignKey": "socialAccountId",
          "onDelete": "CASCADE"
        }
      },
      "replies": {
        "type": "SocialReply[] | undefined",
        "originalType": "SocialReply[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "SocialReply",
          "foreignKey": "socialPostId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SocialPost",
        "fieldName": "account",
        "kind": "manytoone",
        "targetModel": "SocialAccount",
        "foreignKey": "socialAccountId",
        "meta": {
          "@relation manytoone": "SocialAccount",
          "foreignKey": "socialAccountId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "SocialPost",
        "fieldName": "replies",
        "kind": "onetomany",
        "targetModel": "SocialReply",
        "foreignKey": "socialPostId",
        "meta": {
          "@relation onetomany": "SocialReply",
          "foreignKey": "socialPostId"
        }
      }
    ],
    "table": "social_posts"
  },
  "SocialReply": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "socialPostId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "platformCommentId": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "authorName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "content": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "repliedContent": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "repliedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "post": {
        "type": "SocialPost | undefined",
        "originalType": "SocialPost",
        "optional": true,
        "meta": {
          "@relation manytoone": "SocialPost",
          "foreignKey": "socialPostId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SocialReply",
        "fieldName": "post",
        "kind": "manytoone",
        "targetModel": "SocialPost",
        "foreignKey": "socialPostId",
        "meta": {
          "@relation manytoone": "SocialPost",
          "foreignKey": "socialPostId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "social_replies"
  },
  "AdCampaign": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "socialAccountId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "platformCampaignId": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "objective": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,paused,ended,archived)"
        }
      },
      "budget": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "spent": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "impressions": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "clicks": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "conversions": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "startDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "endDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "socialAccount": {
        "type": "SocialAccount | undefined",
        "originalType": "SocialAccount",
        "optional": true,
        "meta": {
          "@relation manytoone": "SocialAccount",
          "foreignKey": "socialAccountId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AdCampaign",
        "fieldName": "socialAccount",
        "kind": "manytoone",
        "targetModel": "SocialAccount",
        "foreignKey": "socialAccountId",
        "meta": {
          "@relation manytoone": "SocialAccount",
          "foreignKey": "socialAccountId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "ad_campaigns"
  },
  "WordpressSite": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "siteUrl": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "appUsername": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "appPassword": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "siteName": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "connectedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "posts": {
        "type": "WordpressPost[] | undefined",
        "originalType": "WordpressPost[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "WordpressPost",
          "foreignKey": "wordpressSiteId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WordpressSite",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "WordpressSite",
        "fieldName": "posts",
        "kind": "onetomany",
        "targetModel": "WordpressPost",
        "foreignKey": "wordpressSiteId",
        "meta": {
          "@relation onetomany": "WordpressPost",
          "foreignKey": "wordpressSiteId"
        }
      }
    ],
    "table": "wordpress_sites"
  },
  "WordpressPost": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "wordpressSiteId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "platformPostId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "contentHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,scheduled,published,failed)"
        }
      },
      "scheduledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "publishedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "categories": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "tags": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "featuredImageUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "site": {
        "type": "WordpressSite | undefined",
        "originalType": "WordpressSite",
        "optional": true,
        "meta": {
          "@relation manytoone": "WordpressSite",
          "foreignKey": "wordpressSiteId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WordpressPost",
        "fieldName": "site",
        "kind": "manytoone",
        "targetModel": "WordpressSite",
        "foreignKey": "wordpressSiteId",
        "meta": {
          "@relation manytoone": "WordpressSite",
          "foreignKey": "wordpressSiteId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "wordpress_posts"
  },
  "Message": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "channel": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "direction": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(inbound,outbound)",
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "fromAddress": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "toAddress": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "subject": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "255"
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "sent",
          "enum": "(sent,delivered,read,failed)"
        }
      },
      "sentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "readAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Message",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Message",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "messages"
  },
  "Call": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "direction": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(inbound,outbound)",
          "not null": true
        }
      },
      "phoneNumber": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "30",
          "not null": true
        }
      },
      "duration": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@default": "0"
        }
      },
      "recordingUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "transcript": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "sentiment": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "50"
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Call",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Call",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Call",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "calls"
  },
  "Meeting": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "dealId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "scheduledAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "duration": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "default": "30"
        }
      },
      "meetingUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "scheduled",
          "enum": "(scheduled,ongoing,completed,cancelled)"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "deal": {
        "type": "Deal | undefined",
        "originalType": "Deal",
        "optional": true,
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Meeting",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Meeting",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Meeting",
        "fieldName": "deal",
        "kind": "manytoone",
        "targetModel": "Deal",
        "foreignKey": "dealId",
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      {
        "sourceModel": "Meeting",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "meetings"
  },
  "Ticket": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "subject": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "open",
          "enum": "(open,waiting,answered,resolved,closed)"
        }
      },
      "priority": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "medium",
          "enum": "(low,medium,high,urgent)"
        }
      },
      "assignedTo": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "resolvedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "assignee": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      "messages": {
        "type": "TicketMessage[] | undefined",
        "originalType": "TicketMessage[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "TicketMessage",
          "foreignKey": "ticketId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Ticket",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Ticket",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Ticket",
        "fieldName": "assignee",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "assignedTo",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      },
      {
        "sourceModel": "Ticket",
        "fieldName": "messages",
        "kind": "onetomany",
        "targetModel": "TicketMessage",
        "foreignKey": "ticketId",
        "meta": {
          "@relation onetomany": "TicketMessage",
          "foreignKey": "ticketId"
        }
      }
    ],
    "table": "tickets"
  },
  "TicketMessage": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "ticketId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "isFromClient": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "ticket": {
        "type": "Ticket | undefined",
        "originalType": "Ticket",
        "optional": true,
        "meta": {
          "@relation manytoone": "Ticket",
          "foreignKey": "ticketId",
          "onDelete": "CASCADE"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "TicketMessage",
        "fieldName": "ticket",
        "kind": "manytoone",
        "targetModel": "Ticket",
        "foreignKey": "ticketId",
        "meta": {
          "@relation manytoone": "Ticket",
          "foreignKey": "ticketId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "TicketMessage",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "ticket_messages"
  },
  "Document": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "contentJson": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "pdfUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "dealId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,final,sent,signed,expired)"
        }
      },
      "signedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "deal": {
        "type": "Deal | undefined",
        "originalType": "Deal",
        "optional": true,
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Document",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Document",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Document",
        "fieldName": "deal",
        "kind": "manytoone",
        "targetModel": "Deal",
        "foreignKey": "dealId",
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      }
    ],
    "table": "documents"
  },
  "Notification": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "readAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "meta": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Notification",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Notification",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "notifications"
  },
  "AuditLog": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "action": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "entity": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "entityId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "meta": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AuditLog",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "AuditLog",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "audit_logs"
  },
  "CustomFieldDef": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(contact,deal,ticket,order,product,lead)",
          "not null": true
        }
      },
      "fieldName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "fieldType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "options": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "required": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CustomFieldDef",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "custom_field_defs"
  },
  "CustomFieldValue": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "entityId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "fieldDefId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "value": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "fieldDef": {
        "type": "CustomFieldDef | undefined",
        "originalType": "CustomFieldDef",
        "optional": true,
        "meta": {
          "@relation manytoone": "CustomFieldDef",
          "foreignKey": "fieldDefId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CustomFieldValue",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CustomFieldValue",
        "fieldName": "fieldDef",
        "kind": "manytoone",
        "targetModel": "CustomFieldDef",
        "foreignKey": "fieldDefId",
        "meta": {
          "@relation manytoone": "CustomFieldDef",
          "foreignKey": "fieldDefId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "custom_field_values"
  },
  "Workflow": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "triggerType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "triggerConfig": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "actions": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "runCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Workflow",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "workflows"
  },
  "EmailSync": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(gmail,outlook)",
          "not null": true
        }
      },
      "accessToken": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "refreshToken": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "expiresAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "email": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "lastSyncedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "EmailSync",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "EmailSync",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "email_syncs"
  },
  "LiveChatSettings": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@unique": true,
          "not null": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "widgetColor": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "welcomeMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "awayMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "collectEmail": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "showAgentNames": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation onetoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "LiveChatSettings",
        "fieldName": "workspace",
        "kind": "onetoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "live_chat_settings"
  },
  "ChatMessage": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "visitorId": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "visitorName": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "visitorEmail": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "255"
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "sender": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "visitor",
          "enum": "(visitor,agent,system)"
        }
      },
      "readAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": true,
        "meta": {
          "index": true,
          "default": "CURRENT_TIMESTAMP"
        }
      }
    },
    "relations": [],
    "table": "chat_messages"
  },
  "Project": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,on_hold,completed,cancelled)"
        }
      },
      "priority": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "medium",
          "enum": "(low,medium,high,urgent)"
        }
      },
      "ownerId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "startDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "endDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "tags": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "owner": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "ownerId"
        }
      },
      "tasks": {
        "type": "ProjectTask[] | undefined",
        "originalType": "ProjectTask[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "projectId"
        }
      },
      "milestones": {
        "type": "ProjectMilestone[] | undefined",
        "originalType": "ProjectMilestone[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "ProjectMilestone",
          "foreignKey": "projectId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Project",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Project",
        "fieldName": "owner",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "ownerId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "ownerId"
        }
      },
      {
        "sourceModel": "Project",
        "fieldName": "tasks",
        "kind": "onetomany",
        "targetModel": "ProjectTask",
        "foreignKey": "projectId",
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "projectId"
        }
      },
      {
        "sourceModel": "Project",
        "fieldName": "milestones",
        "kind": "onetomany",
        "targetModel": "ProjectMilestone",
        "foreignKey": "projectId",
        "meta": {
          "@relation onetomany": "ProjectMilestone",
          "foreignKey": "projectId"
        }
      }
    ],
    "table": "projects"
  },
  "ProjectTask": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "projectId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "todo",
          "enum": "(todo,in_progress,review,done)"
        }
      },
      "priority": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "medium",
          "enum": "(low,medium,high,urgent)"
        }
      },
      "assigneeId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "milestoneId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "dueDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "estimatedHours": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "actualHours": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "parentTaskId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "project": {
        "type": "Project | undefined",
        "originalType": "Project",
        "optional": true,
        "meta": {
          "@relation manytoone": "Project",
          "foreignKey": "projectId",
          "onDelete": "CASCADE"
        }
      },
      "assignee": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assigneeId"
        }
      },
      "milestone": {
        "type": "ProjectMilestone | undefined",
        "originalType": "ProjectMilestone",
        "optional": true,
        "meta": {
          "@relation manytoone": "ProjectMilestone",
          "foreignKey": "milestoneId"
        }
      },
      "parentTask": {
        "type": "ProjectTask | undefined",
        "originalType": "ProjectTask",
        "optional": true,
        "meta": {
          "@relation manytoone": "ProjectTask",
          "foreignKey": "parentTaskId"
        }
      },
      "subtasks": {
        "type": "ProjectTask[] | undefined",
        "originalType": "ProjectTask[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "parentTaskId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ProjectTask",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "ProjectTask",
        "fieldName": "project",
        "kind": "manytoone",
        "targetModel": "Project",
        "foreignKey": "projectId",
        "meta": {
          "@relation manytoone": "Project",
          "foreignKey": "projectId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "ProjectTask",
        "fieldName": "assignee",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "assigneeId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assigneeId"
        }
      },
      {
        "sourceModel": "ProjectTask",
        "fieldName": "milestone",
        "kind": "manytoone",
        "targetModel": "ProjectMilestone",
        "foreignKey": "milestoneId",
        "meta": {
          "@relation manytoone": "ProjectMilestone",
          "foreignKey": "milestoneId"
        }
      },
      {
        "sourceModel": "ProjectTask",
        "fieldName": "parentTask",
        "kind": "manytoone",
        "targetModel": "ProjectTask",
        "foreignKey": "parentTaskId",
        "meta": {
          "@relation manytoone": "ProjectTask",
          "foreignKey": "parentTaskId"
        }
      },
      {
        "sourceModel": "ProjectTask",
        "fieldName": "subtasks",
        "kind": "onetomany",
        "targetModel": "ProjectTask",
        "foreignKey": "parentTaskId",
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "parentTaskId"
        }
      }
    ],
    "table": "project_tasks"
  },
  "ProjectMilestone": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "projectId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "dueDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,in_progress,completed)"
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "project": {
        "type": "Project | undefined",
        "originalType": "Project",
        "optional": true,
        "meta": {
          "@relation manytoone": "Project",
          "foreignKey": "projectId",
          "onDelete": "CASCADE"
        }
      },
      "tasks": {
        "type": "ProjectTask[] | undefined",
        "originalType": "ProjectTask[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "milestoneId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ProjectMilestone",
        "fieldName": "project",
        "kind": "manytoone",
        "targetModel": "Project",
        "foreignKey": "projectId",
        "meta": {
          "@relation manytoone": "Project",
          "foreignKey": "projectId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "ProjectMilestone",
        "fieldName": "tasks",
        "kind": "onetomany",
        "targetModel": "ProjectTask",
        "foreignKey": "milestoneId",
        "meta": {
          "@relation onetomany": "ProjectTask",
          "foreignKey": "milestoneId"
        }
      }
    ],
    "table": "project_milestones"
  },
  "Bot": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "channel": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(chat,email,social,slack,whatsapp)",
          "not null": true
        }
      },
      "triggerKeywords": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "responseTemplate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "500",
          "not null": true
        }
      },
      "aiModel": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(openai,gemini,deepseek,claude,qwen,kimi,keyword)",
          "default": "keyword"
        }
      },
      "config": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "totalConversations": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Bot",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "bots"
  },
  "WidgetSettings": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@unique": true,
          "index": true,
          "not null": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "primaryColor": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "10",
          "default": "#6366f1"
        }
      },
      "welcomeMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "awayMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "collectEmail": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "showAgentNames": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "enableBots": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "defaultBotId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "allowedDomains": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "customCss": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "500",
          "nullable": true
        }
      },
      "position": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "100",
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation onetoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "defaultBot": {
        "type": "Bot | undefined",
        "originalType": "Bot",
        "optional": true,
        "meta": {
          "@relation manytoone": "Bot",
          "foreignKey": "defaultBotId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WidgetSettings",
        "fieldName": "workspace",
        "kind": "onetoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation onetoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "WidgetSettings",
        "fieldName": "defaultBot",
        "kind": "manytoone",
        "targetModel": "Bot",
        "foreignKey": "defaultBotId",
        "meta": {
          "@relation manytoone": "Bot",
          "foreignKey": "defaultBotId"
        }
      }
    ],
    "table": "widget_settings"
  },
  "AIApiKey": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(openai,gemini,deepseek,claude,qwen,kimi,nvidia,opencode)",
          "not null": true
        }
      },
      "apiKey": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "scope": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "user",
          "enum": "(user,workspace)"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "lastUsedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AIApiKey",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "AIApiKey",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "ai_api_keys"
  },
  "AIConversation": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "messages": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,archived)"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AIConversation",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "AIConversation",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "ai_conversations"
  },
  "AIAction": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "conversationId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "botConnectionId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "actionType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "actionPayload": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "result": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,completed,failed)"
        }
      },
      "errorMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      "conversation": {
        "type": "AIConversation | undefined",
        "originalType": "AIConversation",
        "optional": true,
        "meta": {
          "@relation manytoone": "AIConversation",
          "foreignKey": "conversationId"
        }
      },
      "botConnection": {
        "type": "BotConnection | undefined",
        "originalType": "BotConnection",
        "optional": true,
        "meta": {
          "@relation manytoone": "BotConnection",
          "foreignKey": "botConnectionId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AIAction",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "AIAction",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "AIAction",
        "fieldName": "conversation",
        "kind": "manytoone",
        "targetModel": "AIConversation",
        "foreignKey": "conversationId",
        "meta": {
          "@relation manytoone": "AIConversation",
          "foreignKey": "conversationId"
        }
      },
      {
        "sourceModel": "AIAction",
        "fieldName": "botConnection",
        "kind": "manytoone",
        "targetModel": "BotConnection",
        "foreignKey": "botConnectionId",
        "meta": {
          "@relation manytoone": "BotConnection",
          "foreignKey": "botConnectionId"
        }
      }
    ],
    "table": "ai_actions"
  },
  "BotConnection": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "200",
          "not null": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "apiKey": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "64",
          "not null": true
        }
      },
      "apiSecret": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,suspended,revoked)"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "lastUsedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "expiresAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "allowedActions": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "totalRequests": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "deletedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@softDelete": true
        }
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "owner": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      "actions": {
        "type": "AIAction[] | undefined",
        "originalType": "AIAction[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "AIAction",
          "foreignKey": "botConnectionId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "BotConnection",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "BotConnection",
        "fieldName": "owner",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "BotConnection",
        "fieldName": "actions",
        "kind": "onetomany",
        "targetModel": "AIAction",
        "foreignKey": "botConnectionId",
        "meta": {
          "@relation onetomany": "AIAction",
          "foreignKey": "botConnectionId"
        }
      }
    ],
    "table": "bot_connections"
  },
  "HealthScore": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "score": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "category": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "50",
          "nullable": true
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "factors": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "HealthScore",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "HealthScore",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "health_scores"
  },
  "NPSResponse": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "score": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "comment": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "surveyId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "NPSResponse",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "NPSResponse",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "nps_responses"
  },
  "CSATResponse": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "ticketId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "score": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "comment": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "ticket": {
        "type": "Ticket | undefined",
        "originalType": "Ticket",
        "optional": true,
        "meta": {
          "@relation manytoone": "Ticket",
          "foreignKey": "ticketId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CSATResponse",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CSATResponse",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "CSATResponse",
        "fieldName": "ticket",
        "kind": "manytoone",
        "targetModel": "Ticket",
        "foreignKey": "ticketId",
        "meta": {
          "@relation manytoone": "Ticket",
          "foreignKey": "ticketId"
        }
      }
    ],
    "table": "csat_responses"
  },
  "OnboardingTask": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,in_progress,completed,skipped)"
        }
      },
      "dueDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "assignedTo": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "assignee": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "OnboardingTask",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "OnboardingTask",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "OnboardingTask",
        "fieldName": "assignee",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "assignedTo",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "assignedTo"
        }
      }
    ],
    "table": "onboarding_tasks"
  },
  "ChurnPrediction": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "riskScore": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "riskLevel": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "factors": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "predictedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ChurnPrediction",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "ChurnPrediction",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "churn_predictions"
  },
  "SalesPipeline": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "stages": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "isDefault": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SalesPipeline",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "sales_pipelines"
  },
  "SalesGoal": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "targetAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "period": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "periodType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "achievedAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "startDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "endDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SalesGoal",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "SalesGoal",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "sales_goals"
  },
  "CommissionPlan": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "rateType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "rateValue": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "minDealValue": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "maxDealValue": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "tiers": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CommissionPlan",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "commission_plans"
  },
  "CommissionEarning": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "dealId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "planId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "amount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,approved,paid,cancelled)"
        }
      },
      "paidAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      "deal": {
        "type": "Deal | undefined",
        "originalType": "Deal",
        "optional": true,
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      "plan": {
        "type": "CommissionPlan | undefined",
        "originalType": "CommissionPlan",
        "optional": true,
        "meta": {
          "@relation manytoone": "CommissionPlan",
          "foreignKey": "planId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CommissionEarning",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CommissionEarning",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "CommissionEarning",
        "fieldName": "deal",
        "kind": "manytoone",
        "targetModel": "Deal",
        "foreignKey": "dealId",
        "meta": {
          "@relation manytoone": "Deal",
          "foreignKey": "dealId"
        }
      },
      {
        "sourceModel": "CommissionEarning",
        "fieldName": "plan",
        "kind": "manytoone",
        "targetModel": "CommissionPlan",
        "foreignKey": "planId",
        "meta": {
          "@relation manytoone": "CommissionPlan",
          "foreignKey": "planId"
        }
      }
    ],
    "table": "commission_earnings"
  },
  "Quote": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "quoteNumber": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "50",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,sent,accepted,rejected,expired,cancelled)"
        }
      },
      "subtotal": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "taxRate": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "taxAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "discountAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "total": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "validUntil": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "sentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "acceptedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "terms": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "lineItems": {
        "type": "QuoteLineItem[] | undefined",
        "originalType": "QuoteLineItem[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "QuoteLineItem",
          "foreignKey": "quoteId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Quote",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Quote",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Quote",
        "fieldName": "lineItems",
        "kind": "onetomany",
        "targetModel": "QuoteLineItem",
        "foreignKey": "quoteId",
        "meta": {
          "@relation onetomany": "QuoteLineItem",
          "foreignKey": "quoteId"
        }
      }
    ],
    "table": "quotes"
  },
  "QuoteLineItem": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "quoteId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "productId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "quantity": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "unitPrice": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "discountPercent": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "discountAmount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "total": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "quote": {
        "type": "Quote | undefined",
        "originalType": "Quote",
        "optional": true,
        "meta": {
          "@relation manytoone": "Quote",
          "foreignKey": "quoteId",
          "onDelete": "CASCADE"
        }
      },
      "product": {
        "type": "Product | undefined",
        "originalType": "Product",
        "optional": true,
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "QuoteLineItem",
        "fieldName": "quote",
        "kind": "manytoone",
        "targetModel": "Quote",
        "foreignKey": "quoteId",
        "meta": {
          "@relation manytoone": "Quote",
          "foreignKey": "quoteId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "QuoteLineItem",
        "fieldName": "product",
        "kind": "manytoone",
        "targetModel": "Product",
        "foreignKey": "productId",
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    ],
    "table": "quote_line_items"
  },
  "ProductDiscount": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "productId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "discountType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "discountValue": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "minQuantity": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "maxQuantity": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "startDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "endDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "product": {
        "type": "Product | undefined",
        "originalType": "Product",
        "optional": true,
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ProductDiscount",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "ProductDiscount",
        "fieldName": "product",
        "kind": "manytoone",
        "targetModel": "Product",
        "foreignKey": "productId",
        "meta": {
          "@relation manytoone": "Product",
          "foreignKey": "productId"
        }
      }
    ],
    "table": "product_discounts"
  },
  "Territory": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "regions": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "managerId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "manager": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "managerId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Territory",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Territory",
        "fieldName": "manager",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "managerId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "managerId"
        }
      }
    ],
    "table": "territories"
  },
  "Subscription": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "planId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "active",
          "enum": "(active,paused,cancelled,expired,trialing)"
        }
      },
      "startDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "endDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "nextBillingDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "amount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "cancelledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      "plan": {
        "type": "SubscriptionPlan | undefined",
        "originalType": "SubscriptionPlan",
        "optional": true,
        "meta": {
          "@relation manytoone": "SubscriptionPlan",
          "foreignKey": "planId"
        }
      },
      "invoices": {
        "type": "SubscriptionInvoice[] | undefined",
        "originalType": "SubscriptionInvoice[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "SubscriptionInvoice",
          "foreignKey": "subscriptionId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Subscription",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Subscription",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      },
      {
        "sourceModel": "Subscription",
        "fieldName": "plan",
        "kind": "manytoone",
        "targetModel": "SubscriptionPlan",
        "foreignKey": "planId",
        "meta": {
          "@relation manytoone": "SubscriptionPlan",
          "foreignKey": "planId"
        }
      },
      {
        "sourceModel": "Subscription",
        "fieldName": "invoices",
        "kind": "onetomany",
        "targetModel": "SubscriptionInvoice",
        "foreignKey": "subscriptionId",
        "meta": {
          "@relation onetomany": "SubscriptionInvoice",
          "foreignKey": "subscriptionId"
        }
      }
    ],
    "table": "subscriptions"
  },
  "SubscriptionPlan": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "price": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "billingCycle": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "features": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "subscriptions": {
        "type": "Subscription[] | undefined",
        "originalType": "Subscription[]",
        "optional": true,
        "meta": {
          "@relation onetomany": "Subscription",
          "foreignKey": "planId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SubscriptionPlan",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "SubscriptionPlan",
        "fieldName": "subscriptions",
        "kind": "onetomany",
        "targetModel": "Subscription",
        "foreignKey": "planId",
        "meta": {
          "@relation onetomany": "Subscription",
          "foreignKey": "planId"
        }
      }
    ],
    "table": "subscription_plans"
  },
  "SubscriptionInvoice": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "subscriptionId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "invoiceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "periodStart": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "periodEnd": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "subscription": {
        "type": "Subscription | undefined",
        "originalType": "Subscription",
        "optional": true,
        "meta": {
          "@relation manytoone": "Subscription",
          "foreignKey": "subscriptionId",
          "onDelete": "CASCADE"
        }
      },
      "invoice": {
        "type": "Invoice | undefined",
        "originalType": "Invoice",
        "optional": true,
        "meta": {
          "@relation manytoone": "Invoice",
          "foreignKey": "invoiceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SubscriptionInvoice",
        "fieldName": "subscription",
        "kind": "manytoone",
        "targetModel": "Subscription",
        "foreignKey": "subscriptionId",
        "meta": {
          "@relation manytoone": "Subscription",
          "foreignKey": "subscriptionId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "SubscriptionInvoice",
        "fieldName": "invoice",
        "kind": "manytoone",
        "targetModel": "Invoice",
        "foreignKey": "invoiceId",
        "meta": {
          "@relation manytoone": "Invoice",
          "foreignKey": "invoiceId"
        }
      }
    ],
    "table": "subscription_invoices"
  },
  "ABTest": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,running,paused,completed)"
        }
      },
      "variants": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "metrics": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "startedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "winner": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ABTest",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "ab_tests"
  },
  "MarketingSegment": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "filters": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "contactCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "MarketingSegment",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "marketing_segments"
  },
  "LeadScoreRule": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "conditions": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "scoreValue": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "LeadScoreRule",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "lead_score_rules"
  },
  "MarketingJourney": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,active,paused,completed)"
        }
      },
      "triggers": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "steps": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "startedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "totalEntered": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "totalConverted": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "MarketingJourney",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "marketing_journeys"
  },
  "SMSCampaign": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "draft",
          "enum": "(draft,scheduled,sending,sent,failed)"
        }
      },
      "scheduledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "sentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "recipientCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "deliveredCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "targetFilters": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SMSCampaign",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "sms_campaigns"
  },
  "PushNotification": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "body": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "data": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,sent,delivered,read,failed)"
        }
      },
      "sentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "readAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "PushNotification",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "PushNotification",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "push_notifications"
  },
  "SocialMention": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "platform": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "authorName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "authorAvatar": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "content": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "postedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "sentiment": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "postUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "unread",
          "enum": "(unread,read,replied,ignored)"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SocialMention",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "social_mentions"
  },
  "UTMLink": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "sourceUrl": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "targetUrl": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "255",
          "not null": true
        }
      },
      "campaign": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "source": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "medium": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "content": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "term": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "clicks": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "UTMLink",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "utm_links"
  },
  "SEOConfig": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "pageId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@unique": true,
          "index": true,
          "not null": true
        }
      },
      "metaTitle": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "metaDescription": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "300",
          "nullable": true
        }
      },
      "keywords": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "ogImageUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "canonicalUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "noIndex": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "structuredData": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "page": {
        "type": "LandingPage | undefined",
        "originalType": "LandingPage",
        "optional": true,
        "meta": {
          "@relation manytoone": "LandingPage",
          "foreignKey": "pageId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SEOConfig",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "SEOConfig",
        "fieldName": "page",
        "kind": "manytoone",
        "targetModel": "LandingPage",
        "foreignKey": "pageId",
        "meta": {
          "@relation manytoone": "LandingPage",
          "foreignKey": "pageId"
        }
      }
    ],
    "table": "seo_configs"
  },
  "KnowledgeArticle": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "categories": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "tags": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "published",
          "enum": "(published,draft,archived)"
        }
      },
      "views": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "helpfulCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "notHelpfulCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "KnowledgeArticle",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "knowledge_articles"
  },
  "FAQItem": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "question": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "category": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "published": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "FAQItem",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "faq_items"
  },
  "ForumTopic": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "authorId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "lastActivityAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "views": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "open",
          "enum": "(open,resolved,closed,locked)"
        }
      },
      "pinned": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "author": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "authorId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ForumTopic",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "ForumTopic",
        "fieldName": "author",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "authorId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "authorId"
        }
      }
    ],
    "table": "forum_topics"
  },
  "ForumPost": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "topicId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "authorId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "isSolution": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "topic": {
        "type": "ForumTopic | undefined",
        "originalType": "ForumTopic",
        "optional": true,
        "meta": {
          "@relation manytoone": "ForumTopic",
          "foreignKey": "topicId",
          "onDelete": "CASCADE"
        }
      },
      "author": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "authorId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ForumPost",
        "fieldName": "topic",
        "kind": "manytoone",
        "targetModel": "ForumTopic",
        "foreignKey": "topicId",
        "meta": {
          "@relation manytoone": "ForumTopic",
          "foreignKey": "topicId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "ForumPost",
        "fieldName": "author",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "authorId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "authorId"
        }
      }
    ],
    "table": "forum_posts"
  },
  "SLAPolicy": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "responseTimeMinutes": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "resolutionTimeMinutes": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "conditions": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "escalationRules": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SLAPolicy",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "sla_policies"
  },
  "CannedResponse": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "shortcuts": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "category": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CannedResponse",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "canned_responses"
  },
  "Macro": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "actions": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Macro",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "macros"
  },
  "EscalationRule": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "triggerType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@enum": "(priority,time,keyword,assignment)"
        }
      },
      "conditions": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "actions": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "EscalationRule",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "escalation_rules"
  },
  "Asset": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "purchaseDate": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "warrantyEnd": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "value": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "metadata": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Asset",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Asset",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "assets"
  },
  "WorkflowTemplate": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "definition": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "category": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "100",
          "nullable": true
        }
      },
      "usageCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WorkflowTemplate",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "workflow_templates"
  },
  "WorkflowVersion": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workflowId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "version": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "definition": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "notes": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workflow": {
        "type": "Workflow | undefined",
        "originalType": "Workflow",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workflow",
          "foreignKey": "workflowId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WorkflowVersion",
        "fieldName": "workflow",
        "kind": "manytoone",
        "targetModel": "Workflow",
        "foreignKey": "workflowId",
        "meta": {
          "@relation manytoone": "Workflow",
          "foreignKey": "workflowId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "workflow_versions"
  },
  "CustomDashboard": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "widgets": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "sortOrder": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "shared": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CustomDashboard",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "custom_dashboards"
  },
  "ScheduledReport": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "config": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "frequency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "recipients": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "lastSentAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "ScheduledReport",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "scheduled_reports"
  },
  "CohortData": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "cohortDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "period": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "userCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "retentionData": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CohortData",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "cohort_data"
  },
  "CLVCalculation": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "averageOrderValue": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "purchaseFrequency": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "customerLifespan": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "clv": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "calculatedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CLVCalculation",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CLVCalculation",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "clv_calculations"
  },
  "TwoFactorSetting": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@unique": true,
          "index": true,
          "not null": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "secret": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "backupCodes": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "verifiedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation onetoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "TwoFactorSetting",
        "fieldName": "user",
        "kind": "onetoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation onetoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "two_factor_settings"
  },
  "UserDevice": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "deviceName": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "deviceType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "userAgent": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "ipAddress": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "lastUsedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "trusted": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "UserDevice",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "user_devices"
  },
  "IPAllowlistEntry": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "ipAddress": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "200"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "IPAllowlistEntry",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "ip_allowlist_entries"
  },
  "WebhookEndpoint": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "url": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "500",
          "not null": true
        }
      },
      "events": {
        "type": "string[]",
        "originalType": "string[]",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "headers": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "successCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "failureCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WebhookEndpoint",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "webhook_endpoints"
  },
  "OAuthApp": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "redirectUris": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "500",
          "not null": true
        }
      },
      "clientId": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "64",
          "not null": true
        }
      },
      "clientSecret": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "scopes": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "OAuthApp",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "oauth_apps"
  },
  "APILogEntry": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "method": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "path": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "500",
          "not null": true
        }
      },
      "statusCode": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "durationMs": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "ipAddress": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "50"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@nullable": true
        }
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "APILogEntry",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "APILogEntry",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "api_log_entries"
  },
  "InternalComment": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "entityId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "mentions": {
        "type": "number[] | undefined",
        "originalType": "number[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "editedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "InternalComment",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "InternalComment",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "internal_comments"
  },
  "SharedNote": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "bodyHtml": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "sharedWith": {
        "type": "number[] | undefined",
        "originalType": "number[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdBy": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "creator": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "createdBy"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SharedNote",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "SharedNote",
        "fieldName": "creator",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "createdBy",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "createdBy"
        }
      }
    ],
    "table": "shared_notes"
  },
  "Whiteboard": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "data": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "participants": {
        "type": "number[] | undefined",
        "originalType": "number[]",
        "optional": true,
        "meta": {
          "@nullable": true,
          "json": true
        }
      },
      "createdBy": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "creator": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "createdBy"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Whiteboard",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Whiteboard",
        "fieldName": "creator",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "createdBy",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "createdBy"
        }
      }
    ],
    "table": "whiteboards"
  },
  "Expense": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "description": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "amount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "category": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "expenseDate": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "receiptUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "reimbursedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Expense",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Expense",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "expenses"
  },
  "PaymentGateway": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "apiKey": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "apiSecret": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "webhookSecret": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "isDefault": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "PaymentGateway",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "payment_gateways"
  },
  "TaxRate": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "rate": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@length": "10",
          "not null": true
        }
      },
      "region": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "100",
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "TaxRate",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "tax_rates"
  },
  "Refund": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "invoiceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "amount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {}
      },
      "currency": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "USD",
          "length": "3"
        }
      },
      "reason": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@default": "pending",
          "enum": "(pending,approved,rejected,processed)"
        }
      },
      "processedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "invoice": {
        "type": "Invoice | undefined",
        "originalType": "Invoice",
        "optional": true,
        "meta": {
          "@relation manytoone": "Invoice",
          "foreignKey": "invoiceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Refund",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "Refund",
        "fieldName": "invoice",
        "kind": "manytoone",
        "targetModel": "Invoice",
        "foreignKey": "invoiceId",
        "meta": {
          "@relation manytoone": "Invoice",
          "foreignKey": "invoiceId"
        }
      }
    ],
    "table": "refunds"
  },
  "CalendarEvent": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "startTime": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "endTime": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "allDay": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "color": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "100"
        }
      },
      "attendees": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "contactId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true,
          "index": true
        }
      },
      "location": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true,
          "length": "500"
        }
      },
      "externalEventId": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      "contact": {
        "type": "Contact | undefined",
        "originalType": "Contact",
        "optional": true,
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CalendarEvent",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CalendarEvent",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      },
      {
        "sourceModel": "CalendarEvent",
        "fieldName": "contact",
        "kind": "manytoone",
        "targetModel": "Contact",
        "foreignKey": "contactId",
        "meta": {
          "@relation manytoone": "Contact",
          "foreignKey": "contactId"
        }
      }
    ],
    "table": "calendar_events"
  },
  "BookingLink": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "slug": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@unique": true,
          "length": "100",
          "not null": true
        }
      },
      "title": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "durationMinutes": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "availability": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "bufferConfig": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "totalBookings": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "BookingLink",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "booking_links"
  },
  "CalendarSync": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "provider": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "accessToken": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "refreshToken": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "expiresAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "lastSyncedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CalendarSync",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "CalendarSync",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "calendar_syncs"
  },
  "BrandingConfig": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "logoUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "primaryColor": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "7",
          "nullable": true
        }
      },
      "secondaryColor": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "7",
          "nullable": true
        }
      },
      "faviconUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "customCss": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "customJs": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "companyName": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "BrandingConfig",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "branding_configs"
  },
  "CustomDomain": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "domain": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "253",
          "not null": true,
          "unique": true
        }
      },
      "verified": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "verifiedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "sslEnabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "sslExpiresAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "CustomDomain",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "custom_domains"
  },
  "FeatureFlag": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "key": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "rules": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "FeatureFlag",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "feature_flags"
  },
  "BackupRecord": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "fileUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "500",
          "nullable": true
        }
      },
      "fileSize": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true,
          "default": "draft"
        }
      },
      "errorMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "startedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "BackupRecord",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "backup_records"
  },
  "DataRetentionPolicy": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "retentionDays": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "action": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true,
          "default": "delete"
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "DataRetentionPolicy",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "data_retention_policies"
  },
  "AuditSetting": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "retentionDays": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "30"
        }
      },
      "trackedEvents": {
        "type": "string[]",
        "originalType": "string[]",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true,
          "default": "[]"
        }
      },
      "excludedUsers": {
        "type": "number[] | undefined",
        "originalType": "number[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "AuditSetting",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "audit_settings"
  },
  "BackgroundJob": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "payload": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "result": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true,
          "default": "pending"
        }
      },
      "errorMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "attempts": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "maxAttempts": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "3"
        }
      },
      "scheduledAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "startedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "completedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "nextRetryAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "userId": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "BackgroundJob",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "BackgroundJob",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "background_jobs"
  },
  "WebhookDelivery": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "endpointId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "httpStatus": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "requestHeaders": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "requestBody": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "responseHeaders": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "responseBody": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "errorMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "durationMs": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "nextRetryAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WebhookDelivery",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "webhook_deliveries"
  },
  "EmailDelivery": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "recipient": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "254",
          "not null": true
        }
      },
      "subject": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "500",
          "not null": true
        }
      },
      "status": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "20",
          "not null": true
        }
      },
      "errorMessage": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "openedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "clickedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "openCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "clickCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "metadata": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "sentById": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@index": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "sentBy": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "sentById"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "EmailDelivery",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "EmailDelivery",
        "fieldName": "sentBy",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "sentById",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "sentById"
        }
      }
    ],
    "table": "email_deliveries"
  },
  "SystemHealthMetric": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "metric": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "value": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "unit": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "50",
          "nullable": true
        }
      },
      "tags": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "recordedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "SystemHealthMetric",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "system_health_metrics"
  },
  "WorkspaceQuota": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "maxUsers": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "maxStorageGb": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "maxContacts": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "maxDeals": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "maxProjects": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "canUseAI": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "canUseAPI": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "canUseAutomation": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "limits": {
        "type": "Record <string ,number > | undefined",
        "originalType": "Record <string ,number >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "WorkspaceQuota",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "workspace_quotas"
  },
  "UsageRecord": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "entityType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "count": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "period": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "10",
          "not null": true
        }
      },
      "recordedAt": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "UsageRecord",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "usage_records"
  },
  "LanguagePack": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "locale": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "10",
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "nativeName": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "100",
          "nullable": true
        }
      },
      "isRtl": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "isDefault": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "LanguagePack",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "language_packs"
  },
  "TranslationEntry": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "languagePackId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "key": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "value": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "namespace": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "100",
          "nullable": true
        }
      },
      "approvedById": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "languagePack": {
        "type": "LanguagePack | undefined",
        "originalType": "LanguagePack",
        "optional": true,
        "meta": {
          "@relation manytoone": "LanguagePack",
          "foreignKey": "languagePackId",
          "onDelete": "CASCADE"
        }
      },
      "approvedBy": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "approvedById"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "TranslationEntry",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "TranslationEntry",
        "fieldName": "languagePack",
        "kind": "manytoone",
        "targetModel": "LanguagePack",
        "foreignKey": "languagePackId",
        "meta": {
          "@relation manytoone": "LanguagePack",
          "foreignKey": "languagePackId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "TranslationEntry",
        "fieldName": "approvedBy",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "approvedById",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "approvedById"
        }
      }
    ],
    "table": "translation_entries"
  },
  "MarketplaceListing": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "type": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "version": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "author": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "publisher": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "iconUrl": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "config": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "verified": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "published": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "installCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "rating": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "reviewCount": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@default": "0"
        }
      },
      "featured": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "categories": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "tags": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      }
    },
    "relations": [],
    "table": "marketplace_listings"
  },
  "MarketplaceReview": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "listingId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "userId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "rating": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@not null": true
        }
      },
      "content": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "listing": {
        "type": "MarketplaceListing | undefined",
        "originalType": "MarketplaceListing",
        "optional": true,
        "meta": {
          "@relation manytoone": "MarketplaceListing",
          "foreignKey": "listingId",
          "onDelete": "CASCADE"
        }
      },
      "user": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "MarketplaceReview",
        "fieldName": "listing",
        "kind": "manytoone",
        "targetModel": "MarketplaceListing",
        "foreignKey": "listingId",
        "meta": {
          "@relation manytoone": "MarketplaceListing",
          "foreignKey": "listingId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "MarketplaceReview",
        "fieldName": "user",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "userId",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "userId"
        }
      }
    ],
    "table": "marketplace_reviews"
  },
  "InstalledItem": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "listingId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "settings": {
        "type": "Record <string ,unknown > | undefined",
        "originalType": "Record <string ,unknown >",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "installedById": {
        "type": "number | undefined",
        "originalType": "number",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      "listing": {
        "type": "MarketplaceListing | undefined",
        "originalType": "MarketplaceListing",
        "optional": true,
        "meta": {
          "@relation manytoone": "MarketplaceListing",
          "foreignKey": "listingId",
          "onDelete": "CASCADE"
        }
      },
      "installedBy": {
        "type": "User | undefined",
        "originalType": "User",
        "optional": true,
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "installedById"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "InstalledItem",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      },
      {
        "sourceModel": "InstalledItem",
        "fieldName": "listing",
        "kind": "manytoone",
        "targetModel": "MarketplaceListing",
        "foreignKey": "listingId",
        "meta": {
          "@relation manytoone": "MarketplaceListing",
          "foreignKey": "listingId",
          "onDelete": "CASCADE"
        }
      },
      {
        "sourceModel": "InstalledItem",
        "fieldName": "installedBy",
        "kind": "manytoone",
        "targetModel": "User",
        "foreignKey": "installedById",
        "meta": {
          "@relation manytoone": "User",
          "foreignKey": "installedById"
        }
      }
    ],
    "table": "installed_items"
  },
  "Plugin": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "workspaceId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true,
          "unique": true
        }
      },
      "version": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "100",
          "not null": true
        }
      },
      "author": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "200",
          "nullable": true
        }
      },
      "description": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@nullable": true
        }
      },
      "entryPoint": {
        "type": "string | undefined",
        "originalType": "string",
        "optional": true,
        "meta": {
          "@length": "500",
          "nullable": true
        }
      },
      "enabled": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": false
        }
      },
      "permissions": {
        "type": "string[] | undefined",
        "originalType": "string[]",
        "optional": true,
        "meta": {
          "@json": true,
          "nullable": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "workspace": {
        "type": "Workspace | undefined",
        "originalType": "Workspace",
        "optional": true,
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "Plugin",
        "fieldName": "workspace",
        "kind": "manytoone",
        "targetModel": "Workspace",
        "foreignKey": "workspaceId",
        "meta": {
          "@relation manytoone": "Workspace",
          "foreignKey": "workspaceId"
        }
      }
    ],
    "table": "plugins"
  },
  "PluginExtension": {
    "primaryKey": "id",
    "fields": {
      "id": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@auto": true,
          "primaryKey": true
        }
      },
      "pluginId": {
        "type": "number",
        "originalType": "number",
        "optional": false,
        "meta": {
          "@index": true,
          "not null": true
        }
      },
      "extensionType": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "50",
          "not null": true
        }
      },
      "name": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {
          "@length": "200",
          "not null": true
        }
      },
      "config": {
        "type": "Record <string ,unknown >",
        "originalType": "Record <string ,unknown >",
        "optional": false,
        "meta": {
          "@json": true,
          "not null": true
        }
      },
      "active": {
        "type": "boolean",
        "originalType": "boolean",
        "optional": false,
        "meta": {
          "@default": true
        }
      },
      "createdAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "updatedAt": {
        "type": "string",
        "originalType": "string",
        "optional": false,
        "meta": {}
      },
      "plugin": {
        "type": "Plugin | undefined",
        "originalType": "Plugin",
        "optional": true,
        "meta": {
          "@relation manytoone": "Plugin",
          "foreignKey": "pluginId",
          "onDelete": "CASCADE"
        }
      }
    },
    "relations": [
      {
        "sourceModel": "PluginExtension",
        "fieldName": "plugin",
        "kind": "manytoone",
        "targetModel": "Plugin",
        "foreignKey": "pluginId",
        "meta": {
          "@relation manytoone": "Plugin",
          "foreignKey": "pluginId",
          "onDelete": "CASCADE"
        }
      }
    ],
    "table": "plugin_extensions"
  }
} as const;

export type Schema = typeof schema;
export type ModelName = keyof ModelMap;
