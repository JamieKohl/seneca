import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brokers = await prisma.dataBroker.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(brokers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { brokerName, optOutUrl } = body;

  if (!brokerName) {
    return NextResponse.json({ error: "Broker name is required" }, { status: 400 });
  }

  // Check for duplicate
  const existing = await prisma.dataBroker.findUnique({
    where: {
      userId_brokerName: {
        userId: session.user.id,
        brokerName,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Broker already tracked" }, { status: 409 });
  }

  const broker = await prisma.dataBroker.create({
    data: {
      userId: session.user.id,
      brokerName,
      optOutUrl: optOutUrl || null,
      status: "pending",
    },
  });

  return NextResponse.json(broker);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.dataBroker.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (status) {
    updateData.status = status;
    if (status === "submitted") updateData.submittedDate = new Date();
    if (status === "confirmed") updateData.confirmedDate = new Date();
    updateData.lastChecked = new Date();
  }

  const updated = await prisma.dataBroker.update({
    where: { id },
    data: updateData,
  });

  // Create alert for status changes
  if (status === "confirmed") {
    await prisma.alertLog.create({
      data: {
        userId: session.user.id,
        type: "privacy",
        title: `Opt-Out Confirmed: ${existing.brokerName}`,
        body: `${existing.brokerName} has confirmed removal of your personal data.`,
        actionable: false,
        actionUrl: "/privacy",
      },
    });
  } else if (status === "re-listed") {
    await prisma.alertLog.create({
      data: {
        userId: session.user.id,
        type: "privacy",
        title: `Re-Listed: ${existing.brokerName}`,
        body: `${existing.brokerName} has re-listed your personal information. We recommend opting out again.`,
        actionable: true,
        actionUrl: "/privacy",
      },
    });
  }

  return NextResponse.json(updated);
}
