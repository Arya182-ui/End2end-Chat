import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { translateText, detectLanguage, getSupportedLanguages } from './services/translation.js';
import { moderateContent, analyzeSentiment, generateSmartReplies } from './services/moderation.js';
import { saveSessionMetadata, updateUserPresence, removeUserPresence } from './services/firebaseAdmin.js';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3001;
const DEBUG = process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const logger = {
  log: (...args) => {
    // Always log in Railway for debugging
    console.log(...args);
  },
  debug: (...args) => {
    if (DEBUG || process.env.RAILWAY_ENVIRONMENT_ID) {
      console.log('[DEBUG]', ...args);
    }
  },
  warn: (...args) => {
    // Always log warnings
    console.warn(...args);
  },
  error: (...args) => {
    // Always log errors
    console.error(...args);
  },
  info: (...args) => {
    // Always log important info
    console.log(...args);
  }
};

// Allowed origins
const allowedOrigins = [
  'https://end2end-chat.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

// Configure CORS with dynamic origin checking
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      // In production, still allow but log it
      logger.warn('CORS request from unauthorized origin:', origin);
      callback(null, true); // Allow anyway for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add body parser for JSON
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 20 * 1024 * 1024, // 20MB
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000 // 25 seconds
});

// In-memory storage for sessions
const sessions = new Map();

// Session expiry time (30 minutes of inactivity)
const SESSION_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

// Helper: Get or create session
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      publicKeys: new Map(),
      messages: [],
      members: new Map(),
      lastActivity: Date.now(), // Track last activity
      authKey: null, // Will be set by creator
      chatMode: 'group', // Default to group mode
      encryptedSessionKeys: {} 
    });
  } else {
    // Update last activity time
    const session = sessions.get(sessionId);
    session.lastActivity = Date.now();
  }
  return sessions.get(sessionId);
}

// Helper: Clean up empty sessions
function cleanupSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session && session.members.size === 0) {
    sessions.delete(sessionId);
    logger.debug(`🗑️ Session ${sessionId} deleted (no members)`);
  }
}

// Auto-cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [sessionId, session] of sessions.entries()) {
    const inactiveTime = now - session.lastActivity;
    
    // Delete session if:
    // 1. No members AND inactive for more than expiry time
    // 2. OR has members but inactive for more than 2 hours (likely orphaned)
    if (
      (session.members.size === 0 && inactiveTime > SESSION_EXPIRY_TIME) ||
      (inactiveTime > SESSION_EXPIRY_TIME * 4) // 2 hours
    ) {
      sessions.delete(sessionId);
      cleanedCount++;
      logger.debug(`🗑️ Auto-cleaned expired session ${sessionId} (inactive for ${Math.round(inactiveTime / 60000)} minutes)`);
    }
  }
  
  if (cleanedCount > 0) {
    logger.debug(`🧹 Cleaned ${cleanedCount} expired session(s). Active sessions: ${sessions.size}`);
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.debug(`Client connected: ${socket.id}`);
  
  let currentSession = null;
  let currentUserId = null;

  // Join a chat session
  socket.on('join-session', ({ sessionId, userId, displayName, publicKey, isCreator, authKey }) => {
    logger.debug(`User ${userId?.substring(0,8)} joining session ${sessionId?.substring(0,8)} (isCreator: ${isCreator})`);
    logger.debug(`🔍 DEBUG - Received authKey parameter:`, authKey ? `${authKey.substring(0, 4)}...` : 'MISSING');
    
    // Extract session ID and auth key
    let actualSessionId = sessionId;
    let providedKey = authKey; // Start with explicit authKey parameter
    let providedPassword = null; // For password-protected rooms
    
    // If sessionId contains ":" format, extract parts
    if (sessionId.includes(':')) {
      const parts = sessionId.split(':');
      actualSessionId = parts[0];
      
      // Check if it's password room format: "sessionId:password:base64hash"
      if (parts[1] === 'password' && parts[2]) {
        providedPassword = parts[2]; // Base64 encoded password
        logger.log(`🔑 Password room join attempt - password provided`);
      } else if (!providedKey && parts[1]) {
        // Regular format: "sessionId:authKey"
        providedKey = parts[1];
        logger.log(`🔍 DEBUG - Extracted key from sessionId:`, providedKey.substring(0, 4) + '...');
      }
    }
    
    logger.log(`🔍 DEBUG - Final providedKey:`, providedKey ? `${providedKey.substring(0, 4)}...` : 'MISSING');
    logger.log(`🔍 DEBUG - actualSessionId:`, actualSessionId);
    
    // If not the creator, check if session exists
    if (!isCreator && !sessions.has(actualSessionId)) {
      logger.log(`Session ${actualSessionId} does not exist`);
      socket.emit('session-error', {
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found. Please check the session link.'
      });
      return;
    }
    
    const session = getSession(actualSessionId);
    logger.log(`🔍 DEBUG - Session authKey:`, session.authKey ? `${session.authKey.substring(0, 4)}...` : 'NOT SET');
    logger.log(`🔍 DEBUG - Session mode:`, session.chatMode);
    
    // If creator, set the auth key (or confirm it matches reserved key)
    if (isCreator) {
      if (session.authKey && session.authKey !== providedKey) {
        logger.log(`❌ Creator provided wrong key for reserved session ${actualSessionId}`);
        logger.log(`❌ Expected: ${session.authKey}, Got: ${providedKey}`);
        socket.emit('session-error', {
          error: 'INVALID_KEY',
          message: 'Session key mismatch. This should not happen.'
        });
        return;
      }
      
      if (!session.authKey) {
        session.authKey = providedKey;
      }
      
      // Mark session as active (creator joined)
      session.reserved = false;
      logger.log(`🔑 Session ${actualSessionId} activated by creator`);
      
      // ✅ Allow creator to join immediately - skip auth validation for creator
      // Creator can join their own reserved session without waiting for others
    }
    
    // If not creator, validate auth key or password
    // Also skip validation if session is still reserved (waiting for creator to join)
    if (!isCreator && session.authKey && !session.reserved) {
      // Check if it's a password-protected room
      if (session.chatMode === 'password' && providedPassword) {
        // Extract password hash from stored authKey (format: "authKey:passwordHash")
        const storedAuthParts = session.authKey.split(':');
        const storedPasswordHash = storedAuthParts[1];
        
        if (storedPasswordHash !== providedPassword) {
          logger.log(`❌ Invalid password for password-protected room ${actualSessionId}`);
          socket.emit('session-error', {
            error: 'INVALID_PASSWORD',
            message: 'Incorrect password. Please check and try again.'
          });
          return;
        }
        
        // Password correct - set providedKey to the actual authKey for later use
        providedKey = session.authKey;
        logger.log(`✅ Password validated for room ${actualSessionId}`);
      } else if (session.authKey !== providedKey) {
        // Regular auth key validation
        logger.log(`❌ Invalid auth key for session ${actualSessionId}`);
        socket.emit('session-error', {
          error: 'INVALID_KEY',
          message: 'Invalid authentication key. Please check your link and try again.'
        });
        return;
      }
      logger.log(`✅ Auth key validated for session ${actualSessionId}`);
    } else if (!isCreator && session.reserved) {
      logger.log(`⚠️ Non-creator trying to join reserved session - waiting for creator`);
      socket.emit('session-error', {
        error: 'SESSION_NOT_ACTIVE',
        message: 'Room not active yet. Please wait for the creator to join first.'
      });
      return;
    }
    
    // Check member limit for private mode BEFORE joining or reconnecting
    if (session.chatMode === 'private' || session.chatMode === 'password') {
      const existingMember = session.members.get(userId);
      
      logger.log(`🔍 ${session.chatMode.toUpperCase()} MODE CHECK - userId: ${userId.substring(0,8)}`);
      logger.log(`   Existing member: ${existingMember ? 'YES' : 'NO'}`);
      logger.log(`   Current members: ${session.members.size}/2`);
      logger.log(`   Member IDs:`, Array.from(session.members.keys()).map(id => id.substring(0,8)));
      
      // If user is NOT already a member AND session has 2 members, reject
      if (!existingMember && session.members.size >= 2) {
        logger.log(`❌ BLOCKING - ${session.chatMode} session ${actualSessionId} is full (${session.members.size}/2 members)`);
        logger.log(`   Existing members:`, Array.from(session.members.keys()).map(id => id.substring(0,8)));
        logger.log(`   Trying to join: ${userId.substring(0,8)}`);
        socket.emit('session-error', {
          error: 'SESSION_FULL',
          message: 'This room is full. Only 2 members allowed.'
        });
        return;
      }
      logger.log(`✅ ALLOWED - User ${existingMember ? 'rejoining' : 'joining as new member'}`);
    }
    
    currentSession = actualSessionId;
    currentUserId = userId;
    
    // Join Socket.IO room
    socket.join(actualSessionId);
    
    // Check if user is already in session (prevent duplicate joins)
    const existingMember = session.members.get(userId);
    if (existingMember && existingMember.socketId !== socket.id) {
      logger.log(`User ${userId} reconnecting with new socket`);
      // Update socket ID for existing user
      session.members.set(userId, {
        socketId: socket.id,
        displayName: displayName || existingMember.displayName,
        joinedAt: existingMember.joinedAt
      });
    } else if (!existingMember) {
      // New user joining
      session.members.set(userId, {
        socketId: socket.id,
        displayName,
        joinedAt: Date.now()
      });
      
      // Notify others that a new user joined
      socket.to(actualSessionId).emit('user-joined', {
        userId,
        displayName,
        timestamp: Date.now()
      });
    }
    
    // Store/update public key if provided
    if (publicKey) {
      session.publicKeys.set(userId, {
        userId,
        publicKey,
        displayName,
        joinedAt: Date.now()
      });
    }
    
    // Send existing messages to the joining user
    // Only send messages that are relevant for this user:
    // - messages explicitly sent to this user (to === userId)
    // - messages that were broadcast to all (to === 'all' or no 'to')
    // - messages sent by this user (so their own history shows up)
    const userMessages = session.messages.filter(msg => {
      if (!msg.to) return true; // treat missing 'to' as broadcast
      if (msg.to === 'all') return true;
      if (msg.to === userId) return true;
      if (msg.from === userId) return true;
      return false;
    });
    logger.log(`Sending ${userMessages.length} messages to user ${userId} (session total: ${session.messages.length})`);
    socket.emit('messages-history', userMessages);
    
    // Send session metadata including chat mode
    socket.emit('session-metadata', {
      chatMode: session.chatMode || 'group',
      encryptedSessionKey: session.encryptedSessionKeys ? session.encryptedSessionKeys[userId] : null
    });
    
    // Broadcast updated public keys to all users in the session
    const publicKeysArray = Array.from(session.publicKeys.values());
    logger.log(`🔑 Broadcasting ${publicKeysArray.length} public keys to all users in session ${actualSessionId}`);
    io.to(actualSessionId).emit('public-keys-updated', publicKeysArray);
    
    logger.log(`Session ${actualSessionId} now has ${session.members.size} member(s) (mode: ${session.chatMode || 'group'})`);
  });

  // Save/update public key
  socket.on('save-public-key', ({ sessionId, userId, publicKey, displayName }) => {
    // Extract actual session ID (remove auth key if present)
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    session.publicKeys.set(userId, {
      userId,
      publicKey,
      displayName,
      joinedAt: Date.now()
    });
    
    // Broadcast updated public keys to all users in the session
    const publicKeysArray = Array.from(session.publicKeys.values());
    logger.log(`🔑 [save-public-key] Broadcasting ${publicKeysArray.length} public keys to session ${actualSessionId}`);
    io.to(actualSessionId).emit('public-keys-updated', publicKeysArray);
    
    logger.log(`Public key saved for user ${userId} in session ${actualSessionId}`);
  });

  // Set shared session key (group mode only, creator only)
  socket.on('set-session-key', ({ sessionId, encryptedKeys }) => {
    // Extract actual session ID
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    if (session.chatMode !== 'group') {
      logger.log(`⚠️ Attempted to set session key for non-group session ${actualSessionId}`);
      return;
    }
    
    // Store encrypted keys (map of userId -> encrypted session key)
    session.encryptedSessionKeys = encryptedKeys;
    
    logger.log(`🔑 Session key set for group session ${actualSessionId}`);
    
    // Broadcast encrypted session keys to all members
    io.to(actualSessionId).emit('session-key-available', { encryptedKeys });
  });

  // Send message
  socket.on('send-message', ({ sessionId, from, to, encrypted, originalContent, type, clientMessageId }) => {
    // Extract actual session ID (remove auth key if present)
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    // Get sender's display name
    const senderMember = session.members.get(from);
    const senderDisplayName = senderMember?.displayName;
    
    // Use client-provided message ID if available, otherwise generate server-side
    const messageId = clientMessageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create message object with THIS recipient's encrypted payload
    const message = {
      id: messageId,
      from,
      to,
      encrypted, // This encrypted payload is specifically for THIS recipient
      timestamp: Date.now(),
      type: type || 'text',
      originalContent,
      senderDisplayName
    };
    
    // Store message ONLY if this is the first encrypted copy we're seeing for this message ID
    const existingMessage = session.messages.find(m => m.id === messageId);
    if (!existingMessage) {
      // Store first encrypted copy (doesn't matter which recipient's version)
      session.messages.push(message);
      if (DEBUG) logger.log(`💾 Stored message ${messageId.substring(0,12)}...`);
    }
    
    logger.log(`📤 send-message from ${from} to ${to} (msgId: ${messageId.substring(0,12)}..., mode: ${session.chatMode})`);
    if (DEBUG) {
      logger.log(`📋 Session members:`, Array.from(session.members.keys()).map(id => `${id.substring(0,8)}...`));
      logger.log(`📋 Sender socket: ${socket.id}, Recipient: ${to}`);
    }

    // GROUP MODE: Broadcast to everyone (message encrypted with shared session key)
    // PRIVATE/PASSWORD MODE: Send only to specific recipient (message encrypted with recipient's RSA key)
    if (session.chatMode === 'group' && (!to || to === 'all')) {
      // Group chat - broadcast to all other members
      socket.to(actualSessionId).emit('new-message', message);
      if (DEBUG) logger.log(`📢 Broadcasting to all members in group session`);
    } else if (to && to !== 'all') {
      // Private/Password 1-to-1 message - send only to specific recipient
      const recipientMember = session.members.get(to);
      if (recipientMember) {
        logger.log(`✅ Sending to recipient ${to.substring(0,8)}... (socket ${recipientMember.socketId})`);
        io.to(recipientMember.socketId).emit('new-message', message);
      } else {
        logger.log(`⚠️ Recipient ${to.substring(0,8)}... not found in session ${actualSessionId}`);
        logger.log(`   Available members:`, Array.from(session.members.keys()).map(id => id.substring(0,8)));
      }
    } else {
      // Fallback: broadcast to session
      logger.log(`📢 Fallback broadcast (to=${to})`);
      socket.to(actualSessionId).emit('new-message', message);
    }

    // Send confirmation back to sender (only once per unique message ID)
    if (!existingMessage) {
      socket.emit('message-sent', message);
    }

    logger.log(`Message from ${senderDisplayName || from} processed for session ${actualSessionId}`);
  });

  // Request public keys
  socket.on('get-public-keys', ({ sessionId, userId }) => {
    // Extract actual session ID (remove auth key if present)
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    // Filter out requesting user's own key
    const publicKeysArray = Array.from(session.publicKeys.values())
      .filter(key => key.userId !== userId);
    
    logger.log(`🔑 [get-public-keys] Sending ${publicKeysArray.length} public keys to user ${userId.substring(0,8)}...`);
    socket.emit('public-keys-updated', publicKeysArray);
  });

  // Handle file download notification
  socket.on('file-downloaded', ({ sessionId, downloadedBy, senderId, fileName, timestamp }) => {
    logger.log(`📥 File download event received:`, { sessionId, downloadedBy, senderId, fileName });
    
    // Extract actual session ID (remove auth key if present)
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    // Find the sender's socket and notify them
    const senderMember = session.members.get(senderId);
    logger.log(`Looking for sender ${senderId}:`, senderMember ? 'Found' : 'Not found');
    
    if (senderMember) {
      logger.log(`Emitting download-notification to socket ${senderMember.socketId}`);
      io.to(senderMember.socketId).emit('download-notification', {
        downloadedBy,
        fileName,
        timestamp
      });
      logger.log(`✅ Notification sent: ${downloadedBy} downloaded ${fileName} from ${senderId}`);
    } else {
      console.error(`❌ Sender ${senderId} not found in session ${sessionId}`);
      logger.log('Session members:', Array.from(session.members.keys()));
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.log(`Client disconnected: ${socket.id}`);
    
    if (currentSession && currentUserId) {
      const session = getSession(currentSession);
      
      // Remove user from session
      session.members.delete(currentUserId);
      session.publicKeys.delete(currentUserId);
      
      // Notify others
      socket.to(currentSession).emit('user-left', {
        userId: currentUserId,
        timestamp: Date.now()
      });
      
      // Broadcast updated public keys
      const publicKeysArray = Array.from(session.publicKeys.values());
      io.to(currentSession).emit('public-keys-updated', publicKeysArray);
      
      logger.log(`User ${currentUserId} left session ${currentSession}`);
      
      // Cleanup empty session
      cleanupSession(currentSession);
    }
  });

  // Manual leave session
  socket.on('leave-session', ({ sessionId, userId }) => {
    // Extract actual session ID (remove auth key if present)
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    const session = getSession(actualSessionId);
    
    if (session) {
      const member = session.members.get(userId);
      const displayName = member?.displayName;
      session.members.delete(userId);
      session.publicKeys.delete(userId);
      socket.to(actualSessionId).emit('user-left', {
        userId,
        displayName,
        timestamp: Date.now()
      });
      
      const publicKeysArray = Array.from(session.publicKeys.values());
      io.to(actualSessionId).emit('public-keys-updated', publicKeysArray);
      
      socket.leave(actualSessionId);
      
      cleanupSession(actualSessionId);
      
      logger.log(`User ${userId} manually left session ${actualSessionId}`);
    }
  });
  
  // Typing indicators
  socket.on('typing', ({ sessionId, userId, displayName }) => {
    // Extract actual session ID
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    // Broadcast to all users in session EXCEPT sender
    socket.to(actualSessionId).emit('user-typing', {
      userId,
      displayName
    });
  });
  
  socket.on('stopped-typing', ({ sessionId, userId, displayName }) => {
    // Extract actual session ID
    let actualSessionId = sessionId;
    if (sessionId.includes(':')) {
      actualSessionId = sessionId.split(':')[0];
    }
    
    // Broadcast to all users in session EXCEPT sender
    socket.to(actualSessionId).emit('user-stopped-typing', {
      userId,
      displayName
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    sessions: sessions.size,
    timestamp: Date.now()
  });
});

// Handle OPTIONS requests explicitly for all API routes
app.options('*', cors());

// Root health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'End2End Chat Server',
    uptime: process.uptime(),
    activeSessions: sessions.size,
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: IS_PRODUCTION ? 'production' : 'development'
  });
});

// Keep Railway alive - prevent sleeping
app.get('/ping', (req, res) => {
  res.json({ 
    ping: 'pong',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Reserve session endpoint (called when creator creates session link)
app.post('/api/reserve-session', express.json(), (req, res) => {
  try {
    const { sessionId, authKey, chatMode } = req.body;
    
    if (!sessionId || !authKey) {
      return res.status(400).json({ error: 'Missing sessionId or authKey' });
    }
    
    // Check if session already exists
    if (sessions.has(sessionId)) {
      return res.status(409).json({ error: 'Session already exists' });
    }
  
  // Create reserved session with chat mode (default to 'group' if not specified)
  sessions.set(sessionId, {
    publicKeys: new Map(),
    messages: [],
    members: new Map(),
    lastActivity: Date.now(),
    authKey: authKey,
    reserved: true, // Mark as reserved (creator hasn't joined yet)
    chatMode: chatMode || 'group', // 'group' or 'private'
    encryptedSessionKeys: {} // For group mode: userId -> encrypted session key mapping
  });
  
  logger.log(`🔒 Session ${sessionId} reserved (mode: ${chatMode || 'group'}, waiting for creator)`);
  
  res.json({ 
    success: true, 
    sessionId,
    chatMode: chatMode || 'group',
    message: 'Session reserved successfully' 
  });
  } catch (error) {
    logger.error('Error reserving session:', error);
    res.status(500).json({ error: 'Failed to reserve session', message: error.message });
  }
});

// Get session info (for debugging)
app.get('/sessions', (req, res) => {
  const sessionInfo = Array.from(sessions.entries()).map(([id, session]) => ({
    sessionId: id,
    members: session.members.size,
    messages: session.messages.length,
    publicKeys: session.publicKeys.size
  }));
  res.json(sessionInfo);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    activeSessions: sessions.size,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Google Technologies API Endpoints
// ============================================

// Translation API endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);
    res.json({ translatedText });
  } catch (error) {
    logger.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Language detection endpoint
app.post('/api/detect-language', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    const language = await detectLanguage(text);
    res.json({ language });
  } catch (error) {
    logger.error('Language detection error:', error);
    res.status(500).json({ error: 'Language detection failed' });
  }
});

// Get supported languages
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await getSupportedLanguages();
    res.json({ languages });
  } catch (error) {
    logger.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

// Content moderation endpoint
app.post('/api/moderate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    const result = await moderateContent(text);
    res.json(result);
  } catch (error) {
    logger.error('Moderation error:', error);
    res.status(500).json({ error: 'Moderation failed' });
  }
});

// Sentiment analysis endpoint
app.post('/api/sentiment', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    const result = await analyzeSentiment(text);
    res.json(result);
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

// Smart replies endpoint
app.post('/api/smart-replies', async (req, res) => {
  try {
    const { messageHistory, count } = req.body;
    
    if (!messageHistory || !Array.isArray(messageHistory)) {
      return res.status(400).json({ error: 'Missing or invalid messageHistory parameter' });
    }
    
    const replies = await generateSmartReplies(messageHistory, count || 3);
    res.json({ replies });
  } catch (error) {
    logger.error('Smart replies error:', error);
    res.status(500).json({ error: 'Smart replies generation failed' });
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.log('SIGTERM received, closing server gracefully...');
  httpServer.close(() => {
    logger.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.log('SIGINT received, closing server gracefully...');
  httpServer.close(() => {
    logger.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('❌ UNCAUGHT EXCEPTION:', err);
  logger.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
  logger.error('Stack:', reason?.stack);
});

// Environment validation for Railway
logger.info('🔍 Environment Check:');
logger.info(`- NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`- PORT: ${PORT}`);
logger.info(`- IS_PRODUCTION: ${IS_PRODUCTION}`);
logger.info(`- Railway Environment: ${process.env.RAILWAY_ENVIRONMENT_ID ? 'YES' : 'NO'}`);
logger.info(`- Firebase Project: ${process.env.FIREBASE_PROJECT_ID || 'NOT SET'}`);

// Start the server
httpServer.listen(PORT, '0.0.0.0', () => {
  logger.log(`🚀 End2End Chat Server running on port ${PORT}`);
  logger.log(`🌐 Environment: ${IS_PRODUCTION ? 'production' : 'development'}`);
  logger.log(`📡 WebSocket server ready for connections`);
  logger.log(`🏥 Health check available at /health`);
  logger.log(`⚡ Keep-alive endpoint at /ping`);
  
  // Auto health check every 2 minutes to prevent server sleep
  if (IS_PRODUCTION) {
    setInterval(async () => {
      try {
        const serverUrl = process.env.RAILWAY_STATIC_URL || 
                         process.env.RENDER_EXTERNAL_URL || 
                         'https://end2end-chat.onrender.com';
        
        // Simple HTTP request to keep server alive
        const url = new URL(`${serverUrl}/health`);
        const client = url.protocol === 'https:' ? https : http;
        
        const options = {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: 'GET',
          timeout: 10000
        };
        
        const req = client.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.status === 'ok') {
                logger.debug('✅ Auto health check successful');
              } else {
                logger.warn('⚠️ Auto health check failed:', response);
              }
            } catch (e) {
              logger.debug('✅ Auto health check completed');
            }
          });
        });
        
        req.on('error', (error) => {
          logger.error('❌ Auto health check error:', error.message);
        });
        
        req.on('timeout', () => {
          logger.warn('⚠️ Auto health check timeout');
          req.destroy();
        });
        
        req.end();
      } catch (error) {
        logger.error('❌ Auto health check setup error:', error.message);
      }
    }, 2 * 60 * 1000); // Every 2 minutes
    
    logger.log('⏰ Auto health check started (every 2 minutes)');
  }
}).on('error', (err) => {
  logger.error('❌ Server failed to start:', err);
  process.exit(1);
});

