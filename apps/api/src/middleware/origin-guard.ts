import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { sendError } from "../lib/errors.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function allowedOrigins(): string[] {
  const origins = new Set<string>([env.appOrigin, env.appUrl]);
  if (env.nodeEnv !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return [...origins];
}

function isAllowedAppOrigin(value: string): boolean {
  return allowedOrigins().includes(value);
}

function isAllowedReferer(referer: string): boolean {
  return allowedOrigins().some((origin) => referer.startsWith(origin));
}

export function validateOrigin(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");
  const referer = req.get("referer");

  if (!origin && !referer) {
    next();
    return;
  }

  if (origin && !isAllowedAppOrigin(origin)) {
    sendError(res, 403, "FORBIDDEN", "Cross-site request blocked.");
    return;
  }

  if (referer && !isAllowedReferer(referer)) {
    sendError(res, 403, "FORBIDDEN", "Cross-site request blocked.");
    return;
  }

  next();
}
