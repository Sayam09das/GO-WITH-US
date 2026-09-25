type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function writeLog(level: LogLevel, event: string, context: LogContext = {}): void {
  const payload = {
    level,
    event,
    service: "gowithus-worker",
    timestamp: new Date().toISOString(),
    ...context,
  };

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info(event: string, context?: LogContext): void {
    writeLog("info", event, context);
  },
  warn(event: string, context?: LogContext): void {
    writeLog("warn", event, context);
  },
  error(event: string, context?: LogContext): void {
    writeLog("error", event, context);
  },
};
