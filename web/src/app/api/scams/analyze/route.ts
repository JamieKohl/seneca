import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.scamReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const parsed = reports.map((r) => ({
    ...r,
    redFlags: r.redFlags ? JSON.parse(r.redFlags) : [],
  }));

  return NextResponse.json(parsed);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, sender, content } = body;

  if (!type || !content) {
    return NextResponse.json({ error: "Type and content are required" }, { status: 400 });
  }

  // Call AI service for analysis
  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  let analysis;

  try {
    const aiRes = await fetch(`${aiServiceUrl}/analyze/scam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, sender, content }),
    });

    if (aiRes.ok) {
      analysis = await aiRes.json();
    }
  } catch {
    // AI service unavailable, use fallback analysis
  }

  // Fallback analysis if AI service is unavailable
  if (!analysis) {
    const redFlags: string[] = [];
    const contentLower = content.toLowerCase();

    if (contentLower.includes("urgent") || contentLower.includes("immediately"))
      redFlags.push("Creates false urgency");
    if (contentLower.includes("click") || contentLower.includes("link"))
      redFlags.push("Contains suspicious links");
    if (contentLower.includes("verify") || contentLower.includes("confirm"))
      redFlags.push("Requests account verification");
    if (contentLower.includes("password") || contentLower.includes("ssn") || contentLower.includes("social security"))
      redFlags.push("Asks for sensitive information");
    if (contentLower.includes("won") || contentLower.includes("prize") || contentLower.includes("lottery"))
      redFlags.push("Promises unexpected prizes or winnings");
    if (contentLower.includes("irs") || contentLower.includes("government"))
      redFlags.push("Impersonates a government agency");
    if (contentLower.includes("suspended") || contentLower.includes("locked"))
      redFlags.push("Claims account is suspended/locked");
    if (sender && sender.includes("+") && sender.length > 12)
      redFlags.push("Suspicious international phone number");

    const riskScore = Math.min(100, redFlags.length * 20 + 15);
    const riskLevel = riskScore >= 80 ? "critical" : riskScore >= 60 ? "high" : riskScore >= 30 ? "medium" : "low";

    let category = "other";
    if (contentLower.includes("bank") || contentLower.includes("account") || contentLower.includes("verify"))
      category = "phishing";
    else if (contentLower.includes("irs") || contentLower.includes("government") || contentLower.includes("police"))
      category = "impersonation";
    else if (contentLower.includes("won") || contentLower.includes("lottery") || contentLower.includes("prize"))
      category = "lottery";
    else if (contentLower.includes("invest") || contentLower.includes("crypto") || contentLower.includes("bitcoin"))
      category = "investment";

    const recommendedAction = riskScore >= 60 ? "block" : riskScore >= 30 ? "report" : "ignore";

    analysis = {
      riskScore,
      riskLevel,
      category,
      redFlags,
      analysis: `This ${type} ${riskLevel === "low" ? "appears relatively safe" : `shows ${redFlags.length} red flag(s) commonly associated with ${category} scams`}. ${redFlags.length > 0 ? `Key concerns: ${redFlags.join(", ")}.` : "No major red flags detected."} Recommended action: ${recommendedAction}.`,
      recommendedAction,
    };
  }

  // Save to database
  const report = await prisma.scamReport.create({
    data: {
      userId: session.user.id,
      type,
      content,
      sender: sender || null,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      category: analysis.category,
      redFlags: JSON.stringify(analysis.redFlags),
      aiAnalysis: analysis.analysis,
      action: analysis.recommendedAction,
    },
  });

  // Create alert log
  await prisma.alertLog.create({
    data: {
      userId: session.user.id,
      type: "scam",
      title: `${analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk ${type} Analyzed`,
      body: `Risk score: ${analysis.riskScore}/100. ${analysis.redFlags.length} red flag(s) found. Category: ${analysis.category}.`,
      actionable: analysis.riskScore >= 60,
      actionUrl: "/scams",
    },
  });

  return NextResponse.json({
    id: report.id,
    ...analysis,
  });
}
