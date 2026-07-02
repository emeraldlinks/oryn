import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wsId = Number(session.user.workspaceId);
  const { searchParams } = new URL(req.url);

  let query = db.ProductDiscount.query().where("workspaceId", "=", wsId);

  const active = searchParams.get("active");
  if (active === "true") query = query.where("active", "=", true);
  else if (active === "false") query = query.where("active", "=", false);

  const productId = searchParams.get("productId");
  if (productId) query = query.where("productId", "=", Number(productId));

  query = query.orderBy("createdAt", "DESC");

  const discounts = await query.get();

  const withProduct = await Promise.all(
    discounts.map(async (d: any) => {
      if (d.productId) {
        const product = await db.Product.get({ id: d.productId, workspaceId: wsId });
        return { ...d, product: product || null };
      }
      return { ...d, product: null };
    })
  );

  return NextResponse.json(withProduct);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const discount = await db.ProductDiscount.insert({
    workspaceId: Number(session.user.workspaceId),
    name: body.name,
    discountType: body.discountType,
    discountValue: body.discountValue,
    productId: body.productId || null,
    minQuantity: body.minQuantity || null,
    maxQuantity: body.maxQuantity || null,
    startDate: body.startDate || null,
    endDate: body.endDate || null,
    active: body.active ?? true,
  });

  return NextResponse.json(discount, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  await db.ProductDiscount.update(
    { id: Number(id), workspaceId: Number(session.user.workspaceId) },
    data
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.ProductDiscount.delete({ id: Number(id), workspaceId: Number(session.user.workspaceId) });

  return NextResponse.json({ success: true });
}
