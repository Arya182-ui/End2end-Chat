import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';

export interface Message {
  id: string;
  from: string;
  to: string;
  encrypted: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
  originalContent?: string;
  senderDisplayName?: string; // Add sender's display name
}

export interface PublicKey {
  userId: string;
  publicKey: string;
  displayName?: string;
}

// Singleton WebSocket connection manager
class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private socket: Socket | null = null;
  private activeServices: Set<WebSocketService> = new Set();

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  getSocket(): Socket {
    if (!this.socket) {
      const serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        autoConnect: true
      });

      this.socket.on('connect', () => {
        logger.debug('✅ Connected to WebSocket server');
      });

      this.socket.on('disconnect', (reason: string) => {
        logger.debug('❌ Disconnected:', reason);
      });

      this.socket.on('connect_error', (error: Error) => {
        logger.error('❌ Connection error:', error);
      });
    }
    return this.socket;
  }

  registerService(service: WebSocketService) {
    this.activeServices.add(service);
  }

  unregisterService(service: WebSocketService) {
    this.activeServices.delete(service);
    
    // Disconnect socket if no active services
    if (this.activeServices.size === 0 && this.socket) {
      logger.debug('🔌 No active services, disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export class WebSocketService {
  private socket: Socket;
  private sessionId: string;
  private userId: string;
  private displayName?: string;
  private publicKeysCallback: ((keys: PublicKey[]) => void) | null = null;
  private messagesCallback: ((messages: Message[]) => void) | null = null;
  private messages: Message[] = [];
  private hasJoinedSession: boolean = false;
  private eventHandlers: Map<string, (...args: any[]) => void> = new Map();

  constructor(sessionId: string, userId: string, displayName?: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.displayName = displayName;
    
    const manager = WebSocketManager.getInstance();
    this.socket = manager.getSocket();
    manager.registerService(this);
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Public keys updated
    const handlePublicKeys = (keys: PublicKey[]) => {
      const filteredKeys = keys.filter(k => k.userId !== this.userId);
      if (this.publicKeysCallback) {
        this.publicKeysCallback(filteredKeys);
      }
    };
    this.socket.on('public-keys-updated', handlePublicKeys);
    this.eventHandlers.set('public-keys-updated', handlePublicKeys);

    // Messages history
    const handleMessagesHistory = (messages: Message[]) => {
      this.messages = messages.sort((a, b) => a.timestamp - b.timestamp);
      if (this.messagesCallback) {
        this.messagesCallback(this.messages);
      }
    };
    this.socket.on('messages-history', handleMessagesHistory);
    this.eventHandlers.set('messages-history', handleMessagesHistory);

    // New message
    const handleNewMessage = (message: Message) => {
      this.messages.push(message);
      this.messages.sort((a, b) => a.timestamp - b.timestamp);
      if (this.messagesCallback) {
        this.messagesCallback([...this.messages]);
      }
    };
    this.socket.on('new-message', handleNewMessage);
    this.eventHandlers.set('new-message', handleNewMessage);

    // Message sent confirmation
    const handleMessageSent = (message: Message) => {
      const existingIndex = this.messages.findIndex(m => m.id === message.id);
      if (existingIndex === -1) {
        this.messages.push(message);
        this.messages.sort((a, b) => a.timestamp - b.timestamp);
        if (this.messagesCallback) {
          this.messagesCallback([...this.messages]);
        }
      }
    };
    this.socket.on('message-sent', handleMessageSent);
    this.eventHandlers.set('message-sent', handleMessageSent);

    // User joined
    const handleUserJoined = ({ userId, displayName }: { userId: string; displayName?: string }) => {
      if (userId !== this.userId) {
        logger.debug(`👤 ${displayName || userId} joined the chat`);
      }
    };
    this.socket.on('user-joined', handleUserJoined);
    this.eventHandlers.set('user-joined', handleUserJoined);

    // User left
    const handleUserLeft = ({ userId }: { userId: string }) => {
      if (userId !== this.userId) {
        logger.debug(`👋 ${userId} left the chat`);
      }
    };
    this.socket.on('user-left', handleUserLeft);
    this.eventHandlers.set('user-left', handleUserLeft);
  }

  private removeEventHandlers() {
    // Remove all event listeners
    this.eventHandlers.forEach((handler, event) => {
      this.socket.off(event, handler);
    });
    this.eventHandlers.clear();
  }

  async savePublicKey(publicKey: string): Promise<void> {
    if (this.hasJoinedSession) {
      logger.debug('⚠️ Already joined session, skipping...');
      return;
    }

    return new Promise((resolve) => {
      this.socket.emit('join-session', {
        sessionId: this.sessionId,
        userId: this.userId,
        displayName: this.displayName,
        publicKey
      });
      
      this.hasJoinedSession = true;
      setTimeout(() => resolve(), 100);
    });
  }

  listenForPublicKeys(callback: (keys: PublicKey[]) => void): () => void {
    this.publicKeysCallback = callback;
    
    // Request current public keys
    this.socket.emit('get-public-keys', {
      sessionId: this.sessionId,
      userId: this.userId
    });

    return () => {
      this.publicKeysCallback = null;
    };
  }

  async sendMessage(to: string, encryptedMessage: string, originalContent?: string): Promise<void> {
    const type = originalContent?.startsWith('[IMAGE]') 
      ? 'image' 
      : (originalContent?.startsWith('[FILE]') ? 'file' : 'text');

    return new Promise((resolve) => {
      this.socket.emit('send-message', {
        sessionId: this.sessionId,
        from: this.userId,
        to,
        encrypted: encryptedMessage,
        originalContent,
        type
      });
      
      resolve();
    });
  }

  listenForMessages(callback: (messages: Message[]) => void): () => void {
    this.messagesCallback = callback;
    
    if (this.messages.length > 0) {
      setTimeout(() => callback(this.messages), 0);
    }

    return () => {
      this.messagesCallback = null;
    };
  }

  async clearSession(): Promise<void> {
    if (!this.hasJoinedSession) {
      return;
    }

    this.hasJoinedSession = false;
    
    this.socket.emit('leave-session', {
      sessionId: this.sessionId,
      userId: this.userId
    });

    // Remove event handlers
    this.removeEventHandlers();
    
    // Unregister from manager
    const manager = WebSocketManager.getInstance();
    manager.unregisterService(this);
  }

  isConnected(): boolean {
    return this.socket?.connected && this.hasJoinedSession;
  }
}
