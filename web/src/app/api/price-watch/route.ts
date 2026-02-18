import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watches = await prisma.priceWatch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const parsed = watches.map((w) => ({
    ...w,
    priceSnapshots: w.priceSnapshots ? JSON.parse(w.priceSnapshots) : [],
  }));

  return NextResponse.json(parsed);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productName, productUrl, currentPrice, notes } = body;

  if (!productName || !productUrl) {
    return NextResponse.json({ error: "Product name and URL are required" }, { status: 400 });
  }

  const price = currentPrice ? parseFloat(currentPrice) : null;
  const initialSnapshots = price
    ? JSON.stringify([{ price, date: new Date().toISOString(), context: "initial" }])
    : null;

  const watch = await prisma.priceWatch.create({
    data: {
      userId: session.user.id,
      productName,
      productUrl,
      currentPrice: price,
      lowestPrice: price,
      highestPrice: price,
      priceSnapshots: initialSnapshots,
      notes: notes || null,
    },
  });

  return NextResponse.json({
    ...watch,
    priceSnapshots: initialSnapshots ? JSON.parse(initialSnapshots) : [],
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, currentPrice, context, flagged } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await prisma.priceWatch.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};

  if (currentPrice !== undefined) {
    const price = parseFloat(currentPrice);
    updateData.currentPrice = price;

    // Update price bounds
    if (!existing.lowestPrice || price < existing.lowestPrice) {
      updateData.lowestPrice = price;
    }
    if (!existing.highestPrice || price > existing.highestPrice) {
      updateData.highestPrice = price;
    }

    // Add snapshot
    const snapshots = existing.priceSnapshots ? JSON.parse(existing.priceSnapshots) : [];
    snapshots.push({
      price,
      date: new Date().toISOString(),
      context: context || "manual check",
    });
    updateData.priceSnapshots = JSON.stringify(snapshots);

    // Auto-flag if price difference is suspicious (>15% spread)
    const lowest = (updateData.lowestPrice as number) ?? existing.lowestPrice ?? price;
    const highest = (updateData.highestPrice as number) ?? existing.highestPrice ?? price;
    if (lowest > 0 && (highest - lowest) / lowest > 0.15) {
      updateData.flagged = true;

      // Create alert
      await prisma.alertLog.create({
        data: {
          userId: session.user.id,
          type: "price",
          title: `Price Discrimination Detected: ${existing.productName}`,
          body: `Price spread of ${(((highest - lowest) / lowest) * 100).toFixed(0)}% detected. Lowest: $${lowest.toFixed(2)}, Highest: $${highest.toFixed(2)}.`,
          actionable: true,
          actionUrl: "/price-watch",
        },
      });
    }
  }

  if (flagged !== undefined) {
    updateData.flagged = flagged;
  }

  const updated = await prisma.priceWatch.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    ...updated,
    priceSnapshots: updated.priceSnapshots ? JSON.parse(updated.priceSnapshots) : [],
  });
}
