"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#fff0f5",
          color: "#1a0a14",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px", textAlign: "center" }}>
          <div
            style={{
              background: "#ffd66b",
              border: "2px solid #1a0a14",
              borderRadius: "16px",
              boxShadow: "6px 6px 0 0 #1a0a14",
              padding: "28px 20px",
              marginBottom: "28px",
            }}
          >
            <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Hemo">
              <circle cx="60" cy="62" r="44" fill="#ffd1e3" stroke="#1a0a14" strokeWidth="3.5" />
              <circle cx="46" cy="44" r="7" fill="#ffe4ec" opacity="0.7" />
              <path d="M40 56 Q46 62 52 56" stroke="#1a0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M68 56 Q74 62 80 56" stroke="#1a0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M46 80 Q60 76 74 80" stroke="#1a0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            Tamuku berhenti sebentar
          </h1>
          <p style={{ fontSize: "16px", color: "#6b3a4c", margin: "0 0 28px", lineHeight: 1.6 }}>
            Coba buka ulang. Catatan yang sudah tersimpan tetap aman.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              width: "100%",
              height: "56px",
              background: "#ff3d8a",
              color: "#ffffff",
              border: "2px solid #1a0a14",
              borderRadius: "8px",
              boxShadow: "4px 4px 0 0 #1a0a14",
              fontSize: "16px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
