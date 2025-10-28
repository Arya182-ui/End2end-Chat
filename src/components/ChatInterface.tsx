import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, ShieldCheck, Users, X, Key, Image, AlertTriangle } from 'lucide-react';
import { WebSocketService, Message, PublicKey } from '../services/websocket';
import { CryptoService, KeyPair, HybridCryptoService } from '../crypto/encryption';
import { GroupCryptoService } from '../crypto/groupEncryption';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  sessionId: string;
  userId: string;
  userName?: string;
  isCreator?: boolean;
  onLeave: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId, userId, userName, isCreator = false, onLeave }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [peers, setPeers] = useState<PublicKey[]>([]);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isKeyGenerated, setIsKeyGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Dual-mode chat states
  const [chatMode, setChatMode] = useState<'private' | 'group' | 'password' | null>(null);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [isSessionKeyReady, setIsSessionKeyReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captionText, setCaptionText] = useState<string>('');
  const wsService = useRef<WebSocketService | null>(null);
  const isInitializedRef = useRef(false);
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, timestamp: number}>>([]);
  
  // Track shown activity notifications to prevent duplicates (stores activityKey -> timestamp)
  const shownActivityRef = useRef<Map<string, number>>(new Map());
  
  // Typing indicator state
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Screenshot protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Print Screen, Ctrl+P, Cmd+Shift+3/4/5 (Mac screenshots)
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        e.preventDefault();
        
        // Clear clipboard immediately
        setTimeout(() => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('🚫 Screenshots disabled for privacy').catch(() => {});
          }
        }, 10);
        
        alert('🚫 Screenshots are disabled for privacy protection');
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Detect Print Screen release
      if (e.key === 'PrintScreen') {
        // Clear clipboard after Print Screen
        setTimeout(() => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(() => {});
          }
        }, 100);
        
        alert('🚫 Screenshot attempt detected and blocked!');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect focus loss (might indicate screenshot tool usage)
    const handleBlur = () => {
      // Silent in production - no console warnings
    };

    // Monitor clipboard changes
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        alert('🚫 Copying media is disabled');
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleBlur);

    // Disable drag and drop of images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    document.addEventListener('dragstart', handleDragStart);

    // Add watermark overlay to prevent screenshots
    const style = document.createElement('style');
    style.innerHTML = `
      .chat-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(255, 255, 255, 0.02) 100px,
          rgba(255, 255, 255, 0.02) 200px
        );
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleBlur);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (isInitializedRef.current) {
      return;
    }
    
    isInitializedRef.current = true;
    initializeChat();

    // Cleanup function - called when component unmounts
    return () => {
      // Silent cleanup in production
      
      // Only cleanup on actual unmount
      if (wsService.current) {
        wsService.current.clearSession();
        wsService.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [sessionId, userId]);

  // Handle page unload/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Warn user if they're in an active chat
      if (wsService.current?.isConnected() && peers.length > 0) {
        const message = 'You are in an active chat. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handleUnload = () => {
      // Clean up on page close
      if (wsService.current) {
        wsService.current.clearSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [peers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate and distribute session key when creator joins group chat
  useEffect(() => {
    const generateAndDistributeSessionKey = async () => {
      // Only run if:
      // 1. User is creator
      // 2. Chat mode is group
      // 3. WebSocket service is available
      // 4. KeyPair is generated
      if (!isCreator || chatMode !== 'group' || !wsService.current || !keyPair) {
        return;
      }

      try {
        // Generate or reuse existing session key
        let currentSessionKey = sessionKey;
        if (!currentSessionKey) {
          currentSessionKey = await GroupCryptoService.generateSessionKey();
          setSessionKey(currentSessionKey);
          setIsSessionKeyReady(true);
        }
        
        // Encrypt session key for each peer (including self)
        const encryptedKeys: Record<string, string> = {};
        
        // Encrypt for self
        const selfPublicKey = await CryptoService.exportPublicKey(keyPair.publicKey);
        const importedSelfKey = await CryptoService.importPublicKey(selfPublicKey);
        encryptedKeys[userId] = await GroupCryptoService.encryptSessionKeyForMember(
          currentSessionKey,
          importedSelfKey
        );
        
        // Encrypt for each peer
        for (const peer of peers) {
          try {
            const peerPublicKey = await CryptoService.importPublicKey(peer.publicKey);
            encryptedKeys[peer.userId] = await GroupCryptoService.encryptSessionKeyForMember(
              currentSessionKey,
              peerPublicKey
            );
          } catch (error) {
            console.error(`Failed to encrypt session key for peer ${peer.userId}:`, error);
          }
        }
        
        // Distribute encrypted session keys to all members
        wsService.current.setSessionKey(encryptedKeys);
        
      } catch (error) {
        console.error('❌ Failed to generate/distribute session key:', error);
      }
    };

    generateAndDistributeSessionKey();
  }, [isCreator, chatMode, peers, keyPair, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Prevent re-initialization if already connected
      if (wsService.current?.isConnected()) {
        return;
      }

      // Generate RSA key pair
      const generatedKeyPair = await CryptoService.generateKeyPair();
      setKeyPair(generatedKeyPair);
      setIsKeyGenerated(true);

      // Initialize WebSocket service
      wsService.current = new WebSocketService(sessionId, userId, userName);

      // ⚠️ IMPORTANT: Set up listeners BEFORE joining session
      // Otherwise messages-history event will fire before callback is set
      
      // Listen for peer public keys
      wsService.current.listenForPublicKeys((keys) => {
        setPeers(keys);
      });

      // Listen for messages
      wsService.current.listenForMessages((msgs) => {
        setMessages(msgs);
        
        // Check if any messages might fail decryption (received before current session)
        if (msgs.length > 0) {
          const hasOldMessages = msgs.some(m => !m.originalContent && m.to === userId);
          if (hasOldMessages && !showRefreshWarning) {
            setShowRefreshWarning(true);
            // Auto-hide after 8 seconds
            setTimeout(() => setShowRefreshWarning(false), 8000);
          }
        }
      });

      // Listen for download notifications
      wsService.current.onNotification((notification) => {
        const notifId = `notif-${Date.now()}`;
        setNotifications(prev => [...prev, { id: notifId, message: notification, timestamp: Date.now() }]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);
      });

      // Listen for user join/leave activity
      wsService.current.onUserActivity((activity) => {
        // Create unique key for this activity to prevent duplicates
        const activityKey = `${activity.type}-${activity.userId}`;
        
        // Check if we've already shown this exact activity recently (within last 2 seconds)
        const now = Date.now();
        const recentActivities = Array.from(shownActivityRef.current.entries())
          .filter(([_, timestamp]) => now - timestamp < 2000);
        
        // Check if this activity was recently shown
        const wasRecentlyShown = recentActivities.some(([key]) => key === activityKey);
        if (wasRecentlyShown) {
          return;
        }
        
        // Mark as shown with timestamp
        shownActivityRef.current.set(activityKey, now);
        
        // Auto-cleanup old entries (keep only last 20)
        if (shownActivityRef.current.size > 20) {
          const entries = Array.from(shownActivityRef.current.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);
          shownActivityRef.current = new Map(entries);
        }
        
        const activityMessage = activity.type === 'joined' 
          ? `👤 ${activity.displayName} joined the chat`
          : `👋 ${activity.displayName} left the chat`;
        
        const notifId = `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setNotifications(prev => [...prev, { id: notifId, message: activityMessage, timestamp: Date.now() }]);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 4000);
      });
      
      // Listen for typing indicators
      wsService.current.onUserTyping((data) => {
        // Don't show own typing indicator
        if (data.userId === userId) return;
        
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(data.displayName || data.userId);
          return newSet;
        });
      });
      
      wsService.current.onUserStoppedTyping((data) => {
        // Don't process own events
        if (data.userId === userId) return;
        
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.displayName || data.userId);
          return newSet;
        });
      });

      // Listen for session metadata (chat mode, session key)
      wsService.current.onSessionMetadata(async (metadata) => {
        // Update chat mode from server
        setChatMode(metadata.chatMode);
        
        // Handle group mode session key
        if (metadata.chatMode === 'group') {
          if (metadata.encryptedSessionKey) {
            try {
              const decryptedKey = await GroupCryptoService.decryptSessionKey(
                metadata.encryptedSessionKey,
                generatedKeyPair.privateKey
              );
              setSessionKey(decryptedKey);
              setIsSessionKeyReady(true);
            } catch (error) {
              console.error('❌ Failed to decrypt session key:', error);
            }
          }
        } else if (metadata.chatMode === 'private' || metadata.chatMode === 'password') {
          // Private/Password mode doesn't use session key - mark as ready immediately
          setIsSessionKeyReady(true);
          setSessionKey(null);
        }
      });

      // Listen for session errors (e.g., full session)
      wsService.current.onSessionError((errorMessage) => {
        console.error('❌ Session error:', errorMessage);
        alert(`❌ ${errorMessage}`);
        onLeave();
      });

      // Now join session and save public key
      // This will trigger messages-history event from server
      const publicKeyString = await CryptoService.exportPublicKey(generatedKeyPair.publicKey);
      await wsService.current.savePublicKey(publicKeyString, isCreator);

    } catch (error) {
      console.error('Error initializing chat:', error);
      
      // If session not found, show error and go back to setup
      if (error instanceof Error && error.message.includes('Session not found')) {
        alert('❌ Session not found. Please check the session code and try again.');
        onLeave();
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    const hasContent = newMessage.trim() || captionText.trim() || selectedFile;
    if (!hasContent || !keyPair || !wsService.current || peers.length === 0) return;

    setIsEncrypting(true);

    try {
      let messageContent = '';
      
      // Handle file upload with optional caption
      if (selectedFile) {
        try {
          const base64File = await convertFileToBase64(selectedFile);
          const fileType = selectedFile.type;
          const fileName = selectedFile.name;
          const caption = captionText.trim() || newMessage.trim();
          
          // Determine message type based on MIME type
          if (fileType.startsWith('image/')) {
            messageContent = `[IMAGE]${base64File}${caption ? `|CAPTION|${caption}` : ''}`;
          } else if (fileType.startsWith('video/')) {
            messageContent = `[VIDEO]${fileName}:${base64File}${caption ? `|CAPTION|${caption}` : ''}`;
          } else if (fileType.startsWith('audio/')) {
            messageContent = `[AUDIO]${fileName}:${base64File}${caption ? `|CAPTION|${caption}` : ''}`;
          } else {
            messageContent = `[FILE]${fileName}:${fileType}:${base64File}${caption ? `|CAPTION|${caption}` : ''}`;
          }
        } catch (fileError) {
          console.error('File processing error:', fileError);
          alert('❌ Failed to process file. The file might be corrupted or too large.');
          setIsEncrypting(false);
          return;
        }
      } else {
        // Plain text message
        messageContent = newMessage.trim();
      }
      
      // DUAL-MODE CHAT: Conditional encryption based on chat mode
      
      // Wait for chat mode to be set by server
      if (!chatMode) {
        alert('⏳ Connecting to session. Please wait a moment and try again.');
        setIsEncrypting(false);
        return;
      }
      
      // Important: Generate a SINGLE message ID on client side
      const clientMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      if (chatMode === 'group') {
        // GROUP MODE: Encrypt once with shared session key, broadcast to all
        if (!sessionKey || !isSessionKeyReady) {
          alert('⏳ Session key is being set up. Please wait a moment and try again.');
          setIsEncrypting(false);
          return;
        }
        
        try {
          const encryptedMessage = await GroupCryptoService.encryptMessage(messageContent, sessionKey);
          
          // Send to 'all' - server will broadcast to everyone in the session
          await wsService.current.sendMessage('all', encryptedMessage, messageContent, clientMessageId);
        } catch (error) {
          console.error('❌ Failed to encrypt/send group message:', error);
          alert('❌ Failed to send message. Please try again.');
          setIsEncrypting(false);
          return;
        }
        
      } else {
        // PRIVATE/PASSWORD MODE: Encrypt per-peer with their public key, send individually
        
        if (peers.length === 0) {
          alert('⚠️ No other members in the chat. Please wait for someone to join.');
          setIsEncrypting(false);
          return;
        }
        
        for (const peer of peers) {
          try {
            const recipientPublicKey = await CryptoService.importPublicKey(peer.publicKey);
            
            // Encrypt message with this peer's public key
            const encryptedMessage = await HybridCryptoService.encryptLargeMessage(messageContent, recipientPublicKey);
            
            // Send encrypted message to this specific peer
            // Pass the client message ID so server can dedupe
            await wsService.current.sendMessage(peer.userId, encryptedMessage, messageContent, clientMessageId);
          } catch (peerError) {
            console.error(`Failed to send to peer ${peer.userId}:`, peerError);
            // Continue sending to other peers even if one fails
          }
        }
      }

      // Clear input after successful send
      setNewMessage('');
      setCaptionText('');
      setSelectedFile(null);
      setFilePreview(null);
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      wsService.current?.emitStoppedTyping();

    } catch (error) {
      console.error('Failed to send message:', error);
      alert('❌ Failed to send message. Please try again.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB to prevent connection issues)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File too large! Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setCaptionText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎬';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    if (fileType.includes('apk')) return '📱';
    return '📎';
  };
  
  // Handle typing indicator
  const handleTyping = () => {
    if (!wsService.current) return;
    
    // Emit typing event
    wsService.current.emitTyping();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      wsService.current?.emitStoppedTyping();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = async () => {
    // Clear WebSocket connection
    if (wsService.current) {
      await wsService.current.clearSession();
      wsService.current = null;
    }
    
    // Clear local state
    setMessages([]);
    setPeers([]);
    setKeyPair(null);
    setIsKeyGenerated(false);
    
    // Go back to setup
    onLeave();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
    <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-xl border-b border-gray-700 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-xl font-bold text-white truncate">
              <span className="hidden sm:inline">Session ID: </span>
              <span className="font-mono text-xs sm:text-base">{sessionId.substring(0, 8)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            {/* Chat Mode Indicator */}
            {chatMode === 'group' ? (
              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-medium">Group</span>
              </div>
            ) : chatMode === 'private' ? (
              <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-medium">Private</span>
              </div>
            ) : chatMode === 'password' ? (
              <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-medium">Password</span>
              </div>
            ) : null}
            {isKeyGenerated ? (
              <div className="flex items-center gap-1 text-green-400">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Encrypted</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-400 animate-pulse">
                <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Generating...</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{peers.length + 1}</span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md"
            title="Leave chat"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {/* Download Notifications */}
        <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 space-y-2 max-w-[90vw] sm:max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-blue-600/95 backdrop-blur-sm border border-blue-400 rounded-lg p-2 sm:p-3 shadow-lg animate-fade-in flex items-center gap-2 sm:gap-3"
            >
              <div className="text-xl sm:text-2xl flex-shrink-0">📥</div>
              <div className="flex-1 text-white text-xs sm:text-sm font-medium min-w-0">
                {notif.message}
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-blue-200 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Refresh Warning Banner */}
        {showRefreshWarning && (
          <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm min-w-0">
              <p className="text-yellow-200 font-semibold">Previous messages cannot be decrypted</p>
              <p className="text-yellow-300 text-xs mt-1">
                Messages sent before this page refresh were encrypted with a different key. 
                New messages will work normally.
              </p>
            </div>
            <button 
              onClick={() => setShowRefreshWarning(false)}
              className="text-yellow-400 hover:text-yellow-300 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {peers.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 px-4">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Waiting for others to join...</p>
            <p className="text-xs sm:text-sm mt-2">
              Share the session code: <code className="bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm break-all">{sessionId}</code>
            </p>
          </div>
        ) : (
          messages?.map((message) => {
            const isOwn = message.from === userId;
            let senderName: string | undefined = undefined;
            
            if (isOwn) {
              senderName = userName;
            } else {
              // Try to get name from: 1) message metadata, 2) current peers, 3) fallback to userId
              senderName = message.senderDisplayName || 
                           peers.find(p => p.userId === message.from)?.displayName || 
                           message.from;
            }
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                keyPair={keyPair}
                isOwn={isOwn}
                senderName={senderName}
                chatMode={chatMode || 'group'}
                sessionKey={sessionKey}
                onDownload={(senderId, fileName) => {
                  wsService.current?.notifyDownload(senderId, fileName);
                }}
              />
            );
          })
        )}
        
        <div ref={messagesEndRef} />
      </div>

     {/* Typing Indicator - Between messages and input */}
     {peers.length > 0 && typingUsers.size > 0 && (
        <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>
              {Array.from(typingUsers).slice(0, 3).join(', ')}
              {typingUsers.size === 1 ? ' is' : ' are'} typing...
            </span>
          </div>
        </div>
      )}

     {/* Sticky Input Bar */}
    {peers.length > 0 && (
      <div className="sticky bottom-0 z-10 bg-gray-800/95 backdrop-blur-xl border-t border-gray-700 p-2 sm:p-4">
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-start gap-2 sm:gap-3">
                {filePreview ? (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-lg flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                    {getFileIcon(selectedFile.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  {/* Caption input for files */}
                  <input
                    type="text"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder="Add a caption..."
                    className="mt-1.5 sm:mt-2 w-full bg-gray-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={removeFile}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-end gap-1.5 sm:gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.apk"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
              title="Attach file"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1 bg-gray-700 rounded-lg sm:rounded-xl border border-gray-600 focus-within:border-blue-500 transition-colors">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyPress}
                placeholder={selectedFile ? "Add a message..." : "Type a message..."}
                className="w-full bg-transparent text-white placeholder-gray-400 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base resize-none focus:outline-none"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={isEncrypting}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && !selectedFile) || isEncrypting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0"
              title="Send message"
            >
              {isEncrypting ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
