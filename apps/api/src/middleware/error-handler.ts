import type { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "../lib/errors.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.code, error.message);
    return;
  }

  console.error(error);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong.");
}
