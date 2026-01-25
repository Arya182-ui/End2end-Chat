// Production build optimizations
export const PRODUCTION_CONFIG = {
  // Disable logging in production
  DISABLE_LOGS: import.meta.env.PROD,
  
  // Enable performance optimizations
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.PROD,
  
  // Service worker for production
  ENABLE_SERVICE_WORKER: import.meta.env.PROD,
  
  // Analytics only in production
  ENABLE_ANALYTICS: import.meta.env.PROD && import.meta.env.VITE_GA_TRACKING_ID,
  
  // AdSense only in production
  ENABLE_ADSENSE: import.meta.env.PROD && import.meta.env.VITE_ADSENSE_CLIENT_ID,
  
  // Error boundaries in production
  ENABLE_ERROR_BOUNDARIES: import.meta.env.PROD
};

// Production-safe console replacement
export const productionConsole = {
  log: (...args: any[]) => {
    if (!PRODUCTION_CONFIG.DISABLE_LOGS) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (!PRODUCTION_CONFIG.DISABLE_LOGS) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (!PRODUCTION_CONFIG.DISABLE_LOGS) {
      console.error(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (!PRODUCTION_CONFIG.DISABLE_LOGS) {
      console.debug(...args);
    }
  }
};

export default PRODUCTION_CONFIG;