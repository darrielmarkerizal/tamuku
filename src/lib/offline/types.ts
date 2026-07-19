export type OpType =
  | "logPeriodStart"
  | "logPeriodEnd"
  | "manualLogPeriod"
  | "logTtd"
  | "addStock"
  | "correctStock"
  | "upsertJournal";

export interface OpBase {
  type: OpType;
  idempotencyKey: string;
  createdAt: number; // ms epoch
}

export type Operation =
  | (OpBase & { type: "logPeriodStart" })
  | (OpBase & { type: "logPeriodEnd" })
  | (OpBase & {
      type: "manualLogPeriod";
      startIso: string;
      endIso: string | null;
    })
  | (OpBase & { type: "logTtd" })
  | (OpBase & { type: "addStock"; pills: number; note: string })
  | (OpBase & { type: "correctStock"; new_value: number; note: string })
  | (OpBase & {
      type: "upsertJournal";
      logDateIso: string;
      mood: string | null;
      symptoms: string[];
      notes: string;
    });

export type OutboxStatus = "pending" | "syncing" | "failed";

export interface OutboxEntry {
  localId?: number;
  op: Operation;
  status: OutboxStatus;
  attempts: number;
  lastError?: string;
  updatedAt: number;
}

export interface OfflineMenstruationLog {
  id: string;
  userId: string;
  start_date_iso: string;
  end_date_iso: string | null;
}

export interface OfflineTtdLog {
  id: string;
  userId: string;
  log_date_iso: string;
  status: "WEEKLY_ROUTINE" | "MENSTRUATION_ROUTINE";
}

export interface OfflineJournalLog {
  id: string;
  userId: string;
  log_date_iso: string;
  mood: string | null;
  symptoms: string[];
  notes: string | null;
}

export interface OfflineProfile {
  id: string;
  username: string;
  name: string | null;
  inventory_ttd: number;
  streak_current: number;
  seen_flashcards: string[];
}
