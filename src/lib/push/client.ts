function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function subscribePush(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  if (typeof window === "undefined") return { ok: false, error: "no_window" };
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, error: "Push tidak didukung browser ini." };
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublic) return { ok: false, error: "VAPID belum diset" };

  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    return { ok: false, error: "Notifikasi ditolak." };
  }

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const sub =
    existing ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublic)
        .buffer as ArrayBuffer,
    }));

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
  if (!res.ok) {
    return { ok: false, error: "Gagal register di server." };
  }
  return { ok: true };
}

export async function unsubscribePush(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  await sub.unsubscribe().catch(() => {});
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  }).catch(() => {});
}

export async function currentSubscriptionStatus(): Promise<
  "granted" | "denied" | "default" | "unsupported"
> {
  if (typeof window === "undefined" || !("Notification" in window))
    return "unsupported";
  return Notification.permission;
}
