# Order Tagger Plugin — Walkthrough

This plugin teaches four important Plugin SDK concepts: **model extensions**,
**actions**, **webhooks**, and **AI tools**.

## What you'll learn

- Adding custom fields to existing entities (Model extensions)
- Creating runnable business logic (Actions)
- Subscribing to system events (Webhooks)
- Building AI-powered features (AI Tools)
- Creating multi-page plugins

## Files

```
order-tagger/
├── manifest.json        # Plugin identity & permissions
├── extensions.json      # All 9 extensions
├── marketplace.json     # Marketplace listing
└── README.md            # This file
```

## Model Extensions

Model extensions add custom database fields to existing CRM entities
without modifying core code. This plugin adds four fields to the `invoice` entity:

```json
{
  "extensionType": "model",
  "name": "order-tags",
  "config": {
    "entity": "invoice",
    "fields": [
      { "name": "tags", "type": "json", "label": "Order Tags" },
      { "name": "taggedAt",   "type": "date",    "label": "Last Tagged" },
      { "name": "autoTagged", "type": "boolean",  "label": "Auto-Tagged" },
      { "name": "tagSource",  "type": "string",   "label": "Tag Source" }
    ]
  }
}
```

### Available Entities

| entity | CRM Model | Common Use Cases |
|--------|-----------|-----------------|
| `contact` | Contact | Loyalty data, preferences, consent flags |
| `deal` | Deal | Scoring, pipeline custom fields |
| `invoice` | Invoice | Tags, payment metadata, flags |
| `project` | Project | Budget, time tracking, status flags |
| `email` | Email | Engagement scores, preferences |

### Field Types

| type | JSON Value | Example |
|------|-----------|---------|
| `string` | `"text"` | Customer notes |
| `number` | `42` | Loyalty points |
| `boolean` | `true` | Is VIP flag |
| `date` | ISO date string | Last contacted |
| `select` | One of options[] | Membership tier |
| `json` | Any JSON | Tags array, preferences |

Plugin fields are merged with built-in fields via `getMergedFields()`.
They appear in API responses and form UIs alongside native fields.

## Actions

Actions are operations users can run from the plugin detail page.

```json
{
  "extensionType": "action",
  "name": "apply-bulk-tag",
  "config": {
    "label": "Apply Bulk Tag",
    "description": "Apply a tag to multiple orders based on filters",
    "method": "POST"
  }
}
```

Actions can also forward to an external webhook URL:
```json
{
  "config": {
    "webhookUrl": "https://my-server.com/actions/bulk-tag"
  }
}
```

When triggered, the system sends a POST with `{ workspaceId, userId, action, params }`.

## Webhooks

Webhooks let your plugin react to system events.

```json
{
  "extensionType": "webhook",
  "name": "order-tag-webhook",
  "config": {
    "events": ["invoice.created", "invoice.paid"],
    "url": "https://your-server.com/webhooks/order-tagger"
  }
}
```

When `invoice.created` fires, your webhook URL receives:
```json
{
  "event": "invoice.created",
  "workspaceId": 1,
  "timestamp": "2026-06-01T12:00:00Z",
  "data": { ... invoice record ... }
}
```

### Available Events

- `contact.created`, `contact.updated`, `contact.deleted`
- `deal.created`, `deal.updated`, `deal.stage_changed`
- `invoice.created`, `invoice.paid`, `invoice.overdue`
- `email.sent`, `email.opened`, `email.clicked`
- `task.created`, `task.completed`
- `ticket.created`

Delivery attempts are logged in `WebhookDelivery` with full request/response.

## AI Tools

AI tools let your plugin extend the AI Assistant.

```json
{
  "extensionType": "ai_tool",
  "name": "suggest-tags",
  "config": {
    "label": "Suggest Tags",
    "description": "Analyze an order and suggest relevant tags",
    "handler": "suggestTags",
    "parameters": [
      { "name": "orderId", "type": "number", "label": "Order ID", "required": true, "description": "The order to analyze" }
    ]
  }
}
```

The user can now say to the AI Assistant:
*"Suggest tags for order 4891"*

The AI detects the intent, resolves the `suggestTags` tool, and calls
`POST /api/plugins/order-tagger/actions/suggestTags` with `{ orderId: 4891 }`.

### Parameter Types

| type | UI Widget | Use When |
|------|-----------|----------|
| `string` | Text input | Free text like a name or query |
| `number` | Number input | Quantities, IDs, amounts |
| `boolean` | Toggle | True/false options |
| `select` | Dropdown | Fixed set of choices |

## Try it yourself

1. Register the plugin with `manifest.json`
2. Add each of the 9 extensions from `extensions.json`
3. Enable the plugin
4. Visit the **Order Tags** and **Tag Report** pages
5. Run the **Apply Bulk Tag** action
6. Ask the AI: *"Suggest tags for order 4891"*
7. Add the widgets to a Custom Dashboard
8. Create an order to trigger the webhook

## Key Takeaways

- **Models** add fields without migrations
- **Actions** run business logic on demand
- **Webhooks** react to events in real-time
- **AI Tools** make your plugin voice/chat-enabled
- **Pages** with multiple section types create rich UIs
