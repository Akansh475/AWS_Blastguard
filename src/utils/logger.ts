export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private format(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'test') {
      console.debug(this.format('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'test') {
      console.info(this.format('info', message, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format('warn', message, context));
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const errContext = error instanceof Error ? { ...context, error: error.message, stack: error.stack } : { ...context, error };
    console.error(this.format('error', message, errContext));
  }
}

export const logger = new Logger();
