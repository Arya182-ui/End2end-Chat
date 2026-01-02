import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SessionSetup } from './components/SessionSetup';
import { ChatInterface } from './components/ChatInterface';
import { CookieConsent } from './components/CookieConsent';
import { decryptToken } from './utils/tokenEncryption';
import { logger } from './utils/logger';
import { Layout } from './components/Layout';

type AppState = 'setup' | 'chat';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [sessionId, setSessionId] = useState<string>('');
  const [prefillJoinCode, setPrefillJoinCode] = useState<string | null>(null);

  // Persist userId across refreshes so messages stay consistent
  const [userId] = useState<string>(() => {
    let storedUserId = localStorage.getItem('securechat.userId');
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem('securechat.userId', storedUserId);
    }
    return storedUserId;
  });

  const [userName, setUserName] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);

  useEffect(() => {
    const initializeSession = async () => {
      // Check for encrypted token parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');

      if (tokenParam) {
        try {
          // Decrypt token to get session ID and auth key
          const decrypted = await decryptToken(tokenParam);

          if (decrypted) {
            // Combine session ID and key for internal use
            const fullSessionId = `${decrypted.session}:${decrypted.key}`;
            setPrefillJoinCode(fullSessionId);
            logger.debug('✅ Token decrypted successfully');
          } else {
            logger.error('❌ Token expired or invalid');
            alert('This link has expired or is invalid. Please request a new link.');
          }
        } catch (error) {
          logger.error('❌ Token decryption failed:', error);
          alert('Invalid session link. Please check the link and try again.');
        }

        // Clean up URL immediately (hide token from browser history)
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // If no session param in URL, restore from localStorage (keeps user in
        // the chat after refresh).
        const storedSession = localStorage.getItem('securechat.session');
        const storedName = localStorage.getItem('securechat.userName');
        const storedIsCreator = localStorage.getItem('securechat.isCreator') === 'true';

        if (storedSession && storedName) {
          logger.debug('📦 Restoring session from localStorage');

          setUserName(storedName);
          setSessionId(storedSession);
          setIsCreator(storedIsCreator);
          setAppState('chat');

          // Ensure URL contains session so other tabs / refresh behave predictably
          window.history.replaceState({}, document.title, `${window.location.pathname}?session=${storedSession}`);
        } else {
          logger.debug('ℹ️ No stored session found, showing setup screen');
        }
      }
    };

    initializeSession();
  }, []);

  // Handler that accepts a display name when creating a session.

  const handleCreateSessionWithName = (newSessionId: string, displayName: string, isCreatorFlag: boolean) => {
    // newSessionId format: "sessionId:authKey"
    setUserName(displayName);
    setSessionId(newSessionId);
    setIsCreator(isCreatorFlag);
    setAppState('chat');

    // Don't put key in URL - only in localStorage for refresh
    window.history.replaceState({}, document.title, window.location.pathname);

    // Persist full session (with key) in localStorage
    try {
      localStorage.setItem('securechat.session', newSessionId);
      localStorage.setItem('securechat.userName', displayName);
      localStorage.setItem('securechat.isCreator', String(isCreatorFlag));
    } catch (e) { }
  };

  const handleJoinSession = (existingSessionId: string, displayName?: string, isCreatorFlag: boolean = false) => {
    // existingSessionId format: "sessionId:authKey"
    if (displayName) setUserName(displayName);
    setSessionId(existingSessionId);
    setIsCreator(isCreatorFlag);
    setAppState('chat');

    // Don't put key in URL for security
    window.history.replaceState({}, document.title, window.location.pathname);

    try {
      if (displayName) {
        localStorage.setItem('securechat.session', existingSessionId);
        localStorage.setItem('securechat.userName', displayName);
        localStorage.setItem('securechat.isCreator', String(isCreatorFlag));
      } else {
        localStorage.setItem('securechat.session', existingSessionId);
      }
    } catch (e) { }
  };

  const handleLeaveSession = () => {
    logger.debug('🚪 Leaving session - clearing all data...');

    // Clear state
    setSessionId('');
    setUserName('');
    setIsCreator(false);
    setAppState('setup');

    // Remove session param from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // Clear ALL localStorage related to session
    try {
      localStorage.removeItem('securechat.session');
      localStorage.removeItem('securechat.userName');
      localStorage.removeItem('securechat.isCreator');
      logger.debug('✅ localStorage cleared');
    } catch (e) {
      logger.error('Error clearing localStorage:', e);
    }
  };

  return (
    <Layout showFooter={appState === 'setup'}>
      {appState === 'setup' ? (
        <SessionSetup
          onCreateSession={handleCreateSessionWithName}
          onJoinSession={handleJoinSession}
          initialJoinCode={prefillJoinCode || undefined}
        />
      ) : (
        <ChatInterface
          sessionId={sessionId}
          userId={userId}
          userName={userName}
          isCreator={isCreator}
          onLeave={handleLeaveSession}
        />
      )}
      <CookieConsent />
    </Layout>
  );
}

export default App;
