export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function sendError(
  res: import("express").Response,
  statusCode: number,
  code: string,
  message: string,
  requestId?: string,
  details?: Record<string, unknown>,
): void {
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(requestId ? { requestId } : {}),
    },
  });
}

export function sendData<T>(res: import("express").Response, statusCode: number, data: T): void {
  res.status(statusCode).json({ data });
}
