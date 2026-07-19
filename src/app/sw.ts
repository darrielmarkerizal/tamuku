import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload: {
    title: string;
    body: string;
    url?: string;
    tag?: string;
  };
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Tamuku", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      badge: "/icon.svg",
      icon: "/icon.svg",
      data: { url: payload.url ?? "/dashboard" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification.data as { url?: string } | null)?.url ?? "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.endsWith(url) && "focus" in client) {
          return (client as WindowClient).focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
