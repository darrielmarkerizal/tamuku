import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tamuku — Teman Haid & TTD",
  description:
    "Pelacak siklus haid dan Tablet Tambah Darah untuk siswi SMP. Hangat, ramah, offline-first.",
  applicationName: "Tamuku",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Tamuku",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff3d8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${archivoNarrow.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
