type Level = "debug" | "info" | "warn" | "error";

/** Minimal structured logger; Lambda's JSON log format turns each line into a queryable record. */
function log(level: Level, message: string, data?: Record<string, unknown>) {
  console[level](JSON.stringify({ level, message, ...data }));
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => log("error", message, data),
};
