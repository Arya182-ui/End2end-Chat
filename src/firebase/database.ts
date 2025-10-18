import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, set, remove, onDisconnect } from 'firebase/database';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export interface Message {
  id: string;
  from: string;
  to: string;
  encrypted: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
  originalContent?: string; // For sender to display their own message
}

export interface PublicKey {
  userId: string;
  publicKey: string;
}

export class FirebaseService {
  private sessionId: string;
  private userId: string;

  constructor(sessionId: string, userId: string) {
    this.sessionId = sessionId;
    this.userId = userId;
  }

  // Save public key to Firebase
  async savePublicKey(publicKey: string): Promise<void> {
    const keyRef = ref(database, `chats/${this.sessionId}/publicKeys/${this.userId}`);
    await set(keyRef, publicKey);
    
    // Set up disconnect handler to clean up when user leaves
    onDisconnect(keyRef).remove();
  }

  // Listen for public keys
  listenForPublicKeys(callback: (keys: PublicKey[]) => void): () => void {
    const keysRef = ref(database, `chats/${this.sessionId}/publicKeys`);
    
    const handleKeys = (snapshot: any) => {
      const keys: PublicKey[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(userId => {
          if (userId !== this.userId) {
            keys.push({
              userId,
              publicKey: data[userId]
            });
          }
        });
      }
      callback(keys);
    };

    onValue(keysRef, handleKeys);
    
    return () => off(keysRef, 'value', handleKeys);
  }

  // Send encrypted message
  async sendMessage(to: string, encryptedMessage: string, originalContent?: string): Promise<void> {
    const messagesRef = ref(database, `chats/${this.sessionId}/messages`);
    const messageData: any = {
      from: this.userId,
      to,
      encrypted: encryptedMessage,
      timestamp: Date.now()
    };
    
    // Store original content for sender (only sender can see this)
    if (originalContent) {
      messageData.originalContent = originalContent;
    }
    
    await push(messagesRef, messageData);
  }

  // Listen for messages
  listenForMessages(callback: (messages: Message[]) => void): () => void {
    const messagesRef = ref(database, `chats/${this.sessionId}/messages`);
    
    const handleMessages = (snapshot: any) => {
      const messages: Message[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(messageId => {
          const message = data[messageId];
          if (message.to === this.userId || message.from === this.userId) {
            messages.push({
              id: messageId,
              ...message
            });
          }
        });
      }
      callback(messages.sort((a, b) => a.timestamp - b.timestamp));
    };

    onValue(messagesRef, handleMessages);
    
    return () => off(messagesRef, 'value', handleMessages);
  }

  // Clear session data
  async clearSession(): Promise<void> {
    const sessionRef = ref(database, `chats/${this.sessionId}`);
    await remove(sessionRef);
  }
}
