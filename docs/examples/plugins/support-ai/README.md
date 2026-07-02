# Support AI Assistant — Walkthrough

This plugin is entirely focused on **AI Tool extensions** — the most
powerful extension type in the Plugin SDK. It demonstrates 5 different
AI tools with varying parameter patterns, showing how to build
AI-powered features that users can invoke through natural language.

## What you'll learn

- How AI tools are discovered and invoked
- All parameter types and when to use each
- Building tools for read operations vs write operations
- Combining multiple parameters for complex tools
- How the AI resolves natural language to tool calls

## Files

```
support-ai/
├── manifest.json         # Plugin identity
├── extensions.json       # 10 extensions (5 AI tools + page + webhook + model + 2 widgets)
├── marketplace.json      # Marketplace listing
└── README.md             # This file
```

## Deep Dive: AI Tool Extensions

### How AI Tools Work

1. **Registration**: Tools are registered via the AI Tool extension type
2. **Discovery**: The AI Assistant loads all enabled plugin AI tools at startup
3. **Intent Detection**: When a user types a message, the AI detects if any tool matches
4. **Parameter Extraction**: The AI extracts parameter values from the conversation
5. **Execution**: The system calls `POST /api/plugins/{plugin}/actions/{handler}` with the parameters
6. **Response**: The tool's result is returned to the AI, which presents it naturally

### Resolution Flow

```
User: "Summarize ticket 4821 in detail"
         │
         ▼
   AI Engine detects intent
   ┌─────────────────────┐
   │ Tool: summarizeTicket│
   │ params: { ticketId: │
   │   4821,              │
   │   format: "detailed" }│
   └─────────┬───────────┘
             │
             ▼
   POST /api/plugins/support-ai/actions/summarizeTicket
   Body: { workspaceId: 1, params: { ticketId: 4821, format: "detailed" } }
             │
             ▼
   Your action handler processes and returns:
   { success: true, data: { summary: "...", keyPoints: [...] } }
             │
             ▼
   AI presents to user:
   "Here's a detailed summary of ticket 4821..."
```

### Anatomy of an AI Tool

```json
{
  "extensionType": "ai_tool",
  "name": "summarize-ticket",       // Used in URLs and identification
  "config": {
    "label": "Summarize Ticket",     // Displayed to users
    "description": "Generate a...",  // Tells the AI when to use this tool
    "handler": "summarizeTicket",    // Maps to action handler name
    "parameters": [                  // What info to collect from user
      {
        "name": "ticketId",
        "type": "number",
        "label": "Ticket ID",
        "required": true,
        "description": "The ticket to summarize"  // Helps AI extract correctly
      }
    ]
  }
}
```

### The 5 Tools — Parameter Patterns

**Tool 1: Single required parameter**
```json
{
  "name": "detect-sentiment",
  "parameters": [
    { "name": "ticketId", "type": "number", "required": true }
  ]
}
```
User: *"What's the sentiment on ticket 4812?"*

**Tool 2: Required + optional parameter**
```json
{
  "name": "summarize-ticket",
  "parameters": [
    { "name": "ticketId", "type": "number", "required": true },
    { "name": "format", "type": "select", "options": ["brief", "detailed", "bullet-points"] }
  ]
}
```
User: *"Summarize ticket 4821 in bullet points"*

**Tool 3: Required parameter with number + select**
```json
{
  "name": "suggest-solution",
  "parameters": [
    { "name": "ticketId", "type": "number", "required": true },
    { "name": "maxSuggestions", "type": "number" }
  ]
}
```
User: *"Suggest 5 solutions for ticket 4819"*

**Tool 4: Required + select + optional text**
```json
{
  "name": "draft-reply",
  "parameters": [
    { "name": "ticketId", "type": "number", "required": true },
    { "name": "tone", "type": "select", "options": ["professional", "friendly", "urgent", "apologetic"] },
    { "name": "additionalNotes", "type": "string" }
  ]
}
```
User: *"Draft an urgent reply to ticket 4805 mentioning the refund"*

**Tool 5: Required + optional + select with defaults**
```json
{
  "name": "generate-knowledge-article",
  "parameters": [
    { "name": "ticketId", "type": "number", "required": true },
    { "name": "title", "type": "string" },
    { "name": "category", "type": "select", "options": ["troubleshooting", "how-to", "faq", "best-practice"] }
  ]
}
```
User: *"Create a troubleshooting KB article from ticket 4800"*

### Parameter Type Best Practices

| Type | Best for | Example Description |
|------|----------|-------------------|
| `string` | Names, queries, notes | "The customer's name to search for" |
| `number` | IDs, quantities, amounts | "The ticket ID to analyze" |
| `boolean` | Toggle options | "Whether to include resolved tickets" |
| `select` | Fixed choices | "The tone: professional, friendly, urgent, apologetic" |

### Writing Good Descriptions

The `description` field is how the AI knows which tool to use and how
to extract parameters correctly:

```json
// Good — clear, specific
{ "name": "ticketId", "type": "number", "description": "The ticket to summarize" }

// Better — helps AI disambiguate
{ "name": "format", "type": "select",
  "description": "How detailed the summary should be" }
```

### Handler Pattern

The `handler` field maps to the action name in the URL:
```
POST /api/plugins/{pluginName}/actions/{handler}
```

So `"handler": "summarizeTicket"` becomes:
```
POST /api/plugins/support-ai/actions/summarizeTicket
```

The body contains:
```json
{
  "workspaceId": 1,
  "userId": 42,
  "params": {
    "ticketId": 4821,
    "format": "detailed"
  },
  "toolName": "summarize-ticket"
}
```

## Model Extensions on Tickets

This plugin also adds 5 AI-related fields to the `ticket` entity:

```json
{
  "entity": "ticket",
  "fields": [
    { "name": "aiSummary", "type": "string", "label": "AI Summary" },
    { "name": "aiSentiment", "type": "select", "options": ["positive", "neutral", "negative", "urgent"] },
    { "name": "aiSuggestedSolution", "type": "string", "label": "AI Suggested Solution" },
    { "name": "aiAutoResolved", "type": "boolean", "defaultValue": false },
    { "name": "aiConfidence", "type": "number", "defaultValue": 0 }
  ]
}
```

These fields store the AI's output directly on the ticket, making it
available in lists, exports, and reports.

## Try it yourself

1. Register the plugin and add all extensions
2. Enable the plugin
3. Open the AI Assistant and try:

   *"Summarize ticket 4821 in bullet points"*

   *"Suggest solutions for ticket 4819"*

   *"Draft a friendly reply to ticket 4805"*

   *"What's the sentiment on ticket 4812?"*

   *"Create a KB article from ticket 4800 in the troubleshooting category"*

4. Check the **Support AI** dashboard page for AI impact stats
5. Add the widgets to a Custom Dashboard

## Key Takeaways

- **AI tools** let users interact with your plugin via natural language
- **Parameter descriptions** are how the AI understands what to collect
- **Handler** names map to action URLs
- **5 parameter patterns** cover most use cases
- **Model extensions** store AI results for later use
- **Widgets** expose plugin data on dashboards
