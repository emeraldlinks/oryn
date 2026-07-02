import { pluginRegistry } from "./registry";

export interface MergedField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  defaultValue?: unknown;
  description?: string;
  source: "builtin" | "plugin";
  pluginName?: string;
}

export function getMergedFields(
  workspaceId: number,
  entityType: string,
  builtinFields: { name: string; type: string; label: string }[]
): MergedField[] {
  const pluginModels = pluginRegistry.getModels(workspaceId);
  const pluginFields = pluginModels
    .filter(m => m.config.entity === entityType)
    .flatMap(m => m.config.fields.map(f => ({
      ...f,
      source: "plugin" as const,
      pluginName: m.name,
    })));

  return [
    ...builtinFields.map(f => ({ ...f, source: "builtin" as const })),
    ...pluginFields,
  ];
}
