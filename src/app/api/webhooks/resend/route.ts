import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { EmailEventType } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const eventTypeMap: Record<string, EmailEventType> = {
  "email.sent": EmailEventType.SENT,
  "email.delivered": EmailEventType.DELIVERED,
  "email.bounced": EmailEventType.BOUNCED,
  "email.complained": EmailEventType.COMPLAINED,
  "email.delivery_delayed": EmailEventType.DELIVERY_DELAYED,
};

export async function POST(request: Request) {
  const payload = await request.text();

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  const headers = {
    id: request.headers.get("svix-id") ?? request.headers.get("webhook-id") ?? "",
    timestamp: request.headers.get("svix-timestamp") ?? request.headers.get("webhook-timestamp") ?? "",
    signature: request.headers.get("svix-signature") ?? request.headers.get("webhook-signature") ?? "",
  };

  let event: {
    type: string;
    created_at?: string;
    data?: {
      email_id?: string;
      to?: string[];
    };
  };

  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    }) as typeof event;
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  const type =
    eventTypeMap[event.type] ?? EmailEventType.OTHER;

  const emailId = event.data?.email_id ?? null;
  const recipient = event.data?.to?.[0] ?? "unknown";

  await prisma.emailEvent.upsert({
    where: { eventId: headers.id },
    update: {},
    create: {
      eventId: headers.id,
      resendEmailId: emailId,
      type,
      recipient,
      payload: JSON.parse(payload),
      occurredAt: event.created_at
        ? new Date(event.created_at)
        : null,
    },
  });

  return NextResponse.json({ received: true });
}
