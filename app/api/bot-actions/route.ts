import { NextResponse } from "next/server";
import crypto from "crypto";
import { withDb } from "@/lib/db";

const VALID_DEAL_STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const;

const STAGE_WEIGHTS: Record<string, number> = {
  lead: 0.1,
  qualified: 0.3,
  proposal: 0.5,
  negotiation: 0.8,
  "closed-won": 1.0,
  "closed-lost": 0,
};

interface ActionParams {
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
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "oryn-bot-actions",
    version: "1.0",
  });
}

export async function POST(req: Request) {
  try {
    const providedKey = req.headers.get("X-API-Key");
    if (!providedKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    let body: { actionType: string; params: ActionParams };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { actionType, params = {} as ActionParams } = body;
    if (!actionType) {
      return NextResponse.json({ error: "actionType is required" }, { status: 400 });
    }

    return await withDb(async (db) => {
      const connection = await db.BotConnection.query()
        .where("apiKey", "=", providedKey)
        .first();

      if (!connection) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }

      const providedBuffer = Buffer.from(providedKey);
      const storedBuffer = Buffer.from(connection.apiKey);
      if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }

      if (connection.status !== "active") {
        return NextResponse.json({ error: "Connection is suspended/revoked" }, { status: 403 });
      }

      if (!connection.active) {
        return NextResponse.json({ error: "Connection is suspended/revoked" }, { status: 403 });
      }

      if (connection.expiresAt && new Date(connection.expiresAt) < new Date()) {
        return NextResponse.json({ error: "Connection has expired" }, { status: 403 });
      }

      const allowedActions = connection.allowedActions as string[] | undefined;
      if (allowedActions && allowedActions.length > 0 && !allowedActions.includes(actionType)) {
        return NextResponse.json({ error: "Action not allowed for this connection" }, { status: 403 });
      }

      const wsId = connection.workspaceId;
      const userId = connection.userId;

      await db.BotConnection.update(
        { id: connection.id },
        { lastUsedAt: new Date().toISOString(), totalRequests: connection.totalRequests + 1 }
      );

      const actionLog = await db.AIAction.insert({
        workspaceId: wsId,
        userId,
        botConnectionId: connection.id,
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

          case "list_tickets": {
            let query = db.Ticket.query().where("workspaceId", "=", wsId);
            if (params.status) {
              query = query.where("status", "=", params.status);
            }
            data = await query
              .orderBy("createdAt", "DESC")
              .limit(params.limit || 50)
              .offset(params.offset || 0)
              .get();
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
              fromAddress: "",
              toAddress: to,
              subject,
              body: emailBody,
              contactId: params.contactId,
              status: "sent",
              sentAt: new Date().toISOString(),
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

          case "create_project": {
            if (!params.name) {
              throw new Error("name is required");
            }
            data = await db.Project.insert({
              workspaceId: wsId,
              name: params.name,
              description: params.description,
              status: params.status || "active",
              priority: params.priority || "medium",
              startDate: params.startDate,
              endDate: params.endDate,
              ownerId: userId,
            });
            break;
          }

          case "list_projects": {
            let query = db.Project.query().where("workspaceId", "=", wsId);
            if (params.status) {
              query = query.where("status", "=", params.status);
            }
            data = await query
              .orderBy("createdAt", "DESC")
              .limit(params.limit || 50)
              .offset(params.offset || 0)
              .get();
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
        return NextResponse.json({ error: message }, { status: 400 });
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
