export interface AppCopy {
  statusEyebrow: string;
  periodDayHeadline: (day: number) => string;
  idleHeadline: string;

  periodStartLabel: string;
  periodEndLabel: string;
  periodStartHint: string;

  ttdEyebrow: string;
  ttdButtonLabel: string;
  ttdModeMenstruating: string;
  ttdModeWeekly: string;

  periodCellClass: string;

  periodCellTextClass: string;

  predictionCellClass: string;
  calendarPeriodLabel: string;
  calendarPredictionLabel: string;
  calendarLogCta: string;

  pushDailyTitle: string;
  pushDailyBody: string;
  pushWeeklyTitle: string;
  pushWeeklyBody: string;

  greetingMenstruating: string[];
}

const NORMAL: AppCopy = {
  statusEyebrow: "STATUS HARI INI",
  periodDayHeadline: (day) => `HARI KE-${day} HAID KAMU`,
  idleHeadline: "SEHAT & AMAN HARI INI",

  periodStartLabel: "TANDAI HAID DIMULAI",
  periodEndLabel: "TANDAI HAID SELESAI",
  periodStartHint: "Klik saat haid dimulai",

  ttdEyebrow: "TTD HARI INI",
  ttdButtonLabel: "SUDAH MINUM TTD HARI INI",
  ttdModeMenstruating: "Mode harian — kamu sedang haid.",
  ttdModeWeekly: "Mode mingguan — jangan lupa Jumat.",

  periodCellClass: "bg-period",
  periodCellTextClass: "text-white",
  predictionCellClass: "bg-prediction",
  calendarPeriodLabel: "Haid tercatat",
  calendarPredictionLabel: "Prediksi haid",
  calendarLogCta: "CATAT HAID MANUAL",

  pushDailyTitle: "Saatnya minum TTD hari ini",
  pushDailyBody: "Kamu lagi haid — dosis harian bantu jaga stamina.",
  pushWeeklyTitle: "Waktunya minum TTD mingguan",
  pushWeeklyBody: "Cek dashboard dan tandai sudah minum ya.",

  greetingMenstruating: [
    "Lagi haid — TTD tiap hari biar nggak lemas.",
    "Badan lagi kerja keras. Bantu pakai TTD ya.",
    "Hari-hari ini TTD-nya harian, bukan mingguan.",
    "Jangan skip TTD, ini justru waktunya.",
    "Minum TTD hari ini biar nggak gampang pusing.",
  ],
};

const DISCREET: AppCopy = {
  statusEyebrow: "HARI INI",
  periodDayHeadline: (day) => `HARI KE-${day} SIKLUS`,
  idleHeadline: "SEMUA AMAN HARI INI",

  periodStartLabel: "TANDAI SIKLUS DIMULAI",
  periodEndLabel: "TANDAI SIKLUS SELESAI",
  periodStartHint: "Klik saat siklus dimulai",

  ttdEyebrow: "VITAMIN HARI INI",
  ttdButtonLabel: "SUDAH MINUM VITAMIN",
  ttdModeMenstruating: "Mode harian.",
  ttdModeWeekly: "Mode mingguan — jangan lupa Jumat.",

  periodCellClass: "bg-accent-peach",
  periodCellTextClass: "text-ink",
  predictionCellClass: "bg-pink-soft",
  calendarPeriodLabel: "Tercatat",
  calendarPredictionLabel: "Perkiraan",
  calendarLogCta: "CATAT SIKLUS MANUAL",

  pushDailyTitle: "Waktunya vitamin",
  pushDailyBody: "Pengingat harian kamu.",
  pushWeeklyTitle: "Waktunya vitamin",
  pushWeeklyBody: "Pengingat mingguan kamu.",

  greetingMenstruating: [
    "Jadwal vitamin lagi harian minggu ini.",
    "Jangan lupa vitamin hari ini ya.",
    "Hari-hari ini pengingatnya tiap hari.",
    "Vitamin harian dulu, baru lanjut.",
    "Satu vitamin hari ini, biar nggak lemas.",
  ],
};

export function getCopy(discreet: boolean): AppCopy {
  return discreet ? DISCREET : NORMAL;
}
