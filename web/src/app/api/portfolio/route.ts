import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const addHoldingSchema = z.object({
  symbol: z.string().min(1).max(10).transform((s) => s.toUpperCase()),
  quantity: z.number().positive(),
  avgCostBasis: z.number().positive(),
  purchaseDate: z.string().transform((s) => new Date(s)),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const holdings = await prisma.holding.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ holdings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = addHoldingSchema.parse(body);

    const holding = await prisma.holding.create({
      data: {
        userId: session.user.id,
        ...data,
      },
    });

    // Create initial transaction record
    await prisma.transaction.create({
      data: {
        holdingId: holding.id,
        type: "BUY",
        quantity: data.quantity,
        price: data.avgCostBasis,
        date: data.purchaseDate,
      },
    });

    return NextResponse.json(holding, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add holding" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Holding ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const holding = await prisma.holding.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    await prisma.holding.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete holding" },
      { status: 500 }
    );
  }
}
