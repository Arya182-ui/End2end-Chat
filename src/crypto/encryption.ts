// RSA-OAEP encryption utilities using Web Crypto API

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
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
      // For small messages, use direct RSA encryption
      if (message.length < 100) {
        return await CryptoService.encryptMessage(message, publicKey);
      }

      // For larger messages, use hybrid encryption
      const aesKey = await this.generateAESKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt message with AES
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
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

      // Combine encrypted AES key, IV, and encrypted message
      const combined = {
        encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedAESKey))),
        iv: btoa(String.fromCharCode(...iv)),
        encryptedMessage: btoa(String.fromCharCode(...new Uint8Array(encryptedMessage))),
        hybrid: true
      };

      return btoa(JSON.stringify(combined));
    } catch (error) {
      console.error('Hybrid encryption error:', error);
      throw error;
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
        // If parsing fails, assume it's direct RSA encryption
        return await CryptoService.decryptMessage(encryptedData, privateKey);
      }

      if (!parsedData.hybrid) {
        // Not hybrid encryption, use direct RSA
        return await CryptoService.decryptMessage(encryptedData, privateKey);
      }

      // Decrypt AES key with RSA
      const encryptedKeyBytes = new Uint8Array(
        atob(parsedData.encryptedKey).split('').map(c => c.charCodeAt(0))
      );
      const decryptedAESKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedKeyBytes
      );

      // Import AES key
      const aesKey = await crypto.subtle.importKey(
        "raw",
        decryptedAESKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Decrypt message with AES
      const iv = new Uint8Array(
        atob(parsedData.iv).split('').map(c => c.charCodeAt(0))
      );
      const encryptedMessageBytes = new Uint8Array(
        atob(parsedData.encryptedMessage).split('').map(c => c.charCodeAt(0))
      );

      const decryptedMessage = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        encryptedMessageBytes
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedMessage);
    } catch (error) {
      console.error('Hybrid decryption error:', error);
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
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  // Import public key from base64 string
  static async importPublicKey(publicKeyString: string): Promise<CryptoKey> {
    const binaryString = atob(publicKeyString);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return await crypto.subtle.importKey(
      'spki',
      bytes,
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

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  // Decrypt message with private key
  static async decryptMessage(encryptedMessage: string, privateKey: CryptoKey): Promise<string> {
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      bytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}
