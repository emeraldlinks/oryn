# Hello World Plugin — Walkthrough

This is the simplest possible Oryn plugin. It's designed to teach you the
absolute basics of the Plugin SDK in under 5 minutes.

## What you'll learn

- How a plugin is structured
- What a manifest contains
- How to add a page extension
- What page sections are
- How to add a simple action
- How to create a widget

## Files

```
hello-world/
├── manifest.json       # Plugin identity & permissions
├── extensions.json     # All extensions (pages, actions, widgets)
├── marketplace.json    # For publishing to the Marketplace
└── README.md           # This file
```

## Step 1: The Manifest (`manifest.json`)

Every plugin starts with a manifest:

```json
{
  "name": "hello-world",
  "version": "1.0.0",
  "author": "Your Name Here",
  "description": "A minimal Hello World plugin...",
  "entryPoint": null,
  "permissions": ["contacts:read"]
}
```

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier (lowercase, hyphens). Used in URLs like `/admin/plugins/hello-world/hello`. |
| `version` | Semver. Increment when you make changes. |
| `author` | Your name (will appear in Marketplace). |
| `description` | Short summary of what the plugin does. |
| `entryPoint` | Optional path to a code file. Null for pure config plugins. |
| `permissions` | What your plugin can access. `contacts:read` means "can read contacts." |

## Step 2: Extensions (`extensions.json`)

Extensions are what make your plugin useful. This plugin has three.

### Page Extension

```json
{
  "extensionType": "page",
  "name": "hello",
  "config": {
    "sidebarLabel": "Hello World",
    "sidebarIcon": "Layout",
    "description": "A friendly welcome page...",
    "sections": [...]
  }
}
```

- **name**: The URL slug — your page will be at `/admin/plugins/hello-world/hello`
- **sidebarLabel**: What appears in the admin sidebar
- **sidebarIcon**: Any Lucide icon name
- **sections**: An array of UI components to render

#### Sections

Pages are built from reusable section blocks. This plugin uses two:

**Hero section** — A large card with title and description:
```json
{
  "type": "hero",
  "title": "Hello, Oryn!",
  "description": "Welcome..."
}
```

**Stats section** — A grid of stat cards:
```json
{
  "type": "stats",
  "title": "Quick Stats",
  "stats": [
    { "label": "Plugin Version", "value": "1.0.0", "icon": "Activity" }
  ]
}
```

### Action Extension

```json
{
  "extensionType": "action",
  "name": "ping",
  "config": {
    "label": "Ping",
    "description": "A simple test action...",
    "method": "POST"
  }
}
```

Actions appear in the plugin detail page under the Actions tab. Click "Run Action"
to execute. If you configure a `webhookUrl`, it will forward to your server.

### Widget Extension

```json
{
  "extensionType": "widget",
  "name": "hello-stats",
  "config": {
    "label": "Hello World Stats",
    "description": "A simple widget showing this plugin is active.",
    "type": "metric",
    "size": "sm"
  }
}
```

Widgets appear in the Custom Dashboard builder. Users can add them to their
dashboards from `Admin → Reports → Custom Dashboards`.

## Step 3: Try it yourself

1. Go to **Admin → Plugins**
2. Click **Register Plugin**
3. Copy the values from `manifest.json` into the form
4. Click **Register**
5. Click **Add Extension** for each extension in `extensions.json`
6. Toggle the plugin to **Enabled**
7. Look for **"Hello World"** in the sidebar — click it!
8. Go to the plugin detail page and try the **Ping** action
9. Go to **Admin → Reports** and try adding the widget to a dashboard

## Next Steps

Now that you understand the basics, try these:

1. Add a table section to the hello page
2. Add a second page
3. Create an AI tool
4. Publish to the Marketplace

Check out the other examples in `docs/examples/` for more advanced patterns.
