import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const data = {
    notifications: {
      scams: settings?.notifyScams ?? true,
      subscriptions: settings?.notifySubscriptions ?? true,
      privacy: settings?.notifyPrivacy ?? true,
      priceWatch: settings?.notifyPriceWatch ?? true,
    },
    quietHoursEnabled: settings?.quietHoursEnabled ?? false,
    quietStart: settings?.quietStart ?? "22:00",
    quietEnd: settings?.quietEnd ?? "08:00",
    plan: subscription?.plan ?? "free",
  };

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};

  if (body.notifications) {
    updateData.notifyScams = body.notifications.scams;
    updateData.notifySubscriptions = body.notifications.subscriptions;
    updateData.notifyPrivacy = body.notifications.privacy;
    updateData.notifyPriceWatch = body.notifications.priceWatch;
  }
  if (body.quietHoursEnabled !== undefined) updateData.quietHoursEnabled = body.quietHoursEnabled;
  if (body.quietStart !== undefined) updateData.quietStart = body.quietStart;
  if (body.quietEnd !== undefined) updateData.quietEnd = body.quietEnd;

  await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, ...updateData },
    update: updateData,
  });

  return NextResponse.json({ success: true });
}
