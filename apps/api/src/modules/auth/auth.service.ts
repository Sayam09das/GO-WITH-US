import { env } from "../../config/env.js";
import {
  enqueuePasswordResetEmail,
  enqueueVerificationEmail,
} from "../../infrastructure/queue/enqueue.js";
import { AppError } from "../../lib/errors.js";
import {
  AuthValidationError,
  assertPasswordPolicy,
  hashPassword,
  verifyPassword,
} from "../../lib/passwords.js";
import { generateSecureToken, hashToken, maskEmail, safeCompareToken } from "../../lib/tokens.js";
import { authRepository } from "./auth.repository.js";
import type { PublicUser, SessionSummary } from "./auth.types.js";
import { toPublicUser } from "./auth.types.js";

const GENERIC_AUTH_ERROR = "Invalid email or password.";
const GENERIC_RESET_MESSAGE =
  "If an account exists with this email, we've sent a password reset link.";
const GENERIC_VERIFICATION_MESSAGE =
  "If an account exists with this email, we've sent a verification link.";

type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

export const authService = {
  async register(
    input: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    meta: RequestMeta,
  ) {
    assertPasswordPolicy(input.password);

    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new AppError(409, "CONFLICT", "An account with this email already exists.");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email: input.email,
      fullName: input.fullName,
      passwordHash,
    });

    const verifyByEmail = env.isProduction || env.smtpHost.length > 0;
    const verifiedUser = verifyByEmail ? user : await authRepository.markEmailVerified(user.id);

    if (verifyByEmail) {
      await this.issueEmailVerification(
        verifiedUser.id,
        verifiedUser.email,
        verifiedUser.fullName,
        meta,
      );
    }
    await authRepository.createSecurityEvent({
      userId: user.id,
      type: "REGISTER",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      user: toPublicUser(verifiedUser),
      maskedEmail: maskEmail(verifiedUser.email),
    };
  },

  async issueEmailVerification(userId: string, email: string, fullName: string, meta: RequestMeta) {
    await authRepository.invalidateEmailVerificationTokens(userId);
    const { raw, hash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await authRepository.createEmailVerificationToken(userId, hash, expiresAt);
    await enqueueVerificationEmail({ type: "verification", email, fullName, token: raw });
    await authRepository.createSecurityEvent({
      userId,
      type: "EMAIL_VERIFICATION_SENT",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  },

  async verifyEmail(rawToken: string, meta: RequestMeta): Promise<PublicUser> {
    const token = await authRepository.findEmailVerificationToken(hashToken(rawToken));

    if (!token || token.usedAt || token.expiresAt <= new Date()) {
      throw new AppError(400, "INVALID_TOKEN", "This verification link is invalid or has expired.");
    }

    await authRepository.markEmailVerificationTokenUsed(token.id);
    await authRepository.invalidateEmailVerificationTokens(token.userId);
    const user = await authRepository.markEmailVerified(token.userId);

    await authRepository.createSecurityEvent({
      userId: user.id,
      type: "EMAIL_VERIFIED",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return toPublicUser(user);
  },

  async resendVerification(email: string, meta: RequestMeta) {
    const user = await authRepository.findUserByEmail(email);

    if (user && !user.emailVerified) {
      await this.issueEmailVerification(user.id, user.email, user.fullName, meta);
    }

    return { message: GENERIC_VERIFICATION_MESSAGE };
  },

  async login(input: { email: string; password: string; rememberMe?: boolean }, meta: RequestMeta) {
    const user = await authRepository.findUserByEmail(input.email);
    const passwordValid =
      user !== null ? await verifyPassword(input.password, user.passwordHash) : false;

    if (!user || !passwordValid) {
      await authRepository.createSecurityEvent({
        type: "LOGIN_FAILED",
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        metadata: { email: input.email.toLowerCase() },
      });
      throw new AppError(401, "UNAUTHENTICATED", GENERIC_AUTH_ERROR);
    }

    if (!user.emailVerified) {
      throw new AppError(
        403,
        "EMAIL_NOT_VERIFIED",
        "Email not verified. Please check your inbox for a verification link.",
      );
    }

    const session = await this.createSession(user.id, input.rememberMe ?? false, meta);

    await authRepository.createSecurityEvent({
      userId: user.id,
      type: "LOGIN_SUCCESS",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      user: toPublicUser(user),
      sessionToken: session.rawToken,
      rememberMe: input.rememberMe ?? false,
    };
  },

  async createSession(userId: string, rememberMe: boolean, meta: RequestMeta) {
    const { raw, hash } = generateSecureToken();
    const days = rememberMe ? env.sessionRememberDurationDays : env.sessionDurationDays;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const session = await authRepository.createSession({
      userId,
      tokenHash: hash,
      expiresAt,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { session, rawToken: raw };
  },

  async getMe(rawToken: string): Promise<PublicUser> {
    const session = await authRepository.findActiveSessionByToken(rawToken);

    if (!session) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
    }

    try {
      await authRepository.touchSession(session.id);
    } catch (error) {
      console.error("session.touch_failed", error);
    }

    return toPublicUser(session.user);
  },

  async logout(rawToken: string, meta: RequestMeta) {
    const session = await authRepository.findActiveSessionByToken(rawToken);

    if (session) {
      await authRepository.revokeSession(session.id);
      await authRepository.createSecurityEvent({
        userId: session.userId,
        type: "LOGOUT",
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });
    }
  },

  async logoutAll(rawToken: string, meta: RequestMeta) {
    const session = await authRepository.findActiveSessionByToken(rawToken);

    if (!session) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
    }

    await authRepository.revokeAllSessions(session.userId);
    await authRepository.createSecurityEvent({
      userId: session.userId,
      type: "LOGOUT_ALL",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  },

  async forgotPassword(email: string, meta: RequestMeta) {
    const user = await authRepository.findUserByEmail(email);

    if (user) {
      await authRepository.invalidatePasswordResetTokens(user.id);
      const { raw, hash } = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await authRepository.createPasswordResetToken(user.id, hash, expiresAt);
      await enqueuePasswordResetEmail({
        type: "password-reset",
        email: user.email,
        fullName: user.fullName,
        token: raw,
      });
      await authRepository.createSecurityEvent({
        userId: user.id,
        type: "PASSWORD_RESET_REQUESTED",
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });
    }

    return { message: GENERIC_RESET_MESSAGE };
  },

  async resetPassword(
    input: { token: string; password: string; confirmPassword: string },
    meta: RequestMeta,
  ) {
    assertPasswordPolicy(input.password);

    const resetToken = await authRepository.findPasswordResetToken(hashToken(input.token));

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      throw new AppError(400, "INVALID_TOKEN", "This reset link is invalid or has expired.");
    }

    const passwordHash = await hashPassword(input.password);
    await authRepository.updatePassword(resetToken.userId, passwordHash);
    await authRepository.markPasswordResetTokenUsed(resetToken.id);
    await authRepository.invalidatePasswordResetTokens(resetToken.userId);
    await authRepository.revokeAllSessions(resetToken.userId);

    await authRepository.createSecurityEvent({
      userId: resetToken.userId,
      type: "PASSWORD_RESET_COMPLETED",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { message: "Password updated successfully." };
  },

  async changePassword(
    rawToken: string,
    input: { currentPassword: string; newPassword: string; confirmPassword: string },
    meta: RequestMeta,
  ) {
    assertPasswordPolicy(input.newPassword);

    const session = await authRepository.findActiveSessionByToken(rawToken);

    if (!session) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
    }

    const valid = await verifyPassword(input.currentPassword, session.user.passwordHash);
    if (!valid) {
      throw new AppError(401, "UNAUTHENTICATED", "Current password is incorrect.");
    }

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.updatePassword(session.userId, passwordHash);
    await authRepository.revokeAllSessions(session.userId, session.id);

    await authRepository.createSecurityEvent({
      userId: session.userId,
      type: "PASSWORD_CHANGED",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { message: "Password changed successfully." };
  },

  async listSessions(rawToken: string): Promise<SessionSummary[]> {
    const current = await authRepository.findActiveSessionByToken(rawToken);

    if (!current) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
    }

    const sessions = await authRepository.listActiveSessions(current.userId);

    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt.toISOString(),
      lastUsedAt: session.lastUsedAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      isCurrent: session.id === current.id,
    }));
  },

  async revokeSession(rawToken: string, sessionId: string, meta: RequestMeta) {
    const current = await authRepository.findActiveSessionByToken(rawToken);

    if (!current) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
    }

    const sessions = await authRepository.listActiveSessions(current.userId);
    const target = sessions.find((session) => session.id === sessionId);

    if (!target) {
      throw new AppError(404, "NOT_FOUND", "Session not found.");
    }

    await authRepository.revokeSession(sessionId);
    await authRepository.createSecurityEvent({
      userId: current.userId,
      type: "SESSION_REVOKED",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { sessionId },
    });

    return { revokedCurrentSession: sessionId === current.id };
  },

  resolveValidationError(error: unknown): never {
    if (error instanceof AuthValidationError) {
      throw new AppError(400, "VALIDATION_ERROR", error.message);
    }

    throw error;
  },
};

export function getRequestMeta(req: import("express").Request): RequestMeta {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  };
}

export function readSessionToken(req: import("express").Request): string | undefined {
  const cookieToken = req.cookies?.[env.sessionCookieName];
  return typeof cookieToken === "string" && cookieToken.length > 0 ? cookieToken : undefined;
}

export async function assertActiveSession(rawToken: string | undefined) {
  if (!rawToken) {
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
  }

  const session = await authRepository.findActiveSessionByToken(rawToken);
  if (!session) {
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
  }

  return session;
}

export async function validateVerificationToken(rawToken: string) {
  const token = await authRepository.findEmailVerificationToken(hashToken(rawToken));
  return token !== null && token.usedAt === null && token.expiresAt > new Date();
}

export async function validateResetToken(rawToken: string) {
  const token = await authRepository.findPasswordResetToken(hashToken(rawToken));
  return token !== null && token.usedAt === null && token.expiresAt > new Date();
}

export { safeCompareToken };
