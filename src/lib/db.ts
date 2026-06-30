import ORMManager from "slintorm";
import { schema, type ModelMap } from "./schema";
import type { ModelHooks, DBStore } from "slintorm";

// ──────────────────────────────────────────────
//  MODEL DEFINITIONS with full SlintORM annotations
// ──────────────────────────────────────────────

export interface Workspace {
  // @auto @primaryKey
  id: number;
  // @unique @length:100 @not null
  name: string;
  // @unique @length:50 @not null
  slug: string;
  // @default:starter @enum:(starter,growth,scale,enterprise)
  plan: string;
  // @default:true
  active: boolean;
  // @json
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation onetomany:User;foreignKey:workspaceId
  users?: User[];
  // @relation onetomany:Branch;foreignKey:workspaceId
  branches?: Branch[];
  // @relation onetomany:Contact;foreignKey:workspaceId
  contacts?: Contact[];
  // @relation onetomany:Deal;foreignKey:workspaceId
  deals?: Deal[];
  // @relation onetomany:Product;foreignKey:workspaceId
  products?: Product[];
  // @relation onetomany:Employee;foreignKey:workspaceId
  employees?: Employee[];
  // @relation onetomany:Ticket;foreignKey:workspaceId
  tickets?: Ticket[];
}

export interface User {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:100 @not null
  name: string;
  // @unique @length:255 @not null
  email: string;
  // @nullable @length:255
  passwordHash?: string;
  // @default:employee @enum:(superadmin,admin,manager,employee,client)
  role: string;
  // @nullable @length:500
  avatarUrl?: string;
  // @nullable
  lastLoginAt?: string;
  // @nullable @json
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:Activity;foreignKey:userId
  activities?: Activity[];
  // @relation onetomany:Employee;foreignKey:userId
  employeeProfile?: Employee[];
  // @relation onetomany:Call;foreignKey:userId
  calls?: Call[];
  // @relation onetomany:Meeting;foreignKey:userId
  meetings?: Meeting[];
  // @relation onetomany:Notification;foreignKey:userId
  notifications?: Notification[];
}

export interface Branch {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:100 @not null
  name: string;
  // @nullable @length:255
  address?: string;
  // @nullable @length:100
  city?: string;
  // @length:100
  country: string;
  // @nullable @length:30
  phone?: string;
  // @nullable @index
  managerId?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:managerId
  manager?: User;
  // @relation onetomany:Employee;foreignKey:branchId
  employees?: Employee[];
}

export interface Contact {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:100 @not null
  firstName: string;
  // @length:100 @not null
  lastName: string;
  // @nullable @unique @length:255
  email?: string;
  // @nullable @length:30
  phone?: string;
  // @nullable @length:200
  company?: string;
  // @nullable @length:200
  title?: string;
  // @nullable @default:direct @length:50
  source?: string;
  // @default:lead @enum:(lead,active,qualified,inactive,unsubscribed)
  status: string;
  // @nullable @index
  assignedTo?: number;
  // @nullable @json
  tags?: string[];
  // @nullable @json
  customFields?: Record<string, unknown>;
  // @nullable
  lastContactedAt?: string;
  // @nullable @default:0
  dealScore?: number;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
  // @relation onetomany:Deal;foreignKey:contactId
  deals?: Deal[];
  // @relation onetomany:Activity;foreignKey:contactId
  activities?: Activity[];
  // @relation onetomany:Message;foreignKey:contactId
  messages?: Message[];
  // @relation onetomany:Call;foreignKey:contactId
  calls?: Call[];
  // @relation onetomany:Meeting;foreignKey:contactId
  meetings?: Meeting[];
  // @relation onetomany:Ticket;foreignKey:contactId
  tickets?: Ticket[];
  // @relation onetomany:Invoice;foreignKey:contactId
  invoices?: Invoice[];
}

export interface Deal {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  contactId: number;
  // @length:200 @not null
  title: string;
  value: number;
  // @default:USD @length:3
  currency: string;
  // @default:lead @enum:(lead,qualified,proposal,negotiation,closed-won,closed-lost)
  stage: string;
  // @default:10
  probability: number;
  // @nullable
  expectedCloseDate?: string;
  // @nullable @index
  assignedTo?: number;
  // @nullable @index
  branchId?: number;
  // @nullable
  wonAt?: string;
  // @nullable
  lostAt?: string;
  // @nullable @length:500
  lostReason?: string;
  // @nullable @json
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
  // @relation onetomany:Activity;foreignKey:dealId
  activities?: Activity[];
  // @relation onetomany:Meeting;foreignKey:dealId
  meetings?: Meeting[];
}

export interface Activity {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @enum:(call,email,meeting,task,note,deal-status-change,social) @not null
  type: string;
  // @length:200 @not null
  subject: string;
  // @nullable
  body?: string;
  // @nullable @index
  contactId?: number;
  // @nullable @index
  dealId?: number;
  // @index @not null
  userId: number;
  // @nullable
  dueAt?: string;
  // @nullable
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

export interface Product {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:200 @not null
  name: string;
  // @nullable @unique @length:50
  sku?: string;
  // @nullable
  description?: string;
  // @default:0.00
  price: number;
  // @default:USD @length:3
  currency: string;
  // @nullable @default:0
  stock?: number;
  // @nullable @length:100
  category?: string;
  // @nullable @length:500
  imageUrl?: string;
  // @default:false
  isService: boolean;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:OrderItem;foreignKey:productId
  orderItems?: OrderItem[];
}

export interface Order {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  contactId: number;
  // @default:pending @enum:(pending,confirmed,processing,shipped,delivered,cancelled,refunded)
  status: string;
  totalAmount: number;
  // @default:USD @length:3
  currency: string;
  // @nullable
  paidAt?: string;
  // @nullable @index
  branchId?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation onetomany:OrderItem;foreignKey:orderId
  items?: OrderItem[];
  // @relation onetoone:Invoice;foreignKey:orderId
  invoice?: Invoice;
}

export interface OrderItem {
  // @auto @primaryKey
  id: number;
  // @index @not null
  orderId: number;
  // @index @not null
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Order;foreignKey:orderId;onDelete:CASCADE
  order?: Order;
  // @relation manytoone:Product;foreignKey:productId
  product?: Product;
}

export interface Invoice {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @nullable @index
  orderId?: number;
  // @index @not null
  contactId: number;
  // @default:draft @enum:(draft,sent,paid,overdue,cancelled)
  status: string;
  // @not null
  dueDate: string;
  totalAmount: number;
  // @nullable
  paidAt?: string;
  // @nullable @length:500
  pdfUrl?: string;
  // @nullable @length:50
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetoone:Order;foreignKey:orderId
  order?: Order;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
}

export interface Employee {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @unique @index @not null
  userId: number;
  // @nullable @index
  branchId?: number;
  // @nullable @length:100
  department?: string;
  // @nullable @length:100
  jobTitle?: string;
  // @nullable
  salary?: number;
  // @nullable
  startDate?: string;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
  // @relation manytoone:Branch;foreignKey:branchId
  branch?: Branch;
  // @relation onetomany:Attendance;foreignKey:employeeId
  attendance?: Attendance[];
  // @relation onetomany:LeaveRequest;foreignKey:employeeId
  leaveRequests?: LeaveRequest[];
}

export interface Attendance {
  // @auto @primaryKey
  id: number;
  // @index @not null
  employeeId: number;
  // @not null
  clockedInAt: string;
  // @nullable
  clockedOutAt?: string;
  // @nullable
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Employee;foreignKey:employeeId;onDelete:CASCADE
  employee?: Employee;
}

export interface LeaveRequest {
  // @auto @primaryKey
  id: number;
  // @index @not null
  employeeId: number;
  // @enum:(vacation,sick,personal,other) @not null
  type: string;
  // @not null
  startDate: string;
  // @not null
  endDate: string;
  // @default:pending @enum:(pending,approved,rejected,cancelled)
  status: string;
  // @nullable
  reason?: string;
  // @nullable @index
  approvedBy?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Employee;foreignKey:employeeId;onDelete:CASCADE
  employee?: Employee;
  // @relation manytoone:User;foreignKey:approvedBy
  approver?: User;
}

export interface EmailCampaign {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @nullable @index
  templateId?: number;
  // @length:200 @not null
  name: string;
  // @length:255 @not null
  subject: string;
  bodyHtml: string;
  // @default:draft @enum:(draft,scheduled,sending,sent,failed)
  status: string;
  // @nullable
  sentAt?: string;
  // @nullable
  scheduledAt?: string;
  // @default:0
  recipientCount?: number;
  // @default:0
  openCount?: number;
  // @default:0
  clickCount?: number;
  // @nullable @json
  targetFilters?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:EmailTemplate;foreignKey:templateId
  template?: EmailTemplate;
}

export interface EmailTemplate {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:200 @not null
  name: string;
  // @length:255 @not null
  subject: string;
  bodyHtml: string;
  // @nullable @json
  variables?: string[];
  // @default:active @enum:(active,archived)
  status: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:EmailCampaign;foreignKey:templateId
  campaigns?: EmailCampaign[];
}

export interface LandingPage {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @unique @length:100 @not null
  slug: string;
  // @length:200 @not null
  title: string;
  // @nullable @json
  contentJson?: Record<string, unknown>;
  // @default:false
  published: boolean;
  // @default:0
  views?: number;
  // @default:0
  conversions?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
}

export interface Form {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:200 @not null
  name: string;
  // @json @not null
  fieldsJson: Record<string, unknown>;
  // @default:0
  submissions?: number;
  // @default:true
  active: boolean;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:FormSubmission;foreignKey:formId
  submissionsList?: FormSubmission[];
}

export interface FormSubmission {
  // @auto @primaryKey
  id: number;
  // @index @not null
  formId: number;
  // @json @not null
  data: Record<string, unknown>;
  // @nullable @index
  contactId?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Form;foreignKey:formId;onDelete:CASCADE
  form?: Form;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
}

export interface SocialAccount {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @enum:(facebook,instagram,twitter,linkedin,tiktok,youtube) @not null
  platform: string;
  // @length:200 @not null
  accountName: string;
  // @not null
  accessToken: string;
  // @nullable
  refreshToken?: string;
  // @nullable
  expiresAt?: string;
  // @nullable @length:500
  profileImageUrl?: string;
  // @nullable
  connectedAt: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:SocialPost;foreignKey:socialAccountId
  posts?: SocialPost[];
  // @relation onetomany:AdCampaign;foreignKey:socialAccountId
  adCampaigns?: AdCampaign[];
}

export interface SocialPost {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  socialAccountId: number;
  content: string;
  // @nullable @json
  mediaUrls?: string[];
  // @default:draft @enum:(draft,scheduled,published,failed)
  status: string;
  // @nullable
  scheduledAt?: string;
  // @nullable
  publishedAt?: string;
  // @nullable @length:200
  platformPostId?: string;
  // @default:0
  likes?: number;
  // @default:0
  comments?: number;
  // @default:0
  shares?: number;
  // @default:0
  reach?: number;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:SocialAccount;foreignKey:socialAccountId;onDelete:CASCADE
  account?: SocialAccount;
  // @relation onetomany:SocialReply;foreignKey:socialPostId
  replies?: SocialReply[];
}

export interface SocialReply {
  // @auto @primaryKey
  id: number;
  // @index @not null
  socialPostId: number;
  // @length:200 @not null
  platformCommentId: string;
  // @length:100 @not null
  authorName: string;
  content: string;
  // @nullable
  repliedContent?: string;
  // @nullable
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:SocialPost;foreignKey:socialPostId;onDelete:CASCADE
  post?: SocialPost;
}

export interface AdCampaign {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  socialAccountId: number;
  // @nullable @length:200
  platformCampaignId?: string;
  // @length:200 @not null
  name: string;
  // @length:100 @not null
  objective: string;
  // @default:active @enum:(active,paused,ended,archived)
  status: string;
  budget: number;
  // @default:0
  spent?: number;
  // @default:0
  impressions?: number;
  // @default:0
  clicks?: number;
  // @default:0
  conversions?: number;
  // @not null
  startDate: string;
  // @nullable
  endDate?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:SocialAccount;foreignKey:socialAccountId;onDelete:CASCADE
  socialAccount?: SocialAccount;
}

export interface WordpressSite {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:255 @not null
  siteUrl: string;
  // @length:100 @not null
  appUsername: string;
  appPassword: string;
  // @nullable @length:200
  siteName?: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation onetomany:WordpressPost;foreignKey:wordpressSiteId
  posts?: WordpressPost[];
}

export interface WordpressPost {
  // @auto @primaryKey
  id: number;
  // @index @not null
  wordpressSiteId: number;
  // @nullable
  platformPostId?: number;
  // @length:200 @not null
  title: string;
  contentHtml: string;
  // @default:draft @enum:(draft,scheduled,published,failed)
  status: string;
  // @nullable
  scheduledAt?: string;
  // @nullable
  publishedAt?: string;
  // @nullable @json
  categories?: string[];
  // @nullable @json
  tags?: string[];
  // @nullable @length:500
  featuredImageUrl?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:WordpressSite;foreignKey:wordpressSiteId;onDelete:CASCADE
  site?: WordpressSite;
}

export interface Message {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:50 @not null
  channel: string;
  // @enum:(inbound,outbound) @not null
  direction: string;
  // @nullable @index
  contactId?: number;
  // @length:255 @not null
  fromAddress: string;
  // @length:255 @not null
  toAddress: string;
  // @nullable @length:255
  subject?: string;
  body: string;
  // @default:sent @enum:(sent,delivered,read,failed)
  status: string;
  // @nullable
  sentAt?: string;
  // @nullable
  readAt?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
}

export interface Call {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @nullable @index
  contactId?: number;
  // @index @not null
  userId: number;
  // @enum:(inbound,outbound) @not null
  direction: string;
  // @length:30 @not null
  phoneNumber: string;
  // @default:0
  duration?: number;
  // @nullable @length:500
  recordingUrl?: string;
  // @nullable
  transcript?: string;
  // @nullable @length:50
  sentiment?: string;
  // @nullable
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

export interface Meeting {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:200 @not null
  title: string;
  // @nullable @index
  contactId?: number;
  // @nullable @index
  dealId?: number;
  // @index @not null
  userId: number;
  // @not null
  scheduledAt: string;
  // @nullable @default:30
  duration?: number;
  // @nullable @length:500
  meetingUrl?: string;
  // @nullable
  notes?: string;
  // @default:scheduled @enum:(scheduled,ongoing,completed,cancelled)
  status: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

export interface Ticket {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  contactId: number;
  // @length:200 @not null
  subject: string;
  // @default:open @enum:(open,waiting,answered,resolved,closed)
  status: string;
  // @default:medium @enum:(low,medium,high,urgent)
  priority: string;
  // @nullable @index
  assignedTo?: number;
  // @nullable
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  // @softDelete
  deletedAt?: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:User;foreignKey:assignedTo
  assignee?: User;
  // @relation onetomany:TicketMessage;foreignKey:ticketId
  messages?: TicketMessage[];
}

export interface TicketMessage {
  // @auto @primaryKey
  id: number;
  // @index @not null
  ticketId: number;
  // @nullable @index
  userId?: number;
  body: string;
  // @default:false
  isFromClient: boolean;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Ticket;foreignKey:ticketId;onDelete:CASCADE
  ticket?: Ticket;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

export interface Document {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @length:200 @not null
  title: string;
  // @length:50 @not null
  type: string;
  // @nullable @json
  contentJson?: Record<string, unknown>;
  // @nullable @length:500
  pdfUrl?: string;
  // @nullable @index
  contactId?: number;
  // @nullable @index
  dealId?: number;
  // @default:draft @enum:(draft,final,sent,signed,expired)
  status: string;
  // @nullable
  signedAt?: string;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
  // @relation manytoone:Deal;foreignKey:dealId
  deal?: Deal;
}

export interface Notification {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @index @not null
  userId: number;
  // @length:50 @not null
  type: string;
  // @length:200 @not null
  title: string;
  body: string;
  // @nullable
  readAt?: string;
  // @nullable @json
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

export interface AuditLog {
  // @auto @primaryKey
  id: number;
  // @index @not null
  workspaceId: number;
  // @nullable @index
  userId?: number;
  // @length:50 @not null
  action: string;
  // @length:50 @not null
  entity: string;
  // @nullable @index
  entityId?: number;
  // @nullable @json
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;

  // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

// ──────────────────────────────────────────────
//  ModelMap – type-safe registry for ORMManager
// ──────────────────────────────────────────────

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
};

// ──────────────────────────────────────────────
//  DB initialisation (Node.js server runtime)
// ──────────────────────────────────────────────

let cachedDb: DBStore<ModelMap> | null = null;

export function getDb(): DBStore<ModelMap> {
  if (cachedDb) return cachedDb;
  throw new Error("Database not initialized. Call initDb() first.");
}

export async function initDb() {
  if (cachedDb) return cachedDb;

  const orm = new ORMManager<ModelMap>({
    driver: "postgres",
    databaseUrl: process.env.DATABASE_URL!,
    logs: process.env.NODE_ENV === "development",
    dir: "./src",
    modelMap: {} as ModelMap,
    schema,
  });

  if (process.env.NODE_ENV !== "edge") {
    await orm.migrate();
  }

  cachedDb = orm.db;
  return cachedDb;
}

export async function withDb<T>(
  fn: (db: DBStore<ModelMap>) => Promise<T>
): Promise<T> {
  const db = await initDb();
  return fn(db);
}

// ──────────────────────────────────────────────
//  Lifecycle hooks helper
// ──────────────────────────────────────────────

export function defineHooks<
  T extends { createdAt: string; updatedAt: string }
>(): ModelHooks<T> {
  return {
    onCreateBefore(data) {
      const now = new Date().toISOString();
      return { ...data, createdAt: now, updatedAt: now };
    },
    onUpdateBefore(_old, newData) {
      return { ...newData, updatedAt: new Date().toISOString() };
    },
  };
}
