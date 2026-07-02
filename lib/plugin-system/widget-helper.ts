import { pluginRegistry } from "./registry";

export async function getAvailableWidgets(workspaceId: number) {
  const pluginWidgets = pluginRegistry.getWidgets(workspaceId);
  return [
    { type: "revenue_chart", label: "Revenue Chart", source: "builtin" },
    { type: "pipeline", label: "Pipeline", source: "builtin" },
    { type: "team_performance", label: "Team Performance", source: "builtin" },
    { type: "deal_conversion", label: "Deal Conversion", source: "builtin" },
    { type: "activity_log", label: "Activity Log", source: "builtin" },
    ...pluginWidgets.map(w => ({
      type: `plugin:${w.name}`,
      label: w.config.label,
      source: "plugin",
      pluginName: w.name,
    })),
  ];
}
