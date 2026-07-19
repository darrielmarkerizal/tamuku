import { makeOp, submitOp } from "./sync-client";
import type { Operation } from "./types";

export async function trySubmit<T extends Operation["type"]>(
  onlinePath: () => Promise<
    { ok: true; data?: unknown } | { ok: false; error: string }
  >,
  opType: T,
  opPayload: Omit<
    Extract<Operation, { type: T }>,
    "type" | "idempotencyKey" | "createdAt"
  >
): Promise<
  | { ok: true; queued: false; data?: unknown }
  | { ok: true; queued: true }
  | { ok: false; error: string }
> {
  const isOnline = typeof navigator === "undefined" || navigator.onLine;

  if (isOnline) {
    try {
      const res = await onlinePath();
      if (res.ok) {
        return { ok: true, queued: false, data: res.data };
      }

      return { ok: false, error: res.error };
    } catch (err) {
      console.warn(`${opType} online failed, fallback to outbox:`, err);
    }
  }

  const op = makeOp(opType, opPayload);
  const res = await submitOp(op);
  if (res.ok) return { ok: true, queued: true };
  return { ok: false, error: "Gagal simpan, coba lagi." };
}
