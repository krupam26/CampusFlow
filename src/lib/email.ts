import { Resend } from "resend";
import { render } from "@react-email/render";
import TransactionNotification from "@/emails/transaction-notification";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function sendTransactionEmail(input: {
  to: string;
  name: string;
  description: string;
  amount: string;
  reference: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_your_api_key") {
    console.warn("RESEND_API_KEY is not configured or using default placeholder. Skipping email send.");
    return {
      data: null,
      error: {
        message: "RESEND_API_KEY is not configured.",
        name: "configuration_error",
      },
    };
  }

  const html = await render(
    TransactionNotification({
      name: input.name,
      description: input.description,
      amount: input.amount,
      reference: input.reference,
    }),
  );

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "CampusFlow <onboarding@resend.dev>",
    to: input.to,
    subject: "Your CampusFlow transaction",
    html,
  });
}
