import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_CONFIG } from "@/lib/auth/session";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.name);
  return NextResponse.redirect(new URL("/login", request.url));
}
