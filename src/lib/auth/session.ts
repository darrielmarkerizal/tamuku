import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_COOKIE = "tamuku_session";
const ALG = "HS256";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): Uint8Array {
  const secret = process.env.APP_SECRET;
  if (!secret) {
    throw new Error("APP_SECRET env belum diset");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
}

export async function signSession(payload: {
  userId: string;
  username: string;
}): Promise<string> {
  return new SignJWT({ userId: payload.userId, username: payload.username })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.username !== "string"
    ) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_CONFIG = {
  name: SESSION_COOKIE,
  maxAge: MAX_AGE_SECONDS,
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};
