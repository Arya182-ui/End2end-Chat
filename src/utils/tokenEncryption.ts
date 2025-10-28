/**
 * Token Encryption/Decryption Utility
 * Uses AES-GCM for secure token generation
 */

// Secret key for token encryption (in production, use environment variable)
import { logger } from './logger';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-encryption-key-change-in-production';

/**
 * Generate encryption key from secret
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY.padEnd(32, '0').substring(0, 32));
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt session data into a secure token
 */
export async function encryptToken(sessionId: string, authKey: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    
    // Create payload
    const payload = JSON.stringify({
      session: sessionId,
      key: authKey,
      timestamp: Date.now() // Add timestamp for expiry validation
    });
    
    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(payload)
    );
    
    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64 (URL-safe)
    return btoa(String.fromCharCode(...combined))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    logger.error('Token encryption failed:', error);
    throw new Error('Failed to generate secure token');
  }
}

/**
 * Decrypt token to extract session data
 */
export async function decryptToken(token: string): Promise<{ session: string; key: string; timestamp: number } | null> {
  try {
    const key = await getEncryptionKey();
    
    // Convert from URL-safe base64
    const base64 = token
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Decode base64
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    // Parse JSON
    const decoder = new TextDecoder();
    const payload = JSON.parse(decoder.decode(decryptedData));
    
    // Validate token age (24 hours max)
    const tokenAge = Date.now() - payload.timestamp;
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > MAX_AGE) {
      logger.warn('Token expired');
      return null;
    }
    
    return {
      session: payload.session,
      key: payload.key,
      timestamp: payload.timestamp
    };
  } catch (error) {
    logger.error('Token decryption failed:', error);
    return null;
  }
}

/**
 * Validate token without full decryption (quick check)
 */
export function isValidTokenFormat(token: string): boolean {
  // Check if it's a valid base64 string with minimum length
  const base64Pattern = /^[A-Za-z0-9_-]+$/;
  return base64Pattern.test(token) && token.length >= 32;
}
