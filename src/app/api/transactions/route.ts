import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/authorization";
import { sendTransactionEmail } from "@/lib/email";
import { z } from "zod";

const transactionSchema = z.object({
  description: z.string().trim().min(1).max(200),
  amount: z.number().positive().max(1_000_000),
  currency: z.string().length(3).default("INR"),
});

export async function GET() {
  try {
    const user = await requireUser();

    if (!user.organizationId) {
      return NextResponse.json(
        { error: "No organization assigned" },
        { status: 403 },
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId: user.organizationId,
        ...(user.role === Role.ADMIN
          ? {}
          : { userId: user.id }),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.error("Transaction GET failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user.organizationId) {
      return NextResponse.json(
        { error: "No organization assigned" },
        { status: 403 },
      );
    }

    const parsed = transactionSchema.safeParse(
      await request.json(),
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const transaction = await prisma.$transaction(
      async (tx) => {
        const created = await tx.transaction.create({
          data: {
            reference: `CF-${crypto.randomUUID()}`,
            description: parsed.data.description,
            amount: parsed.data.amount,
            currency: parsed.data.currency,
            userId: user.id,
            organizationId: user.organizationId!,
          },
        });

        await tx.auditLog.create({
          data: {
            action: "TRANSACTION_CREATED",
            entity: "Transaction",
            entityId: created.id,
            organizationId: user.organizationId!,
            actorId: user.id,
            details: {
              reference: created.reference,
              amount: parsed.data.amount,
            },
          },
        });

        return created;
      },
    );

    if (user.email) {
      try {
        await sendTransactionEmail({
          to: user.email,
          name: user.name || "User",
          description: transaction.description,
          amount: `${transaction.currency} ${transaction.amount}`,
          reference: transaction.reference,
        });
      } catch (emailErr) {
        console.error("Failed to send transaction email notification:", emailErr);
      }
    }

    return NextResponse.json(
      { transaction },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.error("Transaction POST failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
