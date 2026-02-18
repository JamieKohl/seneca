import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type");

  if (type === "scams") {
    const reports = await prisma.scamReport.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const csv = [
      "Type,Risk Score,Risk Level,Category,Action,Date",
      ...reports.map(
        (r) =>
          `${r.type},${r.riskScore},${r.riskLevel},${r.category ?? ""},${r.action ?? ""},${r.createdAt.toISOString().split("T")[0]}`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=scam-reports.csv",
      },
    });
  }

  if (type === "subscriptions") {
    const subs = await prisma.trackedSubscription.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    const csv = [
      "Name,Cost,Billing Cycle,Status,Category,Renewal Date",
      ...subs.map(
        (s) =>
          `"${s.name}",${s.cost},${s.billingCycle},${s.status},${s.category ?? ""},${s.renewalDate?.toISOString().split("T")[0] ?? ""}`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=subscriptions.csv",
      },
    });
  }

  if (type === "privacy") {
    const brokers = await prisma.dataBroker.findMany({
      where: { userId: session.user.id },
      orderBy: { brokerName: "asc" },
    });

    const csv = [
      "Broker,Status,Submitted,Confirmed,Last Checked",
      ...brokers.map(
        (b) =>
          `"${b.brokerName}",${b.status},${b.submittedDate?.toISOString().split("T")[0] ?? ""},${b.confirmedDate?.toISOString().split("T")[0] ?? ""},${b.lastChecked?.toISOString().split("T")[0] ?? ""}`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=data-brokers.csv",
      },
    });
  }

  return NextResponse.json({ error: "Invalid export type. Use: scams, subscriptions, or privacy" }, { status: 400 });
}
