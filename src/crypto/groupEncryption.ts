// Group Chat Encryption using Shared Session Key
// Each session has ONE AES-256 key that's shared among all members

import { logger } from '../utils/logger';

export class GroupCryptoService {
  
  // Generate a random AES-256 session key for the group
  static async generateSessionKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // extractable (so we can share it)
      ['encrypt', 'decrypt']
    );
  }

  // Export session key as base64 string (for sharing)
  static async exportSessionKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    const bytes = new Uint8Array(exported);
    return btoa(String.fromCharCode(...bytes));
  }

  // Import session key from base64 string
  static async importSessionKey(keyString: string): Promise<CryptoKey> {
    const bytes = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt session key with member's RSA public key (for distribution)
  static async encryptSessionKeyForMember(
    sessionKey: CryptoKey,
    memberPublicKey: CryptoKey
  ): Promise<string> {
    // Export session key as raw bytes
    const sessionKeyRaw = await window.crypto.subtle.exportKey('raw', sessionKey);
    
    // Encrypt with member's RSA public key
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      memberPublicKey,
      sessionKeyRaw
    );
    
    // Return as base64
    const bytes = new Uint8Array(encrypted);
    return btoa(String.fromCharCode(...bytes));
  }

  // Decrypt session key received from creator (using own RSA private key)
  static async decryptSessionKey(
    encryptedKey: string,
    privateKey: CryptoKey
  ): Promise<CryptoKey> {
    // Decode base64
    const bytes = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
    
    // Decrypt with private RSA key
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      bytes
    );
    
    // Import as AES key
    return await window.crypto.subtle.importKey(
      'raw',
      decrypted,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message with shared session key
  static async encryptMessage(message: string, sessionKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Generate random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      data
    );
    
    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 in chunks to avoid stack overflow
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < combined.length; i += chunkSize) {
      const chunk = combined.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  // Decrypt message with shared session key
  static async decryptMessage(encryptedMessage: string, sessionKey: CryptoKey): Promise<string> {
    try {
      // Decode base64
      const combined = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
      
      // Extract IV (first 12 bytes) and ciphertext
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      
      // Decrypt
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        sessionKey,
        ciphertext
      );
      
      // Decode to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }
}
