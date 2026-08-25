import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return JWT_SECRET;
}

const COOKIE_NAME = "eilaf_admin_session";
const TOKEN_TTL = "7d";

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_TTL,
  });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string" ||
      typeof decoded.name !== "string"
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

export function authenticateAdmin(
  email: string,
  password: string
): AdminPayload | null {
  const row = db
    .prepare(
      "SELECT id, email, name, password_hash FROM admins WHERE email = ?"
    )
    .get(email) as
    | {
        id: number;
        email: string;
        name: string;
        password_hash: string;
      }
    | undefined;

  if (!row) return null;

  const valid = bcrypt.compareSync(password, row.password_hash);

  if (!valid) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
  };
}

export async function getSessionCookie() {
  const store = await cookies();

  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setSessionCookie(token: string) {
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();

  store.delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const token = await getSessionCookie();

  if (!token) return null;

  return verifyToken(token);
}

export function changeAdminPassword(
  adminId: number,
  newPassword: string
) {
  const hash = bcrypt.hashSync(newPassword, 10);

  db.prepare(
    "UPDATE admins SET password_hash = ? WHERE id = ?"
  ).run(hash, adminId);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
