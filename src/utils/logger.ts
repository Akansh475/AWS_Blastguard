export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.log(`[INFO] [${new Date().toISOString()}] ${message}${ctx}`);
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}${ctx}`);
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    const errDetails = error instanceof Error ? ` Error: ${error.message}` : '';
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}${errDetails}${ctx}`);
  },
};
