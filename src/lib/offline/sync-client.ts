import { getOfflineDb } from "./db";
import {
  enqueue,
  getPending,
  markFailed,
  markSyncing,
  removeEntry,
} from "./outbox";
import type {
  OfflineJournalLog,
  OfflineMenstruationLog,
  OfflineProfile,
  OfflineTtdLog,
  Operation,
} from "./types";

export async function submitOp(op: Operation): Promise<
  | { ok: true; local: true }
  | { ok: true; local: false; data?: unknown }
  | { ok: false; error: string }
> {
  await enqueue(op);
  if (typeof navigator === "undefined" || navigator.onLine) {
    return flushOutbox();
  }
  return { ok: true, local: true };
}

export async function flushOutbox(): Promise<
  | { ok: true; local: false; data?: unknown }
  | { ok: true; local: true }
  | { ok: false; error: string }
> {
  const pending = await getPending();
  if (pending.length === 0) return { ok: true, local: true };

  const ops = pending
    .filter((e) => e.status === "pending")
    .map((e) => e.op);
  if (ops.length === 0) return { ok: true, local: true };

  for (const e of pending) {
    if (e.localId !== undefined) await markSyncing(e.localId);
  }

  let response: Response;
  try {
    response = await fetch("/api/sync/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ops }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "network_error";
    for (const e of pending) {
      if (e.localId !== undefined) await markFailed(e.localId, msg);
    }
    return { ok: false, error: msg };
  }

  if (!response.ok) {
    const msg = `http_${response.status}`;
    for (const e of pending) {
      if (e.localId !== undefined) await markFailed(e.localId, msg);
    }
    return { ok: false, error: msg };
  }

  const body = (await response.json().catch(() => null)) as {
    results?: {
      idempotencyKey: string;
      status: "ok" | "duplicate" | "error";
      error?: string;
      data?: unknown;
    }[];
  } | null;

  if (!body?.results) {
    return { ok: false, error: "invalid_response" };
  }

  let lastData: unknown = undefined;
  for (const entry of pending) {
    if (entry.localId === undefined) continue;
    const result = body.results.find(
      (r) => r.idempotencyKey === entry.op.idempotencyKey
    );
    if (!result) {
      await markFailed(entry.localId, "no_result");
      continue;
    }
    if (result.status === "ok" || result.status === "duplicate") {
      await removeEntry(entry.localId);
      if (result.status === "ok") lastData = result.data;
    } else {
      await markFailed(entry.localId, result.error ?? "unknown");
    }
  }

  return { ok: true, local: false, data: lastData };
}

export async function hydrate() {
  const response = await fetch("/api/sync/snapshot");
  if (!response.ok) throw new Error(`snapshot_${response.status}`);
  const body = (await response.json()) as {
    profile: OfflineProfile;
    menstruation_logs: OfflineMenstruationLog[];
    ttd_logs: OfflineTtdLog[];
    journal_entries: OfflineJournalLog[];
  };
  const db = getOfflineDb();
  await db.transaction(
    "rw",
    [db.profile, db.menstruation_logs, db.ttd_logs, db.journal_entries],
    async () => {
      await db.profile.clear();
      await db.menstruation_logs.clear();
      await db.ttd_logs.clear();
      await db.journal_entries.clear();
      if (body.profile) await db.profile.put(body.profile);
      if (body.menstruation_logs.length > 0)
        await db.menstruation_logs.bulkAdd(body.menstruation_logs);
      if (body.ttd_logs.length > 0)
        await db.ttd_logs.bulkAdd(body.ttd_logs);
      if (body.journal_entries.length > 0)
        await db.journal_entries.bulkAdd(body.journal_entries);
    }
  );
}

type BaseFields = "type" | "idempotencyKey" | "createdAt";

export function makeOp<T extends Operation["type"]>(
  type: T,
  payload: Omit<Extract<Operation, { type: T }>, BaseFields> = {} as Omit<
    Extract<Operation, { type: T }>,
    BaseFields
  >
): Extract<Operation, { type: T }> {
  return {
    ...payload,
    type,
    idempotencyKey: crypto.randomUUID(),
    createdAt: Date.now(),
  } as Extract<Operation, { type: T }>;
}
