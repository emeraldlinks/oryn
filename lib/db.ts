import ORMManager from "slintorm";
import { ModelMap, schema} from "./schema";
import type { ModelHooks, DBStore } from "slintorm";
import { registerModels } from "../models/register";

// ──────────────────────────────────────────────
//  MODEL DEFINITIONS with full SlintORM annotations
// ──────────────────────────────────────────────

export type { Workspace } from "../models/workspace";
export type { User } from "../models/user";
export type { Branch } from "../models/branch";
export type { Contact } from "../models/contact";
export type { Deal } from "../models/deal";
export type { Activity } from "../models/activity";
export type { Product } from "../models/product";
export type { Order } from "../models/order";
export type { OrderItem } from "../models/orderItem";
export type { Invoice } from "../models/invoice";
export type { Employee } from "../models/employee";
export type { Attendance } from "../models/attendance";
export type { LeaveRequest } from "../models/leaveRequest";
export type { EmailCampaign } from "../models/emailCampaign";
export type { EmailTemplate } from "../models/emailTemplate";
export type { LandingPage } from "../models/landingPage";
export type { Form } from "../models/form";
export type { FormSubmission } from "../models/formSubmission";
export type { SocialAccount } from "../models/socialAccount";
export type { SocialPost } from "../models/socialPost";
export type { SocialReply } from "../models/socialReply";
export type { AdCampaign } from "../models/adCampaign";
export type { WordpressSite } from "../models/wordpressSite";
export type { WordpressPost } from "../models/wordpressPost";
export type { Message } from "../models/message";
export type { Call } from "../models/call";
export type { Meeting } from "../models/meeting";
export type { Ticket } from "../models/ticket";
export type { TicketMessage } from "../models/ticketMessage";
export type { Document } from "../models/document";
export type { Notification } from "../models/notification";
export type { AuditLog } from "../models/auditLog";
export type { CustomFieldDef } from "../models/customFieldDef";
export type { CustomFieldValue } from "../models/customFieldValue";
export type { Workflow } from "../models/workflow";
export type { EmailSync } from "../models/emailSync";
export type { LiveChatSettings } from "../models/liveChatSettings";
export type { ChatMessage } from "../models/chatMessage";
export type { Project } from "../models/project";
export type { ProjectTask } from "../models/projectTask";
export type { ProjectMilestone } from "../models/projectMilestone";
export type { Bot } from "../models/bot";
export type { WidgetSettings } from "../models/widgetSettings";
export type { AIApiKey } from "../models/aIApiKey";
export type { AIConversation } from "../models/aIConversation";
export type { AIAction } from "../models/aIAction";
export type { BotConnection } from "../models/botConnection";
export type { HealthScore } from "../models/healthScore";
export type { NPSResponse } from "../models/nPSResponse";
export type { CSATResponse } from "../models/cSATResponse";
export type { OnboardingTask } from "../models/onboardingTask";
export type { ChurnPrediction } from "../models/churnPrediction";
export type { SalesPipeline } from "../models/salesPipeline";
export type { SalesGoal } from "../models/salesGoal";
export type { CommissionPlan } from "../models/commissionPlan";
export type { CommissionEarning } from "../models/commissionEarning";
export type { Quote } from "../models/quote";
export type { QuoteLineItem } from "../models/quoteLineItem";
export type { ProductDiscount } from "../models/productDiscount";
export type { Territory } from "../models/territory";
export type { Subscription } from "../models/subscription";
export type { SubscriptionPlan } from "../models/subscriptionPlan";
export type { SubscriptionInvoice } from "../models/subscriptionInvoice";
export type { ABTest } from "../models/aBTest";
export type { MarketingSegment } from "../models/marketingSegment";
export type { LeadScoreRule } from "../models/leadScoreRule";
export type { MarketingJourney } from "../models/marketingJourney";
export type { SMSCampaign } from "../models/sMSCampaign";
export type { PushNotification } from "../models/pushNotification";
export type { SocialMention } from "../models/socialMention";
export type { UTMLink } from "../models/uTMLink";
export type { SEOConfig } from "../models/sEOConfig";
export type { KnowledgeArticle } from "../models/knowledgeArticle";
export type { FAQItem } from "../models/fAQItem";
export type { ForumTopic } from "../models/forumTopic";
export type { ForumPost } from "../models/forumPost";
export type { SLAPolicy } from "../models/sLAPolicy";
export type { CannedResponse } from "../models/cannedResponse";
export type { Macro } from "../models/macro";
export type { EscalationRule } from "../models/escalationRule";
export type { Asset } from "../models/asset";
export type { WorkflowTemplate } from "../models/workflowTemplate";
export type { WorkflowVersion } from "../models/workflowVersion";
export type { CustomDashboard } from "../models/customDashboard";
export type { ScheduledReport } from "../models/scheduledReport";
export type { CohortData } from "../models/cohortData";
export type { CLVCalculation } from "../models/cLVCalculation";
export type { TwoFactorSetting } from "../models/twoFactorSetting";
export type { UserDevice } from "../models/userDevice";
export type { IPAllowlistEntry } from "../models/iPAllowlistEntry";
export type { WebhookEndpoint } from "../models/webhookEndpoint";
export type { OAuthApp } from "../models/oAuthApp";
export type { APILogEntry } from "../models/aPILogEntry";
export type { InternalComment } from "../models/internalComment";
export type { SharedNote } from "../models/sharedNote";
export type { Whiteboard } from "../models/whiteboard";
export type { Expense } from "../models/expense";
export type { PaymentGateway } from "../models/paymentGateway";
export type { TaxRate } from "../models/taxRate";
export type { Refund } from "../models/refund";
export type { CalendarEvent } from "../models/calendarEvent";
export type { BookingLink } from "../models/bookingLink";
export type { CalendarSync } from "../models/calendarSync";
export type { BrandingConfig } from "../models/brandingConfig";
export type { CustomDomain } from "../models/customDomain";
export type { FeatureFlag } from "../models/featureFlag";
export type { BackupRecord } from "../models/backupRecord";
export type { DataRetentionPolicy } from "../models/dataRetentionPolicy";
export type { AuditSetting } from "../models/auditSetting";
export type { BackgroundJob } from "../models/backgroundJob";
export type { WebhookDelivery } from "../models/webhookDelivery";
export type { EmailDelivery } from "../models/emailDelivery";
export type { SystemHealthMetric } from "../models/systemHealthMetric";
export type { WorkspaceQuota } from "../models/workspaceQuota";
export type { UsageRecord } from "../models/usageRecord";
export type { LanguagePack } from "../models/languagePack";
export type { TranslationEntry } from "../models/translationEntry";
export type { MarketplaceListing } from "../models/marketplaceListing";
export type { MarketplaceReview } from "../models/marketplaceReview";
export type { InstalledItem } from "../models/installedItem";
export type { Plugin } from "../models/plugin";
export type { PluginExtension } from "../models/pluginExtension";


export type { ModelMap } from "../models/schema/generated";


// ──────────────────────────────────────────────
//  DB initialisation (Node.js server runtime)
// ──────────────────────────────────────────────


export let cachedDb: DBStore<ModelMap> 

export function getDb(): DBStore<ModelMap> {
  if (cachedDb) return cachedDb;
  throw new Error("Database not initialized. Call initDb() first.");
}

export async function initDb() {
  if (cachedDb) return cachedDb;

  const orm = new ORMManager<ModelMap>({
    driver: "sqlite",
    databaseUrl: "./test.db",
    logs: process.env.NODE_ENV === "development",
    dir: "./src/lib",
    modelMap: {} as ModelMap,
    schema,
  });

  registerModels(orm);

  // if (process.env.NODE_ENV !== "edge") {
  //   await orm.migrate();
  // }

  cachedDb = orm.DB;
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


async function testdb() {
console.log("Testing database connection and operations...");
await initDb();
  const ng = await cachedDb.ABTest.insert({
    name: "Test AB Test",
    description: "This is a test AB test",
    workspaceId: 1,
    status: "draft",
    variants: { "variantA": "some value", "variantB": "another value" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("Inserted ABTest:", ng);
  console.log("Inserted ABTest:", ng);

  const fetched = await cachedDb.ABTest.get({ id: ng?.id! });
  console.log("Fetched ABTest:", fetched);
}
  
testdb().catch((err) => {
  console.error("Error in testdb:", err);
});