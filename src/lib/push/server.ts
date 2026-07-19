import webpush from "web-push";
import { db } from "@/lib/db";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT ?? "mailto:hello@tamuku.id";
  if (!pub || !priv) {
    throw new Error("VAPID keys belum diset");
  }
  webpush.setVapidDetails(sub, pub, priv);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  ensureConfigured();
  const subs = await db.pushSubscription.findMany({
    where: { userId },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });

  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        },
        JSON.stringify(payload)
      );
      sent++;
    } catch (err: unknown) {
      const statusCode =
        typeof err === "object" && err && "statusCode" in err
          ? (err as { statusCode: number }).statusCode
          : 0;
      if (statusCode === 404 || statusCode === 410) {
        await db.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
      } else {
        console.error("push send failed", err);
      }
    }
  }
  return { sent, total: subs.length };
}
