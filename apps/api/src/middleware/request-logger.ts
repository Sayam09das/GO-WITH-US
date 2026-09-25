import type { NextFunction, Request, Response } from "express";
import { logger } from "../infrastructure/logging/logger.js";

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info("http.request", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: req.authUser?.id,
    });
  });

  next();
}
