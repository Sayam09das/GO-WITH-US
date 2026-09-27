import type { Prisma, SecurityEventType } from "@prisma/client";
import { prisma } from "../../lib/db.js";
import { hashToken } from "../../lib/tokens.js";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  },

  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(input: { email: string; fullName: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        passwordHash: input.passwordHash,
      },
    });
  },

  markEmailVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  },

  updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  createEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  },

  findEmailVerificationToken(tokenHash: string) {
    return prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  },

  markEmailVerificationTokenUsed(id: string) {
    return prisma.emailVerificationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  invalidateEmailVerificationTokens(userId: string) {
    return prisma.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  },

  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  },

  findPasswordResetToken(tokenHash: string) {
    return prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  },

  markPasswordResetTokenUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  invalidatePasswordResetTokens(userId: string) {
    return prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  },

  createSession(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.session.create({ data: input });
  },

  findActiveSessionByToken(rawToken: string) {
    return prisma.session.findFirst({
      where: {
        tokenHash: hashToken(rawToken),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  },

  touchSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    });
  },

  revokeSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllSessions(userId: string, exceptSessionId?: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });
  },

  listActiveSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastUsedAt: "desc" },
    });
  },

  createSecurityEvent(input: {
    userId?: string;
    type: SecurityEventType;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.securityEvent.create({
      data: {
        userId: input.userId,
        type: input.type,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: input.metadata,
      },
    });
  },
};
