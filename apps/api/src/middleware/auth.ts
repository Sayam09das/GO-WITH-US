import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, sendError } from "../lib/errors.js";
import { authService, readSessionToken } from "../modules/auth/auth.service.js";

export function handleControllerError(error: unknown, res: Response): void {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.code, error.message);
    return;
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Invalid request.";
    sendError(res, 400, "VALIDATION_ERROR", message);
    return;
  }

  console.error(error);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong.");
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = readSessionToken(req);

  if (!token) {
    sendError(res, 401, "UNAUTHENTICATED", "Authentication required.");
    return;
  }

  authService
    .getMe(token)
    .then((user) => {
      req.authUser = user;
      next();
    })
    .catch((error) => handleControllerError(error, res));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authUser?.role !== "ADMIN") {
    sendError(res, 403, "FORBIDDEN", "Admin access required.");
    return;
  }

  next();
}

export function getAuthUserId(req: Request): string {
  const userId = req.authUser?.id;

  if (!userId) {
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required.");
  }

  return userId;
}
