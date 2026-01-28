/**
 * Vercel Serverless Function for Keep-Alive
 * 
 * This function can be deployed to Vercel and scheduled via cron
 * to keep your Render server awake.
 * 
 * URL: https://your-vercel-app.vercel.app/api/keep-alive
 * 
 * Set up Vercel cron jobs in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/keep-alive",
 *     "schedule": "0,15,30,45 * * * *"
 *   }]
 * }
 */

const https = require('https');

const pingServer = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          data: data ? JSON.parse(data) : null,
          headers: res.headers 
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const serverUrl = 'https://end2end-chat.onrender.com';
  
  try {
    console.log(`🏥 [${timestamp}] Keep-alive check starting...`);
    
    // Try ping endpoint first
    let result;
    try {
      result = await pingServer(`${serverUrl}/ping`);
      console.log(`✅ [${timestamp}] Ping successful:`, result.data);
    } catch (pingError) {
      console.log(`⚠️  [${timestamp}] Ping failed, trying health...`);
      
      // Fallback to health endpoint
      try {
        result = await pingServer(`${serverUrl}/health`);
        console.log(`✅ [${timestamp}] Health check successful:`, result.data);
      } catch (healthError) {
        console.error(`❌ [${timestamp}] All checks failed!`);
        console.error('Ping error:', pingError.message);
        console.error('Health error:', healthError.message);
        
        return res.status(500).json({
          success: false,
          timestamp,
          error: 'All keep-alive attempts failed',
          details: {
            ping: pingError.message,
            health: healthError.message
          }
        });
      }
    }
    
    // Success response
    res.status(200).json({
      success: true,
      timestamp,
      serverStatus: result.data,
      message: `Server is alive! Response time: ${result.status}ms`
    });
    
    console.log(`🎯 [${timestamp}] Keep-alive completed successfully`);
    
  } catch (error) {
    console.error(`💀 [${timestamp}] Keep-alive error:`, error);
    
    res.status(500).json({
      success: false,
      timestamp,
      error: error.message
    });
  }
}