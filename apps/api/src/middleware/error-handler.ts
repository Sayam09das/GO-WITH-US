import type { NextFunction, Request, Response } from "express";
import { logger } from "../infrastructure/logging/logger.js";
import { AppError, sendError } from "../lib/errors.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId;

  if (error instanceof AppError) {
    logger.warn("request.error", {
      requestId,
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
      userId: req.authUser?.id,
    });
    sendError(res, error.statusCode, error.code, error.message, requestId, error.details);
    return;
  }

  logger.error("request.unhandled_error", {
    requestId,
    message: error instanceof Error ? error.message : "Unknown error",
    userId: req.authUser?.id,
  });

  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong.", requestId);
}
