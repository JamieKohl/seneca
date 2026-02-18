import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await prisma.trackedSubscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, cost, billingCycle, category, renewalDate, cancellationUrl } = body;

  if (!name || cost === undefined) {
    return NextResponse.json({ error: "Name and cost are required" }, { status: 400 });
  }

  const subscription = await prisma.trackedSubscription.create({
    data: {
      userId: session.user.id,
      name,
      cost: parseFloat(cost),
      billingCycle: billingCycle || "monthly",
      category: category || null,
      renewalDate: renewalDate ? new Date(renewalDate) : null,
      cancellationUrl: cancellationUrl || null,
    },
  });

  return NextResponse.json(subscription);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, name, cost, billingCycle, category, renewalDate, cancellationUrl } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.trackedSubscription.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (status !== undefined) updateData.status = status;
  if (name !== undefined) updateData.name = name;
  if (cost !== undefined) updateData.cost = parseFloat(cost);
  if (billingCycle !== undefined) updateData.billingCycle = billingCycle;
  if (category !== undefined) updateData.category = category;
  if (renewalDate !== undefined) updateData.renewalDate = renewalDate ? new Date(renewalDate) : null;
  if (cancellationUrl !== undefined) updateData.cancellationUrl = cancellationUrl;

  const updated = await prisma.trackedSubscription.update({
    where: { id },
    data: updateData,
  });

  // Create alert if subscription was cancelled
  if (status === "cancelled" && existing.status !== "cancelled") {
    await prisma.alertLog.create({
      data: {
        userId: session.user.id,
        type: "subscription",
        title: `Subscription Cancelled: ${existing.name}`,
        body: `You cancelled ${existing.name} ($${existing.cost}/${existing.billingCycle}). You'll save $${existing.cost}/month.`,
        actionable: false,
        actionUrl: "/subscriptions",
      },
    });
  }

  return NextResponse.json(updated);
}
