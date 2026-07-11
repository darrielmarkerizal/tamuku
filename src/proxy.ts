import { NextResponse, type NextRequest } from "next/server";
import { SESSION_CONFIG, verifySession } from "@/lib/auth/session";

const PUBLIC_PATHS = new Set(["/login", "/register", "/offline"]);
const ONBOARDING_PREFIX = "/onboarding";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_CONFIG.name)?.value;
  const session = await verifySession(token);
  const isAuthed = !!session;

  const isPublic = PUBLIC_PATHS.has(pathname);
  const isOnboarding = pathname.startsWith(ONBOARDING_PREFIX);

  if (!isAuthed && !isPublic && !isOnboarding) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthed && isPublic) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Cocokkan semua kecuali _next static, image, favicon, icon, manifest, sw, api
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|sw.js|api).*)",
  ],
};
