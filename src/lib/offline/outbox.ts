import { getOfflineDb } from "./db";
import type { Operation, OutboxEntry } from "./types";

const MAX_ATTEMPTS = 5;

const BACKOFF_MS = [1_000, 5_000, 30_000, 120_000, 600_000];

export async function enqueue(op: Operation): Promise<number> {
  const db = getOfflineDb();
  const now = Date.now();
  return db.outbox.add({
    op,
    status: "pending",
    attempts: 0,
    updatedAt: now,
  });
}

export async function getPending(): Promise<OutboxEntry[]> {
  const db = getOfflineDb();
  return db.outbox
    .where("status")
    .anyOf("pending", "syncing")
    .sortBy("updatedAt");
}

export async function getFailed(): Promise<OutboxEntry[]> {
  const db = getOfflineDb();
  return db.outbox.where("status").equals("failed").sortBy("updatedAt");
}

export async function markSyncing(localId: number) {
  const db = getOfflineDb();
  await db.outbox.update(localId, {
    status: "syncing",
    updatedAt: Date.now(),
  });
}

export async function markFailed(localId: number, err: string) {
  const db = getOfflineDb();
  const entry = await db.outbox.get(localId);
  if (!entry) return;
  const attempts = entry.attempts + 1;
  const isFinal = attempts >= MAX_ATTEMPTS;
  await db.outbox.update(localId, {
    status: isFinal ? "failed" : "pending",
    attempts,
    lastError: err,
    updatedAt: Date.now(),
  });
}

export async function removeEntry(localId: number) {
  const db = getOfflineDb();
  await db.outbox.delete(localId);
}

export async function retryEntry(localId: number) {
  const db = getOfflineDb();
  await db.outbox.update(localId, {
    status: "pending",
    attempts: 0,
    lastError: undefined,
    updatedAt: Date.now(),
  });
}

export function backoffFor(attempts: number): number {
  const idx = Math.min(attempts, BACKOFF_MS.length - 1);
  return BACKOFF_MS[idx];
}
