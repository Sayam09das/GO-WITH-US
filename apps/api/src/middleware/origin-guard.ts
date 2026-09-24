import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { sendError } from "../lib/errors.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

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

  const allowedOrigin = env.appOrigin;

  if (origin && origin !== allowedOrigin) {
    sendError(res, 403, "FORBIDDEN", "Cross-site request blocked.");
    return;
  }

  if (referer && !referer.startsWith(allowedOrigin)) {
    sendError(res, 403, "FORBIDDEN", "Cross-site request blocked.");
    return;
  }

  next();
}
