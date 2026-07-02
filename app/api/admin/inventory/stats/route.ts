import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = Number(session.user.workspaceId);
  const [items, warehouses, suppliers, lowStock, pendingPOs, activeTransfers] = await Promise.all([
    db.InventoryItem.count({ workspaceId: wsId, isActive: true }),
    db.InventoryWarehouse.count({ workspaceId: wsId, isActive: true }),
    db.InventorySupplier.count({ workspaceId: wsId, isActive: true }),
    db.InventoryStock.query().where("workspaceId", "=", wsId).get(),
    db.InventoryPurchaseOrder.count({ workspaceId: wsId, status: "pending" }),
    db.InventoryStockTransfer.count({ workspaceId: wsId, status: "in-transit" }),
  ]);
  const lowStockCount = lowStock.filter((s: any) => s.quantity - s.reservedQuantity <= 5).length;
  return NextResponse.json({ totalItems: items, totalWarehouses: warehouses, totalSuppliers: suppliers, lowStockItems: lowStockCount, pendingPOs, activeTransfers });
}
