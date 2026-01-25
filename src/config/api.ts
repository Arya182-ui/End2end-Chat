// API Configuration
export const API_CONFIG = {
  // WebSocket/API Server URL
  SERVER_URL: import.meta.env.VITE_WS_URL || 'https://end2end-chat.onrender.com',
  
  // Fallback for production
  PRODUCTION_SERVER: 'https://end2end-chat.onrender.com',
  
  // Development server
  DEV_SERVER: 'http://localhost:3001',
  
  // Get the correct server URL
  getServerUrl(): string {
    const envUrl = import.meta.env.VITE_WS_URL;
    
    // Production debugging
    if (import.meta.env.PROD) {
      console.log('Production Debug - Environment variables:');
      console.log('VITE_WS_URL:', envUrl);
      console.log('PROD:', import.meta.env.PROD);
      console.log('Resolved URL will be:', envUrl && envUrl !== 'undefined' && envUrl.startsWith('http') ? envUrl : this.PRODUCTION_SERVER);
    }
    
    // Validate environment URL
    if (envUrl && envUrl !== 'undefined' && envUrl.startsWith('http')) {
      return envUrl;
    }
    
    // Fallback logic
    if (import.meta.env.PROD) {
      return this.PRODUCTION_SERVER;
    }
    
    return this.DEV_SERVER;
  }
};

// Export default URL getter
export const getServerUrl = () => API_CONFIG.getServerUrl();