"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authorization";
import { sendTransactionEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  description: z.string().trim().min(1).max(200),
  amount: z.coerce.number().positive().max(1_000_000),
});

export async function createTransaction(
  formData: FormData,
) {
  const user = await requireUser();

  if (!user.organizationId) {
    return {
      success: false,
      message: "You are not assigned to an organization.",
    };
  }

  const parsed = schema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the transaction details.",
    };
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.transaction.create({
      data: {
        reference: `CF-${crypto.randomUUID()}`,
        description: parsed.data.description,
        amount: parsed.data.amount,
        currency: "INR",
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
  });

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

  return {
    success: true,
    message: "Transaction created successfully.",
  };
}
