import React, { useState } from 'react';
import { Plus, Users, Copy, Check, Link, QrCode } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SessionSetupProps {
  onCreateSession: (sessionId: string) => void;
  onJoinSession: (sessionId: string) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onCreateSession, onJoinSession }) => {
  const [joinCode, setJoinCode] = useState('');
  const [createdSession, setCreatedSession] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  const handleCreateSession = () => {
    const sessionId = uuidv4().substring(0, 8);
    setCreatedSession(sessionId);
    setShowSessionDetails(true);
    // Don't immediately join - let user see the URL first
  };

  const handleStartChat = () => {
    if (createdSession) {
      onCreateSession(createdSession);
    }
  };

  const handleJoinSession = () => {
    if (joinCode.trim()) {
      onJoinSession(joinCode.trim());
    }
  };

  const copySessionCode = async () => {
    if (createdSession) {
      const sessionUrl = `${window.location.origin}?session=${createdSession}`;
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Chats
          </h1>
          <p className="text-gray-400">
            End-to-end encrypted messaging with RSA-OAEP
          </p>
        </div>

        {!createdSession ? (
          <div className="space-y-6">
            <button
              onClick={handleCreateSession}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Session
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter session code"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
              />
              <button
                onClick={handleJoinSession}
                disabled={!joinCode.trim()}
                className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                Join Session
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Session URL */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <Link className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg">Session Link Ready!</h3>
              </div>
              <p className="text-blue-200 text-base mb-4">
                Share this link with anyone to start an encrypted chat:
              </p>
              <div className="flex items-center gap-3 bg-gray-800/70 rounded-lg p-4 border border-gray-600">
                <code className="text-blue-300 font-mono text-base flex-1 break-all select-all">
                  {window.location.origin}?session={createdSession}
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
                  Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Alternative: Session Code */}
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <p className="text-gray-300 text-sm mb-3">Or share just the session code:</p>
              <code className="bg-gray-600 px-4 py-3 rounded-lg text-yellow-400 font-mono text-xl block text-center select-all">
                {createdSession}
              </code>
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

        <div className="mt-8 p-4 bg-gray-700/50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-2">🔐 Security Features:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• End-to-end encryption with RSA-OAEP</li>
            <li>• Private keys never leave your device</li>
            <li>• No message history stored</li>
            <li>• Anonymous usage</li>
          </ul>
        </div>
      
      </div>
    </div>
  );
};
