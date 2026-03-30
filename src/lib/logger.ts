export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.info(`[stride] ${message}`, context ?? {});
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[stride] ${message}`, context ?? {});
  },
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(`[stride] ${message}`, context ?? {});
  },
};
