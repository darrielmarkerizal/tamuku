# 03 — Auth & Onboarding

## Halaman
- `/login` — username + password.
- `/register` — username, nama, sekolah, kelas, password.
- `/onboarding` — wizard 4 langkah, ditampilkan setelah register pertama kali.

## `/login`
- Form sederhana: username, password.
- Tombol "Lupa password" → form reset via email (jika email terdaftar). Jika tidak, tampilkan pesan minta menghubungi developer.
- Bahasa: Indonesia santai, hindari istilah medis.
- Setelah login: redirect ke `/dashboard` jika `consent.acceptedAt` ada, ke `/onboarding` jika belum.

## `/register`
- Validasi Zod: username 4–20 huruf/angka, password ≥ 8 karakter.
- Setelah submit: auto sign-in → `/onboarding`.
- **Consent ringkas** di bawah tombol daftar: "Data haid kamu disimpan pribadi dan tidak dibagikan ke siapa pun." Disertai checkbox `guardianAware`: "Aku sudah memberi tahu orang tua/wali bahwa aku pakai aplikasi ini."

## `/onboarding` — 4 Langkah
1. **Kenalan maskot** — tampilkan karakter sel darah, jelaskan akan menemani.
2. **Tanggal haid terakhir** *(opsional)* — kalender single date picker. Jika diisi, jadi seed untuk SMA. Jika di-skip, prediksi pakai default 28 hari sampai siklus pertama tercatat.
3. **Jumlah TTD yang dimiliki sekarang** — input angka, default 4 (1 strip).
4. **Pengingat** — pilih hari pengingat mingguan default (mis. Jumat) dan jam (mis. 19:00). Minta izin notifikasi browser di sini.

Setelah selesai: `consent.acceptedAt` dan `consent.guardianAware` diisi, redirect `/dashboard`.

## Aturan UX
- Tidak ada captcha — audience SMP, friction tinggi.
- Email verifikasi opsional, tidak diwajibkan untuk pemakaian dasar.
- Onboarding bisa di-skip per langkah kecuali #4 (izin notifikasi opsional tapi disarankan).

## Komponen
- `AuthCard`, `OnboardingStepper`, `MascotIntro`, `DatePickerSingle`.

## Server Actions
- `signUp({ username, name, password, school, classroom })`
- `signIn({ username, password })`
- `completeOnboarding({ lastPeriodStart?, pillsInHand, reminderDay, reminderTime, guardianAware })`

## Catatan Privasi
- Password disimpan dengan `bcrypt` cost 12.
- Session: JWT httpOnly, sameSite=lax, 7 hari.
- Auto-logout setelah 30 hari tidak aktif.
- Mode "private device" vs "shared" tidak ditangani di MVP — dokumentasikan untuk fase berikutnya.
