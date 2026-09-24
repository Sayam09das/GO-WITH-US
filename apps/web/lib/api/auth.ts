import type { PublicUser } from "@gowithus/types";
import { apiFetch } from "./client";

export type RegisterResponse = {
  user: PublicUser;
  message: string;
  maskedEmail: string;
};

export type LoginResponse = {
  user: PublicUser;
};

export type MeResponse = {
  user: PublicUser;
};

export type MessageResponse = {
  message: string;
};

export function register(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function login(input: { email: string; password: string; rememberMe?: boolean }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function getMe() {
  return apiFetch<MeResponse>("/auth/me");
}

export function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function forgotPassword(input: { email: string }) {
  return apiFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export function resetPassword(input: { token: string; password: string; confirmPassword: string }) {
  return apiFetch<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: input,
  });
}

export function resendVerification(input: { email: string }) {
  return apiFetch<MessageResponse>("/auth/resend-verification", {
    method: "POST",
    body: input,
  });
}

export function validateResetToken(token: string) {
  return apiFetch<{ valid: boolean }>(
    `/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
  );
}
