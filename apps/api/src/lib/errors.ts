export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
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
): void {
  res.status(statusCode).json({ error: { code, message } });
}

export function sendData<T>(res: import("express").Response, statusCode: number, data: T): void {
  res.status(statusCode).json({ data });
}
