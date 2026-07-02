export function checkPluginPermission(
  pluginPermissions: string[],
  requiredPermission: string
): boolean {
  const reqParts = requiredPermission.split(":");
  for (const perm of pluginPermissions) {
    if (perm === requiredPermission) return true;
    if (perm === "*") return true;
    const permParts = perm.split(":");
    if (permParts.length === 2 && permParts[0] === reqParts[0] && permParts[1] === "*") {
      return true;
    }
  }
  return false;
}

export function formatPluginPermissions(permissions: string[]): string {
  if (permissions.length === 0) return "No permissions";
  if (permissions.includes("*")) return "Full access";
  return permissions
    .map((p) => {
      const [resource, action] = p.split(":");
      if (action === "*") return `Full ${resource} access`;
      return `${resource}: ${action}`;
    })
    .join(", ");
}
