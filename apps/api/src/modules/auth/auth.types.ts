import type { User } from "@prisma/client";

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  avatarUrl: string | null;
  bio: string | null;
  homeCity: string | null;
  travelStyles: string[];
  budgetPreference: "budget" | "moderate" | "luxury" | null;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    emailVerified: user.emailVerified,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    homeCity: user.homeCity,
    travelStyles: user.travelStyles,
    budgetPreference: user.budgetPreference,
  };
}

export type SessionSummary = {
  id: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
};
