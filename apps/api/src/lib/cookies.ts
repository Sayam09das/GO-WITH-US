import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";

export const SESSION_COOKIE_NAME = env.sessionCookieName;

export function getSessionCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  };
}

export function setSessionCookie(res: Response, token: string, rememberMe: boolean): void {
  const days = rememberMe ? env.sessionRememberDurationDays : env.sessionDurationDays;
  const maxAgeMs = days * 24 * 60 * 60 * 1000;
  res.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions(maxAgeMs));
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function getSessionDurationMs(rememberMe = false): number {
  const days = rememberMe ? env.sessionRememberDurationDays : env.sessionDurationDays;
  return days * 24 * 60 * 60 * 1000;
}
