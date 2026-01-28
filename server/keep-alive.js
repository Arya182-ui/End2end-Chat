#!/usr/bin/env node

/**
 * Keep-Alive Service for Render.com
 * 
 * This script runs externally (like on a free cron service) to keep
 * your Render server awake by pinging it every 14 minutes.
 * 
 * Deploy this on:
 * - Vercel (as a serverless function with cron)
 * - GitHub Actions (with cron schedule)
 * - Any free cron service
 */

const https = require('https');
const http = require('http');

const SERVER_URL = 'https://end2end-chat.onrender.com';
const PING_ENDPOINT = '/ping';
const HEALTH_ENDPOINT = '/health';

const pingServer = async (endpoint) => {
  return new Promise((resolve, reject) => {
    const url = new URL(SERVER_URL + endpoint);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      timeout: 30000 // 30 seconds timeout
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ Server is alive! Response: ${JSON.stringify(response)}`);
          resolve(response);
        } catch (e) {
          console.log(`✅ Server responded (non-JSON): ${data}`);
          resolve({ status: 'ok', data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Ping failed: ${error.message}`);
      reject(error);
    });
    
    req.on('timeout', () => {
      console.error('⏰ Ping timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
};

const keepAlive = async () => {
  const timestamp = new Date().toISOString();
  console.log(`🏥 [${timestamp}] Starting keep-alive check...`);
  
  try {
    // Try ping endpoint first
    await pingServer(PING_ENDPOINT);
    console.log(`🎯 [${timestamp}] Keep-alive successful!`);
  } catch (error) {
    console.log(`🔄 [${timestamp}] Ping failed, trying health endpoint...`);
    
    try {
      // Fallback to health endpoint
      await pingServer(HEALTH_ENDPOINT);
      console.log(`🎯 [${timestamp}] Keep-alive successful via health endpoint!`);
    } catch (healthError) {
      console.error(`💀 [${timestamp}] All keep-alive attempts failed!`);
      console.error(`   Ping error: ${error.message}`);
      console.error(`   Health error: ${healthError.message}`);
    }
  }
};

// For one-time execution (cron jobs)
if (require.main === module) {
  keepAlive()
    .then(() => {
      console.log('Keep-alive check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Keep-alive check failed:', error);
      process.exit(1);
    });
}

// For continuous execution (if running as a service)
const startContinuous = () => {
  console.log('🚀 Starting continuous keep-alive service...');
  console.log(`📡 Target server: ${SERVER_URL}`);
  console.log('⏰ Ping interval: 14 minutes');
  
  // Initial ping
  keepAlive();
  
  // Set interval for 14 minutes (Render free tier sleeps after 15 minutes of inactivity)
  setInterval(keepAlive, 14 * 60 * 1000);
};

module.exports = { keepAlive, startContinuous };