import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateSecureToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function safeCompareToken(raw: string, hash: string): boolean {
  const candidate = hashToken(raw);
  const left = Buffer.from(candidate, "hex");
  const right = Buffer.from(hash, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, 1);
  return `${visible}***@${domain}`;
}
