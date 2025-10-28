import { io, Socket } from 'socket.io-client';
import { logger, sanitize } from '../utils/logger';

export interface Message {
  id: string;
  from: string;
  to: string;
  encrypted: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file' | 'video' | 'audio';
  originalContent?: string;
  senderDisplayName?: string; // Add sender's display name
}

export interface PublicKey {
  userId: string;
  publicKey: string;
  displayName?: string;
}

export class WebSocketService {
  private socket: Socket | null = null;
  private sessionId: string;
  private authKey?: string; // Add auth key storage
  private userId: string;
  private displayName?: string;
  private isCreator: boolean = false; // Track if user is creator
  private publicKeysCallback: ((keys: PublicKey[]) => void) | null = null;
  private messagesCallback: ((messages: Message[]) => void) | null = null;
  private notificationCallback: ((notification: string) => void) | null = null;
  private sessionErrorCallback: ((error: string) => void) | null = null;
  private userActivityCallback: ((activity: { type: 'joined' | 'left', displayName: string, userId: string }) => void) | null = null;
  private sessionMetadataCallback: ((metadata: { chatMode: 'private' | 'group', encryptedSessionKey?: string }) => void) | null = null;
  private userTypingCallback: ((data: { userId: string, displayName: string }) => void) | null = null;
  private userStoppedTypingCallback: ((data: { userId: string, displayName: string }) => void) | null = null;
  private messages: Message[] = [];
  private hasJoinedSession: boolean = false;
  private chatMode: 'private' | 'group' = 'group'; // Default mode

  constructor(sessionId: string, userId: string, displayName?: string) {
    // Extract auth key from sessionId if present
    // Format can be:
    // 1. "sessionId:authKey" (regular group/private)
    // 2. "sessionId:authKey:passwordHash" (password room creator)
    // 3. "sessionId:password:passwordHash" (password room joiner)
    if (sessionId.includes(':')) {
      const parts = sessionId.split(':');
      this.sessionId = parts[0];
      
      // Check if it's password room joiner format (sessionId:password:hash)
      if (parts[1] === 'password' && parts[2]) {
        // Password room joiner - keep full sessionId for server to validate
        this.sessionId = sessionId; // Keep full format for server to handle
        this.authKey = undefined;
        logger.log(`🔑 Password room join - sessionId: ${parts[0]}`);
      } 
      // Check if it's password room creator format (sessionId:authKey:passwordHash)
      else if (parts.length === 3 && parts[2] && parts[2].length > 0) {
        // Password room creator - keep full authKey including password hash
        this.authKey = `${parts[1]}:${parts[2]}`;
        logger.log(`🔑 Password room creator - authKey with password hash: ${this.authKey?.substring(0, 4)}...`);
        logger.log(`🔍 DEBUG - sessionId: ${this.sessionId}, full authKey length: ${this.authKey?.length}`);
      }
      // Regular format (sessionId:authKey)
      else {
        this.authKey = parts[1];
        logger.log(`🔑 Extracted auth key from session ID: ${this.authKey?.substring(0, 4)}...`);
        logger.log(`🔍 DEBUG - sessionId: ${this.sessionId}, authKey length: ${this.authKey?.length}`);
      }
    } else {
      this.sessionId = sessionId;
      logger.log(`⚠️ No auth key in sessionId: ${sessionId}`);
    }
    
    this.userId = userId;
    this.displayName = displayName;
    this.initializeSocket();
  }

  private initializeSocket() {
    // Connect to WebSocket server
    const serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true
    });

    // Connection events
    this.socket.on('connect', () => {
      logger.log('✅ Connected to WebSocket server');
      // Only auto-rejoin if we're still supposed to be in a session
      // Don't rejoin if user manually left (hasJoinedSession will be false)
      if (this.hasJoinedSession) {
        logger.log('🔄 Reconnected - rejoining session...');
        this.rejoinSession();
      } else {
        logger.log('ℹ️ Connected but not rejoining (user left session)');
      }
    });

    this.socket.on('disconnect', (reason) => {
      logger.log('❌ Disconnected from WebSocket server:', reason);
      if (reason === 'io client disconnect') {
        // Manual disconnect - don't reconnect
        this.hasJoinedSession = false;
      }
    });

    this.socket.on('connect_error', (error) => {
      logger.error('❌ Connection error:', error);
    });

    // Chat events
    this.socket.on('public-keys-updated', (keys: PublicKey[]) => {
      logger.log(`🔑 PUBLIC KEYS UPDATED - Received ${keys.length} public keys`);
      // Filter out own key
      const filteredKeys = keys.filter(k => k.userId !== this.userId);
      logger.log(`🔑 After filtering own key: ${filteredKeys.length} peer keys available`);
      if (this.publicKeysCallback) {
        this.publicKeysCallback(filteredKeys);
        logger.log(`✅ Updated UI with ${filteredKeys.length} peer public keys`);
      }
    });

    this.socket.on('messages-history', (messages: Message[]) => {
      logger.log(`📨 Received ${messages.length} messages from history`);
      // Merge history with any existing messages and remove duplicates by id
      const combined = [...this.messages, ...messages];
      const map = new Map<string, Message>();
      for (const m of combined) {
        map.set(m.id, m);
      }
      this.messages = Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
      if (this.messagesCallback) {
        this.messagesCallback(this.messages);
        logger.log(`✅ Updated UI with ${this.messages.length} messages`);
      } else {
        logger.warn('⚠️ Message callback not set yet, messages stored but UI not updated');
      }
    });

    this.socket.on('new-message', (message: Message) => {
      logger.debug('📨 NEW-MESSAGE event received');
      logger.debug('📨 From:', sanitize.userId(message.from), 'To:', sanitize.userId(message.to));
      // Add to local messages array if not already present (dedupe by id)
      const exists = this.messages.find(m => m.id === message.id);
      if (exists) {
        logger.debug('🟡 Duplicate message received, ignoring:', message.id);
      } else {
        this.messages.push(message);
        this.messages.sort((a, b) => a.timestamp - b.timestamp);
      }
      
      logger.debug('📨 Total messages now:', this.messages.length);
      
      if (this.messagesCallback) {
        logger.debug('📨 Calling messagesCallback with', this.messages.length, 'messages');
        this.messagesCallback([...this.messages]);
      } else {
        logger.warn('⚠️ messagesCallback is null! Message received but UI not updated');
      }
    });

    this.socket.on('message-sent', (message: Message) => {
      logger.debug('✅ MESSAGE-SENT confirmation received');
      
      // Update local messages when our message is confirmed by server
      const existingIndex = this.messages.findIndex(m => m.id === message.id);
      if (existingIndex === -1) {
        logger.debug('➕ Adding confirmed message to local array');
        this.messages.push(message);
        this.messages.sort((a, b) => a.timestamp - b.timestamp);
        if (this.messagesCallback) {
          this.messagesCallback([...this.messages]);
        }
      } else {
        logger.debug('ℹ️ Message already exists in local array, skipping');
      }
    });

    this.socket.on('user-joined', ({ userId, displayName }) => {
      logger.log(`👤 ${displayName || 'User'} joined the chat`);
      if (this.userActivityCallback) {
        this.userActivityCallback({ type: 'joined', displayName: displayName || userId, userId });
      }
      
      // REQUEST UPDATED PUBLIC KEYS WHEN NEW USER JOINS
      // This ensures all existing users get the new user's public key
      logger.debug('🔄 Requesting updated public keys after user joined');
      if (this.socket) {
        this.socket.emit('get-public-keys', {
          sessionId: this.sessionId,
          userId: this.userId
        });
      }
    });

    this.socket.on('user-left', ({ userId }) => {
      logger.log(`👋 User left the chat`);
      if (this.userActivityCallback) {
        this.userActivityCallback({ type: 'left', displayName: userId, userId });
      }
    });

    // Session error (session not found)
    this.socket.on('session-error', ({ message }) => {
      logger.error('❌ Session error:', message);
      if (this.sessionErrorCallback) {
        this.sessionErrorCallback(message);
      }
    });

    // Download notification
    this.socket.on('download-notification', ({ downloadedBy, fileName }) => {
      logger.debug('📥 Download notification received');
      
      const notificationText = `📥 ${downloadedBy} downloaded your file: ${fileName}`;
      
      // Call notification callback if set
      if (this.notificationCallback) {
        this.notificationCallback(notificationText);
      } else {
        // Fallback to alert if callback not set
        alert(notificationText);
      }
      
      // Browser notification (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📥 File Downloaded', {
          body: `${downloadedBy} downloaded ${fileName}`,
          icon: '/icon.png'
        });
      }
    });

    // Session metadata (chat mode)
    this.socket.on('session-metadata', ({ chatMode, sessionKey }) => {
      logger.log(`🎯 Session metadata received - Mode: ${chatMode}`);
      this.chatMode = chatMode;
      if (this.sessionMetadataCallback) {
        this.sessionMetadataCallback({ chatMode, encryptedSessionKey: sessionKey });
      }
    });

    // Session key available (for group mode)
    this.socket.on('session-key-available', ({ encryptedKeys }) => {
      logger.log(`🔑 Session key available for group mode`);
      if (this.sessionMetadataCallback && encryptedKeys[this.userId]) {
        this.sessionMetadataCallback({ 
          chatMode: 'group', 
          encryptedSessionKey: encryptedKeys[this.userId] 
        });
      }
    });
    
    // Typing indicators
    this.socket.on('user-typing', ({ userId, displayName }) => {
      logger.debug(`⌨️ ${displayName} is typing...`);
      if (this.userTypingCallback) {
        this.userTypingCallback({ userId, displayName });
      }
    });
    
    this.socket.on('user-stopped-typing', ({ userId, displayName }) => {
      logger.debug(`⌨️ ${displayName} stopped typing`);
      if (this.userStoppedTypingCallback) {
        this.userStoppedTypingCallback({ userId, displayName });
      }
    });
  }

  // Join session and save public key
  async savePublicKey(publicKey: string, isCreator: boolean = false): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }

    // Prevent duplicate joins
    if (this.hasJoinedSession) {
      logger.log('Already joined session, skipping...');
      return;
    }
    
    // Store isCreator flag for reconnections
    this.isCreator = isCreator;

    return new Promise((resolve, reject) => {
      // Set up error listener with timeout
      const errorTimeout = setTimeout(() => {
        reject(new Error('Session join timeout'));
      }, 5000);

      const onSessionError = (errorData: { error: string; message: string }) => {
        clearTimeout(errorTimeout);
        this.socket?.off('session-error', onSessionError);
        reject(new Error(errorData.message));
      };

      this.socket!.once('session-error', onSessionError);

      logger.log(`🔍 DEBUG - Emitting join-session:`, {
        sessionId: this.sessionId,
        userId: this.userId.substring(0, 8),
        isCreator,
        hasAuthKey: !!this.authKey,
        authKeyPreview: this.authKey?.substring(0, 4)
      });

      this.socket!.emit('join-session', {
        sessionId: this.sessionId,
        userId: this.userId,
        displayName: this.displayName,
        publicKey,
        isCreator, // Tell server if we're creating the session
        authKey: this.authKey // Send auth key to server
      });
      
      this.hasJoinedSession = true;
      
      // Wait a bit for server to process
      setTimeout(() => {
        clearTimeout(errorTimeout);
        this.socket?.off('session-error', onSessionError);
        resolve();
      }, 100);
    });
  }

  // Helper to rejoin after reconnection
  private rejoinSession() {
    if (!this.socket || !this.hasJoinedSession) return;
    
    logger.log('🔄 Rejoining session after reconnection...');
    logger.log(`🔍 DEBUG - Rejoin with authKey: ${this.authKey ? this.authKey.substring(0, 4) + '...' : 'MISSING'}, isCreator: ${this.isCreator}`);
    
    // Send same credentials as initial join
    this.socket.emit('join-session', {
      sessionId: this.sessionId,
      userId: this.userId,
      displayName: this.displayName,
      publicKey: null, // Server should keep existing key
      isCreator: this.isCreator, // ✅ Send isCreator flag
      authKey: this.authKey // ✅ Send auth key
    });
  }

  // Listen for public keys
  listenForPublicKeys(callback: (keys: PublicKey[]) => void): () => void {
    this.publicKeysCallback = callback;
    
    // Request current public keys
    if (this.socket) {
      this.socket.emit('get-public-keys', {
        sessionId: this.sessionId,
        userId: this.userId
      });
    }

    // Return cleanup function
    return () => {
      this.publicKeysCallback = null;
    };
  }

  // Send encrypted message
  async sendMessage(to: string, encryptedMessage: string, originalContent?: string, clientMessageId?: string): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }

    if (!this.socket.connected) {
      throw new Error('Socket not connected');
    }

    const type = originalContent?.startsWith('[IMAGE]') 
      ? 'image' 
      : (originalContent?.startsWith('[FILE]') ? 'file' : 'text');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message send timeout'));
      }, 10000); // 10 second timeout

      try {
        this.socket!.emit('send-message', {
          sessionId: this.sessionId,
          from: this.userId,
          to,
          encrypted: encryptedMessage,
          originalContent,
          type,
          clientMessageId // Pass client-generated message ID
        });
        
        clearTimeout(timeout);
        resolve();
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  // Listen for messages
  listenForMessages(callback: (messages: Message[]) => void): () => void {
    this.messagesCallback = callback;
    
    // Emit current messages if we have any
    if (this.messages.length > 0) {
      setTimeout(() => callback(this.messages), 0);
    }

    // Return cleanup function
    return () => {
      this.messagesCallback = null;
    };
  }

  // Listen for notifications
  onNotification(callback: (notification: string) => void): () => void {
    this.notificationCallback = callback;
    
    // Return cleanup function
    return () => {
      this.notificationCallback = null;
    };
  }

  // Listen for session errors
  onSessionError(callback: (error: string) => void): () => void {
    this.sessionErrorCallback = callback;
    
    // Return cleanup function
    return () => {
      this.sessionErrorCallback = null;
    };
  }

  // Listen for user activity (join/leave)
  onUserActivity(callback: (activity: { type: 'joined' | 'left', displayName: string, userId: string }) => void): () => void {
    this.userActivityCallback = callback;
    
    // Return cleanup function
    return () => {
      this.userActivityCallback = null;
    };
  }

  // Listen for session metadata (chat mode, session key)
  onSessionMetadata(callback: (metadata: { chatMode: 'private' | 'group', encryptedSessionKey?: string }) => void): () => void {
    this.sessionMetadataCallback = callback;
    
    // Return cleanup function
    return () => {
      this.sessionMetadataCallback = null;
    };
  }
  
  // Listen for typing indicators
  onUserTyping(callback: (data: { userId: string, displayName: string }) => void): () => void {
    this.userTypingCallback = callback;
    
    // Return cleanup function
    return () => {
      this.userTypingCallback = null;
    };
  }
  
  onUserStoppedTyping(callback: (data: { userId: string, displayName: string }) => void): () => void {
    this.userStoppedTypingCallback = callback;
    
    // Return cleanup function
    return () => {
      this.userStoppedTypingCallback = null;
    };
  }
  
  // Emit typing event
  emitTyping(): void {
    if (!this.socket || !this.socket.connected) return;
    
    this.socket.emit('typing', {
      sessionId: this.sessionId,
      userId: this.userId,
      displayName: this.displayName
    });
  }
  
  // Emit stopped typing event
  emitStoppedTyping(): void {
    if (!this.socket || !this.socket.connected) return;
    
    this.socket.emit('stopped-typing', {
      sessionId: this.sessionId,
      userId: this.userId,
      displayName: this.displayName
    });
  }

  // Set shared session key (creator only, for group mode)
  setSessionKey(encryptedKeys: Record<string, string>): void {
    if (!this.socket || !this.socket.connected) {
      logger.error('Cannot set session key - socket not connected');
      return;
    }

    logger.log('🔑 Setting shared session key for group mode');
    
    this.socket.emit('set-session-key', {
      sessionId: this.sessionId,
      encryptedKeys
    });
  }

  // Get current chat mode
  getChatMode(): 'private' | 'group' {
    return this.chatMode;
  }

  // Notify about file download
  notifyDownload(senderId: string, fileName: string): void {
    if (!this.socket || !this.socket.connected) {
      logger.error('Cannot send download notification - socket not connected');
      return;
    }

    const payload = {
      sessionId: this.sessionId,
      downloadedBy: this.displayName || this.userId,
      senderId,
      fileName,
      timestamp: Date.now()
    };

    logger.debug('📤 Sending download notification');

    this.socket.emit('file-downloaded', payload);
    
    logger.debug('✅ Download notification emitted');
  }

  // Clear session (leave)
  async clearSession(): Promise<void> {
    logger.log('🚪 Clearing session and disconnecting...');
    
    // Set flag to false FIRST to prevent auto-rejoin on reconnect
    this.hasJoinedSession = false;
    
    if (this.socket) {
      // Emit leave event if still connected
      if (this.socket.connected) {
        this.socket.emit('leave-session', {
          sessionId: this.sessionId,
          userId: this.userId
        });
      }
      
      // Disable auto-reconnection before disconnecting
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      
      logger.log('✅ Session cleared and socket disconnected');
    }
    
    // Clear all callbacks
    this.publicKeysCallback = null;
    this.messagesCallback = null;
    this.notificationCallback = null;
    this.sessionErrorCallback = null;
    this.userActivityCallback = null;
    this.messages = [];
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
