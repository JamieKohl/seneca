import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [scamReports, subscriptions, dataBrokers, recentAlerts] = await Promise.all([
    prisma.scamReport.findMany({
      where: { userId },
    }),
    prisma.trackedSubscription.findMany({
      where: { userId },
    }),
    prisma.dataBroker.findMany({
      where: { userId },
    }),
    prisma.alertLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const scamsBlocked = scamReports.filter((r) => r.riskScore >= 60).length;
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
  const cancelledSubscriptions = subscriptions.filter((s) => s.status === "cancelled");
  const monthlySpend = activeSubscriptions.reduce((sum, s) => {
    if (s.billingCycle === "yearly") return sum + s.cost / 12;
    if (s.billingCycle === "weekly") return sum + s.cost * 4.33;
    return sum + s.cost;
  }, 0);
  const moneySaved = cancelledSubscriptions.reduce((sum, s) => {
    if (s.billingCycle === "yearly") return sum + s.cost / 12;
    if (s.billingCycle === "weekly") return sum + s.cost * 4.33;
    return sum + s.cost;
  }, 0);
  const brokersOptedOut = dataBrokers.filter(
    (b) => b.status === "confirmed" || b.status === "submitted"
  ).length;

  // Calculate protection score
  const scamScore = scamReports.length > 0 ? 90 : 50;
  const subScore = activeSubscriptions.length > 0 ? 75 : 50;
  const privacyScore = dataBrokers.length > 0
    ? Math.round((brokersOptedOut / dataBrokers.length) * 100)
    : 50;
  const priceScore = 70;
  const protectionScore = Math.round((scamScore + subScore + privacyScore + priceScore) / 4);

  return NextResponse.json({
    protectionScore,
    scamsBlocked,
    moneySaved: Math.round(moneySaved * 100) / 100,
    brokersOptedOut,
    activeSubscriptions: activeSubscriptions.length,
    monthlySpend: Math.round(monthlySpend * 100) / 100,
    recentAlerts,
  });
}
