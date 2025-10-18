import React, { useState } from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SessionSetup } from './components/SessionSetup';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/header';
import { Footer } from './components/footer';

type AppState = 'setup' | 'chat';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [sessionId, setSessionId] = useState<string>('');
  const [userId] = useState<string>(() => uuidv4());

  useEffect(() => {
    // Check for session parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    
    if (sessionParam) {
      setSessionId(sessionParam);
      setAppState('chat');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCreateSession = (newSessionId: string) => {
    setSessionId(newSessionId);
    setAppState('chat');
  };

  const handleJoinSession = (existingSessionId: string) => {
    setSessionId(existingSessionId);
    setAppState('chat');
  };

  const handleLeaveSession = () => {
    setSessionId('');
    setAppState('setup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {appState === 'setup' ? (
        <div className="flex-1">
          <SessionSetup
            onCreateSession={handleCreateSession}
            onJoinSession={handleJoinSession}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <ChatInterface
            sessionId={sessionId}
            userId={userId}
            onLeave={handleLeaveSession}
          />
        </div>
      )}
      {appState === 'setup' && <Footer />}
    </div>
  );
}

export default App;
