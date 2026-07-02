import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { triggerType, entityId, entityData } = body;
  const wsId = Number(session.user.workspaceId);

  const workflows = await db.Workflow.query()
    .where("workspaceId", "=", wsId)
    .where("triggerType", "=", triggerType)
    .where("active", "=", true)
    .get();

  const results: any[] = [];

  for (const workflow of workflows as any[]) {
    const config = workflow.triggerConfig as Record<string, unknown>;
    const actions = workflow.actions as any[];

    if (config.conditionField && config.conditionValue) {
      const val = entityData?.[config.conditionField as string];
      if (String(val) !== String(config.conditionValue)) continue;
    }

    let actionResults: any[] = [];

    for (const action of actions) {
      try {
        switch (action.type) {
          case "create_activity": {
            const a = await db.Activity.insert({
              workspaceId: wsId,
              type: action.activityType || "note",
              subject: (action.subject || "").replace(/{{(\w+)}}/g, (_: string, k: string) => entityData?.[k] || ""),
              body: (action.body || "").replace(/{{(\w+)}}/g, (_: string, k: string) => entityData?.[k] || ""),
              contactId: action.contactId || entityData?.contactId || (entityType === "contact" ? entityId : undefined),
              dealId: entityType === "deal" ? entityId : undefined,
              userId: Number(session.user.id),
            });
            actionResults.push({ type: "activity", id: a.id });
            break;
          }
          case "update_field": {
            const targetModel = (db as any)[action.entityType as string];
            if (targetModel?.update) {
              await targetModel.update(
                { id: entityId, workspaceId: wsId },
                { [action.fieldName]: action.fieldValue }
              );
              actionResults.push({ type: "update", field: action.fieldName });
            }
            break;
          }
          case "notify_user": {
            const n = await db.Notification.insert({
              workspaceId: wsId,
              userId: action.userId || Number(session.user.id),
              type: action.notificationType || "info",
              title: (action.title || "").replace(/{{(\w+)}}/g, (_: string, k: string) => entityData?.[k] || ""),
              body: (action.body || "").replace(/{{(\w+)}}/g, (_: string, k: string) => entityData?.[k] || ""),
            });
            actionResults.push({ type: "notification", id: n.id });
            break;
          }
          case "create_deal": {
            const d = await db.Deal.insert({
              workspaceId: wsId,
              title: (action.title || "").replace(/{{(\w+)}}/g, (_: string, k: string) => entityData?.[k] || ""),
              value: action.value || 0,
              stage: action.stage || "lead",
              probability: action.probability || 10,
              contactId: entityType === "contact" ? entityId : (entityData?.contactId || undefined),
              assignedTo: action.assignedTo || Number(session.user.id),
            });
            actionResults.push({ type: "deal", id: d.id });
            break;
          }
          case "webhook": {
            actionResults.push({ type: "webhook", url: action.url });
            break;
          }
          default:
            actionResults.push({ type: "unknown", action: action.type });
        }
      } catch (err: any) {
        actionResults.push({ type: "error", message: err.message });
      }
    }

    await db.Workflow.update({ id: workflow.id, workspaceId: wsId }, {
      runCount: (workflow.runCount || 0) + 1,
    });

    results.push({
      workflowId: workflow.id,
      workflowName: workflow.name,
      actions: actionResults,
    });
  }

  return NextResponse.json({ matched: results.length, results });
}
