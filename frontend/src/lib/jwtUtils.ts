import type { UserRole } from "@/types/auth";

function normalizeRole(value: unknown): UserRole {
  return value === "ADMIN" ? "ADMIN" : "USER";
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): UserRole {
  const payload = parseJwtPayload(token);
  return normalizeRole(payload?.role);
}
