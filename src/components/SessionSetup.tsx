import React, { useState, useEffect } from 'react';
import { Plus, Users, Copy, Check, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { encryptToken } from '../utils/tokenEncryption';
import { logger } from '../utils/logger';

interface SessionSetupProps {
  onCreateSession: (sessionId: string, displayName: string, isCreator: boolean) => void;
  onJoinSession: (sessionId: string, displayName: string, isCreator: boolean) => void;
  initialJoinCode?: string;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onCreateSession, onJoinSession, initialJoinCode }) => {
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [createdSession, setCreatedSession] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'name' | 'action' | 'session-created'>('name');
  const [chatMode, setChatMode] = useState<'private' | 'group' | 'password'>('group'); // Add 'password' mode
  const [roomPassword, setRoomPassword] = useState<string>(''); // For password-protected rooms
  
  // Join flow states (for password room)
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  const handleNameSubmit = () => {
    if (displayName.trim()) {
      // If joining via link, skip to direct join
      if (initialJoinCode) {
        handleJoinSession();
      } else {
        setStep('action');
      }
    }
  };

  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [encryptedToken, setEncryptedToken] = useState<string | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  const handleCreateSession = async () => {
    // Validate password for password-protected rooms
    if (chatMode === 'password') {
      if (!roomPassword.trim()) {
        alert('Please enter a room password');
        return;
      }
      if (roomPassword.trim().length < 5) {
        alert('Password must be at least 5 characters long');
        return;
      }
    }
    
    setIsGeneratingToken(true);
    
    try {
      // Generate session ID (5 chars for password mode, 8 for others) and authentication key (16 chars)
      const sessionId = chatMode === 'password' 
        ? uuidv4().substring(0, 5).toUpperCase() // 5-digit room ID for password mode
        : uuidv4().substring(0, 8);
      const authKey = uuidv4().replace(/-/g, '').substring(0, 16);
      
      // For password mode, combine authKey with password hash
      const finalAuthKey = chatMode === 'password'
        ? `${authKey}:${btoa(roomPassword.trim())}` // Base64 encode password
        : authKey;
      
      // Encrypt into secure token
      const token = await encryptToken(sessionId, finalAuthKey);
      
      // Pre-reserve session on server so joiners can connect immediately
      await reserveSessionOnServer(sessionId, finalAuthKey, chatMode);
      
      setCreatedSession(sessionId);
      setSessionKey(finalAuthKey);
      setEncryptedToken(token);
      setStep('session-created');
    } catch (error) {
      logger.error('Failed to create session:', error);
      alert('Failed to create secure session. Please try again.');
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Reserve session on server before creator joins
  const reserveSessionOnServer = async (sessionId: string, authKey: string, mode: 'private' | 'group' | 'password'): Promise<void> => {
    const serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${serverUrl}/api/reserve-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, authKey, chatMode: mode })
      });
      
      if (!response.ok) {
        // Show a user-friendly message if server is down (e.g., 502 Bad Gateway)
        if (response.status === 502) {
          alert('🚨 Server is currently down (maintenance or offline). Please try again later.');
        } else {
          alert('Failed to reserve session. Please try again.');
        }
        throw new Error('Failed to reserve session');
      }
      
      logger.debug(`✅ Session ${sessionId} reserved on server (mode: ${mode})`);
    } catch (error) {
      logger.error('Failed to reserve session:', error);
      // If error is a network error (server unreachable)
      if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        alert('🚨 Server is currently down (maintenance or offline). Please try again later.');
      }
      throw error;
    }
  };

  const handleStartChat = () => {
    if (createdSession && sessionKey && displayName.trim()) {
      // Pass session with key as sessionId:key format
      onCreateSession(`${createdSession}:${sessionKey}`, displayName.trim(), true); // isCreator = true
    }
  };

  const handleJoinSession = () => {
    if (joinCode.trim() && displayName.trim()) {
      onJoinSession(joinCode.trim(), displayName.trim(), false); // isCreator = false
    }
  };
  
  const handleJoinPasswordRoom = () => {
    if (joinRoomId.trim() && joinPassword.trim() && displayName.trim()) {
      // For password room, we need to match the authKey format created by the creator
      // The creator's authKey format is: "randomKey:base64(password)"
      // We need to get the actual authKey from server, but we can construct sessionId:password format
      
      // Send as plain format - server will validate password
      const passwordHash = btoa(joinPassword.trim());
      const fullSessionId = `${joinRoomId.trim().toUpperCase()}:password:${passwordHash}`;
      onJoinSession(fullSessionId, displayName.trim(), false);
    }
  };

  // If an initial join code was provided (from link), set it but don't auto-join
  useEffect(() => {
    if (initialJoinCode) {
      setJoinCode(initialJoinCode);
    }
  }, [initialJoinCode]);

  const copySessionCode = async () => {
    if (encryptedToken) {
      // Create secure link with encrypted token
      const sessionUrl = `${window.location.origin}?token=${encryptedToken}`;
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center p-2 sm:p-4 py-8 sm:py-12 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-8 max-w-md w-full shadow-2xl border border-gray-700 relative z-10 animate-fade-in">
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient">
            SecureChat
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Encrypted messaging. No account required.
          </p>
        </div>

        {/* Step 1: Enter Name */}
        {step === 'name' && (
          <div className="space-y-4 sm:space-y-6 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">👋</span> Welcome
              </h2>
              <p className="text-gray-300 text-sm">
                {initialJoinCode 
                  ? 'Enter your name to join the chat'
                  : 'Enter your name to get started'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className="text-blue-400">✨</span> Your Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Arya, John, Sarah..."
                  className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300 hover:border-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <span className="text-green-400">ℹ️</span> This name will be visible to other participants
                </p>
              </div>

              <button
                onClick={handleNameSubmit}
                disabled={!displayName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50 text-lg shadow-lg hover:shadow-blue-500/50"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Create or Join */}
        {step === 'action' && (
          <div className="space-y-4 sm:space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-2 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="bg-blue-500/20 rounded-full p-2 backdrop-blur-sm">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-white font-semibold">Hi, {displayName}</p>
                <button 
                  onClick={() => setStep('name')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Change name →
                </button>
              </div>
            </div>

            {/* Chat Mode Selector */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 space-y-3 backdrop-blur-sm">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <span className="text-2xl">🎯</span> Choose Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setChatMode('group');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    chatMode === 'group'
                      ? 'border-blue-500 bg-gradient-to-br from-blue-500/30 to-blue-600/20 text-white shadow-lg shadow-blue-500/30'
                      : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-700/70'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">👥</div>
                  <div className="font-semibold text-[10px] sm:text-xs mb-0.5 sm:mb-1">Group</div>
                  <div className="text-[9px] sm:text-[10px] opacity-80">Multi-user</div>
                </button>
                <button
                  onClick={() => {
                    setChatMode('private');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    chatMode === 'private'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/30 to-purple-600/20 text-white shadow-lg shadow-purple-500/30'
                      : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-700/70'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🔒</div>
                  <div className="font-semibold text-[10px] sm:text-xs mb-0.5 sm:mb-1">Private</div>
                  <div className="text-[9px] sm:text-[10px] opacity-80">1-to-1</div>
                </button>
                <button
                  onClick={() => {
                    setChatMode('password');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    chatMode === 'password'
                      ? 'border-green-500 bg-gradient-to-br from-green-500/30 to-green-600/20 text-white shadow-lg shadow-green-500/30'
                      : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-700/70'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🔑</div>
                  <div className="font-semibold text-[10px] sm:text-xs mb-0.5 sm:mb-1">Password</div>
                  <div className="text-[9px] sm:text-[10px] opacity-80">2 members</div>
                </button>
              </div>
              <div className="mt-3 p-2.5 sm:p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-[11px] sm:text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    {chatMode === 'group' 
                      ? 'Group chats: Everyone in the session sees all messages'
                      : chatMode === 'private'
                      ? 'Private chats: Only you and one other person (max 2 total)'
                      : 'Password rooms: Protected with a passphrase (max 2 people)'
                    }
                  </span>
                </p>
              </div>
              
              {/* Password Input for Password Mode */}
              {chatMode === 'password' && (
                <div className="mt-3 pt-3 border-t border-gray-600 animate-slide-in">
                  <form onSubmit={(e) => e.preventDefault()}>
                    {/* Hidden username field for accessibility */}
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span className="text-lg">🔑</span> Room Password (min 5 characters)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        placeholder="Enter password..."
                        minLength={5}
                        className="w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600 rounded-lg px-4 py-3 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        autoFocus
                        autoComplete="new-password"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {roomPassword.length >= 5 ? (
                          <span className="text-green-400 text-xl">✓</span>
                        ) : roomPassword.length > 0 ? (
                          <span className="text-yellow-400 text-sm font-mono">{roomPassword.length}/5</span>
                        ) : null}
                      </div>
                    </div>
                  </form>
                  <p className={`text-xs mt-2 flex items-center gap-1 transition-colors ${
                    roomPassword.length > 0 && roomPassword.length < 5 
                      ? 'text-red-400' 
                      : 'text-gray-400'
                  }`}>
                    {roomPassword.length > 0 && roomPassword.length < 5 
                      ? <><span>⚠️</span> Needs {5 - roomPassword.length} more character{5 - roomPassword.length !== 1 ? 's' : ''}</>
                      : <><span className="text-green-400">🔒</span> Share this password privately with the other person</>
                    }
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateSession}
              disabled={isGeneratingToken || (chatMode === 'password' && roomPassword.length < 5)}
              className="group w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-green-500/50 disabled:shadow-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              {isGeneratingToken ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="relative z-10">Creating Session...</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Create Session</span>
                </>
              )}
            </button>

            {/* Show join option ONLY for Password Mode */}
            {chatMode === 'password' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
                  <div className="text-xl">🔑</div>
                  Join Password-Protected Room
                </h4>
                
                <form onSubmit={(e) => { e.preventDefault(); handleJoinPasswordRoom(); }} className="space-y-3">
                  {/* Hidden username field for accessibility */}
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Room ID
                    </label>
                    <input
                      type="text"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                      placeholder="e.g., AB3F7"
                      maxLength={5}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg font-mono tracking-wider uppercase"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      placeholder="Enter room password"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoComplete="current-password"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!joinRoomId.trim() || !joinPassword.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Join Password Room
                  </button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    Or create your own password room above
                  </p>
                </form>
              </div>
            )}
            
            {/* Info for Group/Private modes */}
            {chatMode !== 'password' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 text-xl">ℹ️</div>
                  <div className="flex-1">
                    <h4 className="text-blue-300 font-semibold mb-1">How to Join a Session</h4>
                    <p className="text-blue-200/80 text-sm">
                      To join an existing {chatMode} session, ask the creator to share their secure session link with you. 
                      Click the link, fill your display name and join automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Session Created */}
        {step === 'session-created' && createdSession && sessionKey && encryptedToken && (
          <div className="space-y-6">
            {/* Password Mode - Show Room ID and Password */}
            {chatMode === 'password' && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm font-bold">🔑</div>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Password-Protected Room Created!</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-1">Room ID (Share this):</p>
                    <code className="text-green-300 font-mono text-2xl font-bold select-all">
                      {createdSession}
                    </code>
                  </div>
                  
                  <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-1">Password (Share this privately):</p>
                    <code className="text-yellow-300 font-mono text-xl font-bold select-all">
                      {roomPassword}
                    </code>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ <strong>Important:</strong> Share the Room ID and Password separately for maximum security.
                    Only 2 members (including you) can join this room.
                  </p>
                </div>
              </div>
            )}
            
            {/* Link Mode - Show Encrypted Link (for group/private modes) */}
            {chatMode !== 'password' && (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <Link className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">🔐 Encrypted Session Link Ready!</h3>
                </div>
                <p className="text-blue-200 text-base mb-4">
                  Share this encrypted link to start a secure chat. The link contains no visible credentials:
                </p>
                <div className="flex items-center gap-3 bg-gray-800/70 rounded-lg p-4 border border-gray-600">
                  <code className="text-blue-300 font-mono text-sm flex-1 break-all select-all">
                    {window.location.origin}?token={encryptedToken}
                  </code>
                  <button
                    onClick={copySessionCode}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0 min-w-[44px] flex items-center justify-center"
                    title="Copy link"
                  >
                    {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Encrypted link copied to clipboard!
                  </p>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✅</div>
                <div className="flex-1">
                  <h4 className="text-green-300 font-semibold mb-1">Military-Grade Encryption</h4>
                  <p className="text-green-200/80 text-sm mb-2">
                    Your session credentials are encrypted with AES-256-GCM encryption. The link is safe to share.
                  </p>
                  <ul className="text-green-200/70 text-xs space-y-1">
                    <li>• Session ID and authentication key are hidden</li>
                    <li>• Link is tamper-proof and time-limited (24 hours)</li>
                    <li>• No sensitive data visible in browser history</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Start Chat Button */}
            <button
              onClick={handleStartChat}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              <Users className="w-6 h-6" />
              Start Chat
            </button>
            
            {/* Instructions */}
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-2">How to share:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Send the link via email, SMS, or any messaging app</li>
                <li>• Or share just the session code for manual entry</li>
                <li>• Link works on any device with a modern browser</li>
                <li>• Click "Start Chat" when ready to begin</li>
              </ul>
            </div>
            
            <p className="text-green-400 text-base text-center font-medium">
              🔒 Your chat will be end-to-end encrypted!
            </p>
          </div>
        )}    
      </div>
    </div>
  );
};
