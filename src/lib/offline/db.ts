import Dexie, { type Table } from "dexie";
import type {
  OfflineJournalLog,
  OfflineMenstruationLog,
  OfflineProfile,
  OfflineTtdLog,
  OutboxEntry,
} from "./types";

// Semua tanggal disimpan ISO string di IndexedDB agar simpel & sortable.

export class TamukuOfflineDb extends Dexie {
  profile!: Table<OfflineProfile, string>;
  menstruation_logs!: Table<OfflineMenstruationLog, string>;
  ttd_logs!: Table<OfflineTtdLog, string>;
  journal_entries!: Table<OfflineJournalLog, string>;
  outbox!: Table<OutboxEntry, number>;

  constructor() {
    super("tamuku_offline");
    this.version(1).stores({
      profile: "id",
      menstruation_logs: "id, userId, start_date_iso",
      ttd_logs: "id, userId, log_date_iso",
      journal_entries: "id, userId, log_date_iso",
      outbox: "++localId, status, updatedAt",
    });
  }
}

// Singleton lazy-init — Dexie sensitif ke SSR, jadi hanya inisialisasi di browser
let _db: TamukuOfflineDb | null = null;

export function getOfflineDb(): TamukuOfflineDb {
  if (typeof window === "undefined") {
    throw new Error("getOfflineDb() hanya boleh dipanggil di client");
  }
  _db ??= new TamukuOfflineDb();
  return _db;
}
