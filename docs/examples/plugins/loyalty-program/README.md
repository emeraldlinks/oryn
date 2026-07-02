# Loyalty Program Plugin — Walkthrough

This plugin focuses on **data model extensions** — adding custom fields to
existing CRM entities. It also demonstrates event-driven automation via
webhooks and AI-powered features.

## What you'll learn

- Adding 9 custom fields to the Contact entity
- Using all 6 field types (string, number, boolean, date, select, json)
- Creating AI tools that read and write data
- Building event-driven automation with webhooks
- Creating a rewards catalog page with a form section

## Files

```
loyalty-program/
├── manifest.json        # Plugin identity
├── extensions.json      # All 12 extensions
├── marketplace.json     # Marketplace listing
└── README.md            # This file
```

## Deep Dive: Model Extensions

Model extensions are the most powerful feature of the Plugin SDK —
they let you add new database fields to existing entities.

### How it works

```json
{
  "extensionType": "model",
  "name": "loyalty-data",
  "config": {
    "entity": "contact",
    "fields": [
      {
        "name": "loyaltyTier",
        "type": "select",
        "label": "Loyalty Tier",
        "options": ["bronze", "silver", "gold", "platinum"],
        "defaultValue": "bronze"
      },
      {
        "name": "loyaltyPoints",
        "type": "number",
        "label": "Loyalty Points",
        "defaultValue": 0
      }
    ]
  }
}
```

When this model extension is active, every Contact record will include
`loyaltyTier` and `loyaltyPoints` fields — as if they were native columns.

### Field Type Reference

This plugin demonstrates every available field type:

| Example Field | Type | Config | Data |
|-------------|------|--------|------|
| `loyaltyTier` | `select` | `options: ["bronze","silver","gold","platinum"]` | `"gold"` |
| `loyaltyPoints` | `number` | `defaultValue: 0` | `2847` |
| `pointsMultiplier` | `number` | `defaultValue: 1.0` | `1.5` |
| `enrolledAt` | `date` | — | `"2026-01-15"` |
| `referralCode` | `string` | — | `"ACME2026"` |
| `rewardPreferences` | `json` | — | `{"categories": ["gift-cards", "shipping"]}` |

### Default Values

Use `defaultValue` to ensure new records start with sensible defaults:

```json
{ "name": "loyaltyPoints", "type": "number", "defaultValue": 0 }
{ "name": "loyaltyTier", "type": "select", "defaultValue": "bronze", "options": [...] }
{ "name": "pointsMultiplier", "type": "number", "defaultValue": 1.0 }
```

Without a default, the field starts as `null`.

### Entity Targeting

Choose which entity gets the new fields:

| `entity` | Target | Use Case |
|----------|--------|----------|
| `contact` | Contact records | Loyalty data, preferences, consent |
| `deal` | Deal records | Scoring, custom pipeline fields |
| `invoice` | Invoice records | Tags, payment metadata |
| `project` | Project records | Budget, time estimates |
| `email` | Email records | Engagement metrics |

### How plugin fields merge with built-in fields

At query time, the system merges plugin fields with native fields:

```typescript
import { getMergedFields } from "@/lib/plugin-system/model-merger";

const fields = getMergedFields(workspaceId, "contact", [
  { name: "firstName", type: "string", label: "First Name" },  // built-in
  { name: "email", type: "string", label: "Email" },            // built-in
  // plugin fields auto-merge at runtime
]);
```

This makes plugin fields appear in API responses, forms, exports, and
search results alongside native fields.

## AI Tools with Parameters

This plugin has two AI tools:

### check-points — Read operation (simple)

```json
{
  "name": "check-points",
  "config": {
    "parameters": [
      {
        "name": "contactId",
        "type": "number",
        "label": "Contact ID",
        "required": true
      }
    ]
  }
}
```

User says: *"How many points does customer 42 have?"*

### award-bonus-points — Write operation (complex)

```json
{
  "name": "award-bonus-points",
  "config": {
    "parameters": [
      { "name": "contactId", "type": "number", "label": "Contact ID", "required": true },
      { "name": "points", "type": "number", "label": "Points", "required": true },
      { "name": "reason", "type": "string", "label": "Reason", "required": true }
    ]
  }
}
```

User says: *"Award 500 bonus points to customer 42 for their loyalty"*

## Webhook Automation

The purchase-webhook subscribes to `invoice.paid`:

```json
{
  "events": ["invoice.paid"],
  "url": "https://your-server.com/webhooks/loyalty/award-points"
}
```

When an invoice is paid, your server receives:

```json
{
  "event": "invoice.paid",
  "workspaceId": 1,
  "timestamp": "2026-06-01T12:00:00Z",
  "data": {
    "id": 4891,
    "contactId": 42,
    "total": 250.00,
    // ... full invoice record
  }
}
```

Your server would calculate points (e.g., 1 point per $10 spent),
look up the contact's tier multiplier, and award the points.

## Try it yourself

1. Register the plugin with `manifest.json`
2. Add all 12 extensions from `extensions.json`
3. Enable the plugin
4. Check the **Loyalty Program** and **Rewards Catalog** pages
5. Run the **Recalculate Tiers** action
6. Ask the AI: *"Check loyalty points for contact 42"*
7. Ask the AI: *"Award 200 bonus points to contact 42 for their birthday"*
8. Pay an invoice to trigger the webhook

## Key Takeaways

- **Model extensions** add fields without migrations or core changes
- **6 field types** cover strings, numbers, booleans, dates, selects, and JSON
- **AI tools** can both read and write plugin data
- **Webhooks** enable real-time automation
- **`getMergedFields()`** makes plugin fields first-class citizens
