import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLUGIN_SEEDS } from "@/seed/plugins";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden: admin or superadmin required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  let seeded = 0;
  let skipped = 0;
  let workspaceInstalled = false;

  for (const seed of PLUGIN_SEEDS) {
    const existing = await db.MarketplaceListing.query()
      .where("name", "=", seed.marketplace.name)
      .first();
    if (existing) {
      skipped++;
      continue;
    }

    await db.MarketplaceListing.insert({
      type: seed.marketplace.type,
      name: seed.marketplace.name,
      description: seed.marketplace.description || null,
      version: seed.marketplace.version,
      author: seed.marketplace.author || null,
      publisher: seed.marketplace.publisher || null,
      iconUrl: seed.marketplace.iconUrl || null,
      config: seed.marketplace.config,
      verified: seed.marketplace.verified,
      published: seed.marketplace.published,
      installCount: 0,
      rating: 0,
      reviewCount: 0,
      featured: seed.marketplace.featured,
      categories: seed.marketplace.categories || null,
      tags: seed.marketplace.tags || null,
    });

    seeded++;

    if (workspaceId) {
      const wsId = Number(workspaceId);
      const plugins = await db.Plugin.query()
        .where("workspaceId", "=", wsId)
        .where("name", "=", seed.manifest.name)
        .get();
      const existingPlugin = plugins.length > 0 ? plugins[0] : null;

      if (!existingPlugin) {
        await db.Plugin.insert({
          workspaceId: wsId,
          name: seed.manifest.name,
          version: seed.manifest.version,
          author: seed.manifest.author || null,
          description: seed.manifest.description || null,
          entryPoint: seed.manifest.entryPoint || null,
          permissions: seed.manifest.permissions || null,
          enabled: true,
        });
      }

      const plugins2 = await db.Plugin.query()
        .where("workspaceId", "=", wsId)
        .where("name", "=", seed.manifest.name)
        .get();
      const plugin = plugins2.length > 0 ? plugins2[0] : null;

      if (plugin) {
        for (const ext of seed.extensions) {
          const existingExts = await db.PluginExtension.query()
            .where("pluginId", "=", plugin.id)
            .where("name", "=", ext.name)
            .get();
          if (existingExts.length === 0) {
            await db.PluginExtension.insert({
              pluginId: plugin.id,
              extensionType: ext.extensionType,
              name: ext.name,
              config: ext.config,
              active: true,
            });
          }
        }
        workspaceInstalled = true;
      }
    }
  }

  return NextResponse.json({ seeded, skipped, workspaceInstalled });
}
