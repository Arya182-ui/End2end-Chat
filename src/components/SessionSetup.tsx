import React, { useState, useEffect } from 'react';
import { Plus, Users, Copy, Check, Link, Shield, ChevronRight } from 'lucide-react';
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
      
      <div className="glass-panel rounded-2xl p-4 sm:p-8 max-w-md w-full shadow-2xl relative z-10 animate-fade-in border border-gray-700/50">
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300 shadow-xl shadow-blue-500/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient tracking-tight">
            SecureChat
          </h1>
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            Private. Encrypted. Anonymous.
          </p>
        </div>

        {/* Step 1: Enter Name */}
        {step === 'name' && (
          <div className="space-y-6 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">👋</span> Welcome
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {initialJoinCode 
                  ? 'Enter your name to join the chat session.'
                  : 'Enter your name to get started.'
                }
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 pl-1">
                  Your Display Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-lg transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70"
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                    autoFocus
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 -z-10 blur-sm"></div>
                </div>
              </div>

              <button
                onClick={handleNameSubmit}
                disabled={!displayName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 disabled:shadow-none"
              >

                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Create or Join */}
        {step === 'action' && (
          <div className="space-y-5 animate-slide-in">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2.5 shadow-lg shadow-blue-500/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Signed in as</p>
                  <p className="text-white font-bold tracking-tight">{displayName}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep('name')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20"
              >
                Change
              </button>
            </div>

            {/* Chat Mode Selector */}
            <div className="glass-panel p-4 rounded-xl space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <span className="text-xl">🎯</span> Choose Session Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setChatMode('group');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-200 group ${
                    chatMode === 'group'
                      ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 relative z-10">
                    <div className="text-2xl opacity-90 group-hover:scale-110 transition-transform">👥</div>
                    <div className="font-bold text-xs tracking-tight">Group</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setChatMode('private');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-200 group ${
                    chatMode === 'private'
                      ? 'border-purple-500 bg-purple-500/10 text-white ring-1 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 relative z-10">
                    <div className="text-2xl opacity-90 group-hover:scale-110 transition-transform">🔒</div>
                    <div className="font-bold text-xs tracking-tight">Private</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setChatMode('password');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-200 group ${
                    chatMode === 'password'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 relative z-10">
                    <div className="text-2xl opacity-90 group-hover:scale-110 transition-transform">🔑</div>
                    <div className="font-bold text-xs tracking-tight">Secret</div>
                  </div>
                </button>
              </div>
              
              <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                  {chatMode === 'group' 
                    ? 'Everyone with the link can join. Messages are encrypted but visible to all participants.'
                    : chatMode === 'private'
                    ? 'Secure 1-on-1 chat. Only two participants allowed. End-to-end encrypted.'
                    : 'Password-protected room. Requires a custom password to join. Max 2 participants.'
                  }
              </div>

              
              {/* Password Input for Password Mode */}
              {chatMode === 'password' && (
                <div className="pt-2 animate-slide-in">
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
                    <label className="block text-sm font-medium text-gray-300 mb-2 pl-1">
                      Set Room Password
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        placeholder="Min 5 chars..."
                        minLength={5}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        autoFocus
                        autoComplete="new-password"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {roomPassword.length >= 5 ? (
                          <span className="text-emerald-400 shadow-emerald-500/50 drop-shadow-md">✓</span>
                        ) : roomPassword.length > 0 ? (
                          <span className="text-xs font-mono text-gray-400">{roomPassword.length}/5</span>
                        ) : null}
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateSession}
              disabled={isGeneratingToken || (chatMode === 'password' && roomPassword.length < 5)}
              className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2"
              >
              {isGeneratingToken ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Secure Space...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Secure Session</span>
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
              <div className="p-4 bg-gray-900/30 rounded-xl border border-dashed border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-gray-500 p-0.5">ℹ️</div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    You can share the invite link after creating the session. No account or email needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Session Created */}
        {step === 'session-created' && createdSession && sessionKey && encryptedToken && (
          <div className="space-y-6 animate-slide-in">
            {/* Password Mode - Show Room ID and Password */}
            {chatMode === 'password' && (
              <div className="glass-panel border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <div className="text-6xl">🔑</div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <span className="text-xl">🎉</span>
                  </div>
                  <h3 className="text-emerald-400 font-bold text-lg">Room Created Successfully!</h3>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50 group hover:border-emerald-500/30 transition-colors">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Room ID</p>
                    <div className="flex items-center justify-between">
                      <code className="text-emerald-300 font-mono text-2xl font-bold tracking-wider select-all">
                        {createdSession}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(createdSession || '')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-emerald-400"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50 group hover:border-yellow-500/30 transition-colors">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Room Password</p>
                    <div className="flex items-center justify-between">
                      <code className="text-yellow-400 font-mono text-xl font-bold tracking-wide select-all">
                        {roomPassword}
                      </code>
                       <button 
                        onClick={() => navigator.clipboard.writeText(roomPassword || '')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-400"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 flex gap-2">
                  <span className="text-yellow-500">⚠️</span>
                  <p className="text-yellow-200/80 text-xs leading-relaxed">
                    Share the <strong>Room ID</strong> publicy, but keep the <strong>Password</strong> secret. Only give it to the person you want to join.
                  </p>
                </div>
              </div>
            )}
            
            {/* Link Mode - Show Encrypted Link (for group/private modes) */}
            {chatMode !== 'password' && (
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    <Link className="w-5 h-5" />
                  </div>
                  <h3 className="text-blue-100 font-bold text-lg">Secure Invite Link</h3>
                </div>
                
                <p className="text-blue-200/70 text-sm mb-4 relative z-10 max-w-[90%]">
                  This link contains your encrypted session keys. It self-destructs after 24 hours.
                </p>
                
                <div className="flex items-center gap-2 relative z-10">
                  <div className="flex-1 bg-gray-900/80 rounded-xl p-3 border border-gray-700/50 flex items-center overflow-hidden">
                    <code className="text-blue-300 font-mono text-xs truncate select-all">
                      {window.location.origin}?token={encryptedToken?.substring(0, 20)}...
                    </code>
                  </div>
                  <button
                    onClick={copySessionCode}
                    className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 flex items-center justify-center shadow-lg ${
                      copied 
                        ? 'bg-green-500 text-white shadow-green-500/20' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    }`}
                    title="Copy link"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="border border-green-500/10 bg-green-500/5 rounded-xl p-4">
               <div className="flex gap-3">
                 <div className="bg-green-500/10 p-1.5 rounded-lg h-fit">
                    <Shield className="w-4 h-4 text-green-400" /> {/* Changed to Shield icon if available, otherwise reuse Check or similar */}
                 </div>
                 <div>
                   <h4 className="text-green-400 text-sm font-semibold mb-1">End-to-End Encrypted</h4>
                   <p className="text-green-500/60 text-xs leading-relaxed">
                     Your chat uses AES-256-GCM encryption. No logs are saved on the server. Your privacy is guaranteed.
                   </p>
                 </div>
               </div>
            </div>
            
            {/* Start Chat Button */}
            <button
              onClick={handleStartChat}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-xl shadow-green-500/20 group"
            >
              <span>Enter Chat Room</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-gray-500 text-xs text-center">
               By joining, you agree to our terms of anonymous usage.
            </p>
          </div>
        )}    
      </div>
    </div>
  );
};
