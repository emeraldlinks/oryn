import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb } from "@/lib/db";

const VALID_DEAL_STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const;

type StageWeights = Record<string, number>;

const STAGE_WEIGHTS: StageWeights = {
  lead: 0.1,
  qualified: 0.3,
  proposal: 0.5,
  negotiation: 0.8,
  "closed-won": 1.0,
  "closed-lost": 0,
};

interface ActionParams {
  [key: string]: unknown;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  title?: string;
  contactId?: number;
  value?: number;
  stage?: string;
  assignedTo?: number;
  dealId?: number;
  to?: string;
  subject?: string;
  body?: string;
  type?: string;
  priority?: string;
  userId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wsId = Number((session.user as any).workspaceId);
    const userId = Number((session.user as any).id);

    const body = await req.json();
    const { actionType, params = {} as ActionParams, conversationId }: {
      actionType: string;
      params: ActionParams;
      conversationId?: number;
    } = body;

    if (!actionType) {
      return NextResponse.json({ error: "actionType is required" }, { status: 400 });
    }

    const db = await initDb();

    const actionLog = await db.AIAction.insert({
      workspaceId: wsId,
      userId,
      conversationId: conversationId ?? null,
      actionType,
      actionPayload: params,
      status: "pending",
    });

    try {
      let data: unknown;

      switch (actionType) {
        case "create_contact": {
          if (!params.firstName || !params.lastName) {
            throw new Error("firstName and lastName are required");
          }
          data = await db.Contact.insert({
            workspaceId: wsId,
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            phone: params.phone,
            company: params.company,
            status: params.status || "lead",
          });
          break;
        }

        case "create_deal": {
          if (!params.title) {
            throw new Error("title is required");
          }
          data = await db.Deal.insert({
            workspaceId: wsId,
            title: params.title,
            value: params.value ?? 0,
            stage: params.stage || "lead",
            contactId: params.contactId,
            assignedTo: params.assignedTo,
          });
          break;
        }

        case "update_deal_stage": {
          const { dealId, stage } = params;
          if (!dealId || !stage) {
            throw new Error("dealId and stage are required");
          }
          if (!VALID_DEAL_STAGES.includes(stage as typeof VALID_DEAL_STAGES[number])) {
            throw new Error(
              `Invalid stage "${stage}". Valid stages: ${VALID_DEAL_STAGES.join(", ")}`
            );
          }
          const deal = await db.Deal.get({ id: Number(dealId), workspaceId: wsId });
          if (!deal) {
            throw new Error("Deal not found");
          }
          const oldStage = deal.stage;
          const now = new Date().toISOString();
          const updateData: Record<string, unknown> = { stage, updatedAt: now };
          if (stage === "closed-won") updateData.wonAt = now;
          if (stage === "closed-lost") updateData.lostAt = now;
          await db.Deal.update({ id: Number(dealId), workspaceId: wsId }, updateData);

          await db.Activity.insert({
            workspaceId: wsId,
            type: "deal-status-change",
            subject: `Deal moved from ${oldStage} to ${stage}`,
            body: `"${deal.title}" moved from "${oldStage}" to "${stage}"`,
            dealId: Number(dealId),
            contactId: deal.contactId,
            userId,
          });

          if (deal.assignedTo && deal.assignedTo !== userId) {
            await db.Notification.insert({
              workspaceId: wsId,
              userId: deal.assignedTo,
              type: "deal",
              title: `Deal stage changed: ${deal.title}`,
              body: `Moved from "${oldStage}" to "${stage}"`,
            });
          }

          data = { success: true, dealId: Number(dealId), oldStage, newStage: stage };
          break;
        }

        case "send_email": {
          const { to, subject, body: emailBody } = params;
          if (!to || !subject || !emailBody) {
            throw new Error("to, subject, and body are required");
          }
          data = await db.Message.insert({
            workspaceId: wsId,
            channel: "email",
            direction: "outbound",
            fromAddress: (session.user as any).email || "",
            toAddress: to,
            subject,
            body: emailBody,
            contactId: params.contactId,
            status: "sent",
            sentAt: new Date().toISOString(),
          });
          break;
        }

        case "create_activity": {
          if (!params.type || !params.subject) {
            throw new Error("type and subject are required");
          }
          data = await db.Activity.insert({
            workspaceId: wsId,
            type: params.type,
            subject: params.subject,
            body: params.body,
            contactId: params.contactId,
            dealId: params.dealId,
            userId,
          });
          break;
        }

        case "create_ticket": {
          if (!params.subject) {
            throw new Error("subject is required");
          }
          data = await db.Ticket.insert({
            workspaceId: wsId,
            subject: params.subject,
            contactId: params.contactId,
            priority: params.priority || "medium",
            assignedTo: params.assignedTo,
          });
          break;
        }

        case "create_notification": {
          if (!params.userId || !params.title || !params.body) {
            throw new Error("userId, title, and body are required");
          }
          data = await db.Notification.insert({
            workspaceId: wsId,
            userId: params.userId,
            title: params.title,
            body: params.body,
            type: params.type || "ai_action",
          });
          break;
        }

        case "list_contacts": {
          let query = db.Contact.query().where("workspaceId", "=", wsId);
          if (params.search) {
            const q = `%${params.search}%`;
            query = query.whereRaw(
              '(LOWER("firstName" || \' \' || "lastName") LIKE LOWER(?) OR LOWER("email") LIKE LOWER(?))',
              [q, q]
            );
          }
          data = await query
            .orderBy("createdAt", "DESC")
            .limit(params.limit || 50)
            .offset(params.offset || 0)
            .get();
          break;
        }

        case "list_deals": {
          let query = db.Deal.query().where("workspaceId", "=", wsId);
          if (params.stage) {
            query = query.where("stage", "=", params.stage);
          }
          if (params.search) {
            query = query.where("title", "ILIKE", `%${params.search}%`);
          }
          data = await query
            .orderBy("createdAt", "DESC")
            .limit(params.limit || 50)
            .offset(params.offset || 0)
            .get();
          break;
        }

        case "get_forecast": {
          const deals = await db.Deal.query()
            .where("workspaceId", "=", wsId)
            .preload("contact")
            .preload("assignee")
            .get();

          const stageValues: Record<string, { weight: number; count: number; total: number }> = {};
          for (const stage of VALID_DEAL_STAGES) {
            stageValues[stage] = { weight: STAGE_WEIGHTS[stage], count: 0, total: 0 };
          }

          let totalForecast = 0;
          let weightedForecast = 0;
          let wonTotal = 0;
          let lostTotal = 0;

          for (const deal of deals) {
            const stg = deal.stage;
            if (!stageValues[stg]) continue;
            stageValues[stg].count++;
            stageValues[stg].total += deal.value;
            totalForecast += deal.value;
            weightedForecast += deal.value * (STAGE_WEIGHTS[stg] || 0);
            if (stg === "closed-won") wonTotal += deal.value;
            if (stg === "closed-lost") lostTotal += deal.value;
          }

          data = {
            stages: stageValues,
            stageWeights: STAGE_WEIGHTS,
            totalForecast,
            weightedForecast,
            wonTotal,
            lostTotal,
            totalDeals: deals.length,
          };
          break;
        }

        default:
          throw new Error(`Unknown action type: ${actionType}`);
      }

      await db.AIAction.update(
        { id: actionLog.id, workspaceId: wsId },
        { status: "completed", result: data as Record<string, unknown> }
      );

      return NextResponse.json({ data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await db.AIAction.update(
        { id: actionLog.id, workspaceId: wsId },
        { status: "failed", errorMessage: message }
      );
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
