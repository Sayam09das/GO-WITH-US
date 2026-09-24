import argon2 from "argon2";

const ARGON2_OPTIONS: argon2.Options & { type: typeof argon2.argon2id } = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}

export function assertPasswordPolicy(password: string): void {
  if (password.length < 8 || password.length > 128) {
    throw new AuthValidationError("Password must be between 8 and 128 characters.");
  }

  if (password.trim().length !== password.length) {
    throw new AuthValidationError("Password cannot start or end with whitespace.");
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new AuthValidationError("Password must include at least one letter and one number.");
  }
}

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthValidationError";
  }
}
