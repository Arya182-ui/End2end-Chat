// RSA-OAEP encryption utilities using Web Crypto API

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

// Helper function to convert ArrayBuffer to base64 without stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB chunks
  let binary = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  
  return btoa(binary);
}

// Helper function to convert base64 to Uint8Array without stack overflow
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return bytes;
}

// AES-GCM encryption for large messages
export class HybridCryptoService {
  // Generate AES key for message encryption
  static async generateAESKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  // Encrypt large message using hybrid encryption (AES + RSA)
  static async encryptLargeMessage(message: string, publicKey: CryptoKey): Promise<string> {
    try {
      // Check message size before processing
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
      
      if (messageData.length > 20 * 1024 * 1024) {
        throw new Error('Message too large for encryption (max 20MB)');
      }

      // Always use hybrid encryption for files and large messages
      const aesKey = await this.generateAESKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt message with AES
      const encryptedMessage = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        messageData
      );

      // Export AES key and encrypt it with RSA
      const exportedAESKey = await crypto.subtle.exportKey("raw", aesKey);
      const encryptedAESKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        exportedAESKey
      );

      // Combine encrypted AES key, IV, and encrypted message using safe base64 conversion
      const combined = {
        encryptedKey: arrayBufferToBase64(encryptedAESKey),
        iv: arrayBufferToBase64(iv.buffer),
        encryptedMessage: arrayBufferToBase64(encryptedMessage),
        hybrid: true
      };

      return btoa(JSON.stringify(combined));
    } catch (error) {
      // Re-throw with more specific error message
      if (error instanceof Error) {
        throw new Error(`Encryption failed: ${error.message}`);
      }
      throw new Error('Encryption failed: Unknown error');
    }
  }

  // Decrypt large message using hybrid decryption
  static async decryptLargeMessage(encryptedData: string, privateKey: CryptoKey): Promise<string> {
    try {
      // Try to parse as hybrid encryption first
      let parsedData;
      try {
        parsedData = JSON.parse(atob(encryptedData));
      } catch {
        // If parsing fails, assume it's direct RSA encryption (legacy)
        return await CryptoService.decryptMessage(encryptedData, privateKey);
      }

      if (!parsedData.hybrid) {
        // Not hybrid encryption, use direct RSA (legacy)
        return await CryptoService.decryptMessage(encryptedData, privateKey);
      }

      // Decrypt AES key with RSA using safe conversion
      const encryptedKeyBytes = base64ToUint8Array(parsedData.encryptedKey);
      const decryptedAESKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedKeyBytes.buffer as ArrayBuffer
      );

      // Import AES key
      const aesKey = await crypto.subtle.importKey(
        "raw",
        decryptedAESKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Decrypt message with AES using safe conversion
      const iv = base64ToUint8Array(parsedData.iv);
      const encryptedMessageBytes = base64ToUint8Array(parsedData.encryptedMessage);

      const decryptedMessage = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
        aesKey,
        encryptedMessageBytes.buffer as ArrayBuffer
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedMessage);
    } catch (error) {
      // Silently fail - this is expected when trying to decrypt messages
      // that were encrypted with a different key pair (e.g., after page refresh)
      throw error;
    }
  }
}

export class CryptoService {
  // Generate RSA-OAEP key pair
  static async generateKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }

  // Export public key to base64 string
  static async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', publicKey);
    return arrayBufferToBase64(exported);
  }

  // Import public key from base64 string
  static async importPublicKey(publicKeyString: string): Promise<CryptoKey> {
    const bytes = base64ToUint8Array(publicKeyString);

    return await crypto.subtle.importKey(
      'spki',
      bytes.buffer as ArrayBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      false,
      ["encrypt"]
    );
  }

  // Encrypt message with public key
  static async encryptMessage(message: string, publicKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      data
    );

    return arrayBufferToBase64(encrypted);
  }

  // Decrypt message with private key
  static async decryptMessage(encryptedMessage: string, privateKey: CryptoKey): Promise<string> {
    const bytes = base64ToUint8Array(encryptedMessage);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      bytes.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}
