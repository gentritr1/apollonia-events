import { Resend } from "resend";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { skipped: true; ok: false; reason: string }
  | { skipped: false; ok: true; id: string | null }
  | { skipped: false; ok: false; error: unknown };

let resendClient: Resend | null = null;
let resendApiKey: string | null = null;

function getResendClient(apiKey: string) {
  if (!resendClient || resendApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    resendApiKey = apiKey;
  }

  return resendClient;
}

function hasRecipient(to: string | string[]) {
  if (Array.isArray(to)) {
    return to.some((recipient) => recipient.trim().length > 0);
  }

  return to.trim().length > 0;
}

export function getAdminNotifyEmail() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "";
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const trimmedReplyTo = replyTo?.trim();

  if (!apiKey || !from) {
    console.warn("Email skipped: RESEND_API_KEY or EMAIL_FROM is not configured.");
    return { skipped: true, ok: false, reason: "missing-email-config" };
  }

  if (!hasRecipient(to)) {
    console.warn("Email skipped: no recipient was configured.");
    return { skipped: true, ok: false, reason: "missing-recipient" };
  }

  try {
    const result = await getResendClient(apiKey).emails.send({
      from,
      to,
      subject,
      html,
      ...(trimmedReplyTo ? { replyTo: trimmedReplyTo } : {}),
    });

    if (result.error) {
      console.error("Email send failed:", result.error);
      return { skipped: false, ok: false, error: result.error };
    }

    return { skipped: false, ok: true, id: result.data?.id ?? null };
  } catch (error) {
    console.error("Email send failed:", error);
    return { skipped: false, ok: false, error };
  }
}
