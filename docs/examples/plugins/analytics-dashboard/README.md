# Analytics Hub Dashboard — Walkthrough

This plugin is a **reference implementation** of the page section system.
It demonstrates every available section type in a single page.

## What you'll learn

- All 6 page section types in detail
- How section config maps to rendered UI
- Combining multiple sections for rich dashboards
- Chart types and data formats
- Activity timeline status values

## Files

```
analytics-dashboard/
├── manifest.json         # Plugin identity
├── extensions.json       # 9 extensions (1 page + 3 widgets + 2 actions + 1 model)
├── marketplace.json      # Marketplace listing
└── README.md             # This file
```

## Page Section Reference

### Hero Section

A large welcome banner with title and description.

```json
{
  "type": "hero",
  "title": "Welcome to the Analytics Hub",
  "description": "Your description text here..."
}
```

Best used at the top of a page as an introduction.

### Stats Section

A grid of stat cards, each with a value, label, optional change indicator,
and optional icon.

```json
{
  "type": "stats",
  "title": "Key Metrics",
  "stats": [
    {
      "label": "Total Revenue", // Shown below the value
      "value": "$847,230",      // Large primary number
      "change": "+12.5%",       // Change text (green up / red down)
      "icon": "TrendingUp"      // Lucide icon name (optional)
    }
  ]
}
```

**Change indicators**: Positive values (or values starting with `+`) show
green with `TrendingUp` icon. Negative values show red with `TrendingDown`.
Non-numeric changes (like "Due today") show `AlertCircle`.

### Chart Section

Displays a visual bar representation of data.

```json
{
  "type": "chart",
  "title": "Monthly Performance",
  "chartType": "bar",          // bar, line, pie, area
  "labels": ["Jan", "Feb", "Mar"],
  "datasets": [
    {
      "label": "Revenue",
      "data": [45000, 52000, 48000],
      "color": "#3b82f6"       // CSS color
    }
  ]
}
```

**Chart types**: `bar` (vertical bars), `line` (connected dots),
`pie` (proportional slices), `area` (filled line).

**Multiple datasets**: You can include multiple datasets. Each gets its own
row of colored bars in the visual representation.

### Table Section

An HTML table with headers and rows.

```json
{
  "type": "table",
  "title": "Top Deals",
  "columns": [
    { "key": "deal", "label": "Deal Name" },  // key = field in rows
    { "key": "value", "label": "Value" }
  ],
  "rows": [
    { "deal": "Enterprise Upgrade", "value": "$85,000" }
  ]
}
```

Tables render with striped rows and sticky headers. No limit on column count.

### Activity Section

A vertical timeline with status badges.

```json
{
  "type": "activity",
  "title": "Recent Activity",
  "items": [
    {
      "title": "Deal closed",
      "description": "Acme Corp signed for $85,000",
      "status": "completed",    // controls badge color
      "date": "2 hours ago"
    }
  ]
}
```

**Status values and their badge colors**:

| Status | Color | Use |
|--------|-------|-----|
| `completed` / `published` / `sent` | Green | Done, successful |
| `pending` / `scheduled` / `draft` | Yellow | Waiting, not yet done |
| `in-progress` / `running` | Blue | Currently happening |
| `urgent` / `failed` / `overdue` | Red | Needs attention |
| `new` | Purple | Recently created |
| `cancelled` | Gray | No longer relevant |
| `billable` | Green with $ | Billable time entries |
| `non-billable` | Gray | Non-billable time entries |
| any other value | Gray | Default fallback |

### Form Section

Renders input fields and a submit button (shows a toast on submit).

```json
{
  "type": "form",
  "title": "Quick Note",
  "description": "Optional description shown below the title.",
  "formFields": [
    {
      "name": "title",
      "label": "Note Title",
      "type": "text",           // text, number, select, boolean, date
      "required": true,
      "options": []              // Only for type: "select"
    }
  ]
}
```

**Field types**: `text` (text input), `number` (number input),
`select` (dropdown with options[]), `boolean` (toggle switch),
`date` (date input).

## Combining Sections for Rich Pages

A page can have multiple sections of the same type. This page
demonstrates:

```
Page: Analytics Hub
├── Hero          (welcome banner)
├── Stats         (positive metrics)
├── Stats         (negative metrics — shows red arrows)
├── Chart (bar)   (revenue/costs/profit)
├── Chart (line)  (growth trends)
├── Chart (pie)   (lead sources)
├── Chart (area)  (cumulative growth)
├── Table         (top deals with 6 columns)
├── Activity      (recent timeline with 4 status types)
└── Form          (quick note with 5 field types)
```

## Model Extension

This plugin also adds 3 fields to the `deal` entity:

```json
{
  "entity": "deal",
  "fields": [
    { "name": "analyticsScore", "type": "number", "label": "Analytics Score" },
    { "name": "lastAnalyzed", "type": "date", "label": "Last Analyzed" },
    { "name": "analyticsTags", "type": "json", "label": "Analytics Tags" }
  ]
}
```

## Try it yourself

1. Register the plugin and add all extensions
2. Enable the plugin
3. Navigate to the **Analytics Hub** page in the sidebar
4. Scroll through all section types
5. Try the form — fill in fields and click Submit
6. Add the widgets to a Custom Dashboard
7. Run the **Refresh Analytics** action

## Key Takeaways

- **6 section types** cover all common dashboard patterns
- **Multiple sections** can be composed on a single page
- **Charts** support bar, line, pie, and area with multiple datasets
- **Activity statuses** have predefined color mappings
- **Model extensions** can be combined with rich pages
- Use this plugin as a **reference** when building your own pages
