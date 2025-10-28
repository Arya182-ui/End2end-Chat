/**
 * Production-safe logger utility
 * Logs are disabled in production to prevent sensitive data exposure
 */

const isProduction = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Errors disabled in production too for security
    if (!isProduction) {
      console.error(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  // Critical errors that should always be logged (sanitized)
  critical: (message: string, error?: any) => {
    if (!isProduction) {
      console.error('[CRITICAL]', message);
      if (error) {
        console.error(error);
      }
    }
  }
};

// Helper to sanitize sensitive data
export const sanitize = {
  sessionId: (sessionId: string) => {
    if (isProduction) return '[REDACTED]';
    return sessionId;
  },
  
  userId: (userId: string) => {
    if (isProduction) return '[REDACTED]';
    return userId.substring(0, 8) + '...';
  },
  
  encrypted: (data: string) => {
    if (isProduction) return '[ENCRYPTED]';
    return data.substring(0, 20) + '...';
  },
  
  token: (token: string) => {
    if (isProduction) return '[TOKEN]';
    return token.substring(0, 15) + '...';
  }
};
