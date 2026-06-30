import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDb } from "@/lib/db";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type DetectedAction = {
  type: string;
  params: Record<string, unknown>;
};

const PROVIDER_MODELS: Record<string, string> = {
  openai: "gpt-4",
  gemini: "gemini-pro",
  deepseek: "deepseek-chat",
  claude: "claude-3",
  qwen: "qwen-max",
  kimi: "moonshot-v1",
  nvidia: "nvapi-nim",
  opencode: "opencode-model",
};

const AVAILABLE_ACTIONS = [
  "create_contact",
  "create_deal",
  "update_deal_stage",
  "send_email",
  "create_activity",
  "create_ticket",
  "create_notification",
  "list_contacts",
  "list_deals",
  "get_forecast",
];

function buildSystemPrompt(role: string, workspaceId: number): string {
  return `You are an AI assistant for a CRM platform. You help users manage contacts, deals, activities, tickets, notifications, and more.

User role: ${role}
Workspace ID: ${workspaceId}

Available actions you can perform:
${AVAILABLE_ACTIONS.map((a) => `- ${a}`).join("\n")}

Based on the user's message, determine the most appropriate action to take. Respond conversationally, explaining what you will do, and include the detected action details.`;
}

function parseIntent(message: string): { reply: string; detectedAction: DetectedAction } {
  const lower = message.toLowerCase();

  if (lower.includes("create") && (lower.includes("contact") || lower.includes("lead"))) {
    const nameMatch = message.match(/(?:named|called|for)\s+["']?([A-Za-z\s]+)["']?/i);
    const name = nameMatch ? nameMatch[1].trim() : "New Contact";
    return {
      reply: `I can help you with that. I'll create a new contact named "${name}".`,
      detectedAction: {
        type: "create_contact",
        params: { firstName: name.split(" ")[0] || name, lastName: name.split(" ").slice(1).join(" ") || "" },
      },
    };
  }

  if (lower.includes("create") && lower.includes("deal")) {
    const titleMatch = message.match(/(?:for|named|called)\s+["']?([A-Za-z\s]+)["']?/i);
    const title = titleMatch ? titleMatch[1].trim() : "New Deal";
    const valueMatch = message.match(/(\d+[\d,]*\.?\d*)\s*(?:usd|\$|dollars)?/i);
    const value = valueMatch ? parseFloat(valueMatch[1].replace(/,/g, "")) : 0;
    return {
      reply: `I can help you with that. I'll create a new deal titled "${title}" with a value of $${value || "0"}.`,
      detectedAction: {
        type: "create_deal",
        params: { title, value, stage: "lead" },
      },
    };
  }

  if (lower.includes("update") || lower.includes("move") || lower.includes("change")) {
    if (lower.includes("stage") || lower.includes("status") || lower.includes("qualified") || lower.includes("proposal") || lower.includes("negotiation") || lower.includes("won") || lower.includes("lost")) {
      const stages = ["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"];
      const foundStage = stages.find((s) => lower.includes(s));
      return {
        reply: `I can help you update the deal stage. Moving the deal to "${foundStage || "qualified"}".`,
        detectedAction: {
          type: "update_deal_stage",
          params: { stage: foundStage || "qualified", dealId: 0 },
        },
      };
    }
  }

  if (lower.includes("send") && (lower.includes("email") || lower.includes("mail"))) {
    return {
      reply: "I can help you send an email. Please provide the recipient, subject, and message body.",
      detectedAction: {
        type: "send_email",
        params: { to: "", subject: "", body: "" },
      },
    };
  }

  if (lower.includes("log") || lower.includes("create activity") || lower.includes("note") || (lower.includes("add") && lower.includes("activity"))) {
    return {
      reply: "I can help you log an activity. I'll record a note for this contact.",
      detectedAction: {
        type: "create_activity",
        params: { type: "note", subject: message.slice(0, 100), body: message },
      },
    };
  }

  if (lower.includes("ticket") || lower.includes("support")) {
    return {
      reply: "I can help you create a support ticket. I'll create a ticket based on your request.",
      detectedAction: {
        type: "create_ticket",
        params: { subject: message.slice(0, 100), priority: "medium" },
      },
    };
  }

  if (lower.includes("notify") || lower.includes("notification") || lower.includes("alert")) {
    return {
      reply: "I can help you send a notification. I'll create a notification for the relevant users.",
      detectedAction: {
        type: "create_notification",
        params: { title: "Notification", body: message },
      },
    };
  }

  if (lower.includes("list") || lower.includes("show") || lower.includes("find")) {
    if (lower.includes("contact") || lower.includes("lead")) {
      return {
        reply: "I can help you find contacts. Let me search your contacts.",
        detectedAction: {
          type: "list_contacts",
          params: { search: message, limit: 20 },
        },
      };
    }
    if (lower.includes("deal") || lower.includes("pipeline") || lower.includes("opportunity")) {
      return {
        reply: "I can help you find deals. Let me search your deals.",
        detectedAction: {
          type: "list_deals",
          params: { search: message, limit: 20 },
        },
      };
    }
  }

  if (lower.includes("forecast") || lower.includes("revenue") || lower.includes("pipeline")) {
    return {
      reply: "I can help you with forecasting. Let me pull up the revenue forecast.",
      detectedAction: {
        type: "get_forecast",
        params: { period: "monthly" },
      },
    };
  }

  return {
    reply: "I understand your request. How can I assist you with your CRM tasks today? You can ask me to create contacts, deals, send emails, manage tickets, and more.",
    detectedAction: {
      type: "none",
      params: {},
    },
  };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { message, conversationId, provider = "openai" } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const userId = Number(session.user.id);
  const workspaceId = Number(session.user.workspaceId);
  const role = String(session.user.role);

  if (!PROVIDER_MODELS[provider]) {
    return NextResponse.json(
      { error: `Unsupported provider: ${provider}. Supported: ${Object.keys(PROVIDER_MODELS).join(", ")}` },
      { status: 400 }
    );
  }

  return withDb(async (db) => {
    const apiKeyRecord = await db.AIApiKey.query()
      .where("workspaceId", "=", workspaceId)
      .where("provider", "=", provider)
      .where("active", "=", true)
      .where((q: any) =>
        q.where("scope", "=", "workspace").orWhere((iq: any) => iq.where("scope", "=", "user").where("userId", "=", userId))
      )
      .orderByRaw("CASE WHEN scope = 'user' THEN 0 ELSE 1 END")
      .first();

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: `No API key configured for ${provider}` },
        { status: 400 }
      );
    }

    let conversation;

    if (conversationId) {
      conversation = await db.AIConversation.get({
        id: conversationId,
        workspaceId,
        userId,
      });

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else {
      conversation = await db.AIConversation.insert({
        workspaceId,
        userId,
        title: message.slice(0, 200),
        messages: [],
        provider,
        status: "active",
      });
    }

    const messages = (Array.isArray(conversation.messages) ? conversation.messages : []) as ChatMessage[];

    const userMessage: ChatMessage = { role: "user", content: message };
    messages.push(userMessage);

    const systemPrompt = buildSystemPrompt(role, workspaceId);
    const { reply, detectedAction } = parseIntent(message);

    const assistantMessage: ChatMessage = { role: "assistant", content: reply };
    messages.push(assistantMessage);

    await db.AIConversation.update(
      { id: conversation.id },
      { messages: messages as unknown as Record<string, unknown> }
    );

    await db.AIApiKey.update(
      { id: apiKeyRecord.id },
      { lastUsedAt: new Date().toISOString() }
    );

    return NextResponse.json({
      id: conversation.id,
      reply,
      detectedAction: detectedAction.type !== "none" ? detectedAction : undefined,
      detectedActionType: detectedAction.type !== "none" ? detectedAction : null,
      requiresConfirmation: detectedAction.type !== "none",
      provider,
      model: PROVIDER_MODELS[provider],
    });
  });
}
