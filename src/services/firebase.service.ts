import { getDatabase, ref, set, get, onValue, off, remove } from 'firebase/database';
import { getFirebaseServices, isDemoMode } from '../config/firebase.config';

export interface SessionMetadata {
  sessionId: string;
  createdAt: number;
  chatMode: 'group' | 'private' | 'password';
  memberCount: number;
  lastActivity: number;
}

export interface UserPresence {
  userId: string;
  displayName: string;
  online: boolean;
  lastSeen: number;
}

/**
 * Firebase Service for storing session metadata (NOT encrypted messages)
 * This stores only non-sensitive session information like presence and metadata
 */
export class FirebaseService {
  private database: any;

  constructor() {
    const { database } = getFirebaseServices();
    this.database = database;
  }

  /**
   * Save session metadata to Firebase
   * Note: Does NOT store encrypted messages - only session info
   */
  async saveSessionMetadata(sessionId: string, metadata: Partial<SessionMetadata>): Promise<boolean> {
    if (isDemoMode || !this.database) {
      return true;
    }

    try {
      const sessionRef = ref(this.database, `sessions/${sessionId}/metadata`);
      await set(sessionRef, {
        ...metadata,
        sessionId,
        lastActivity: Date.now()
      });
      // Session metadata saved
      return true;
    } catch (error) {
      logger.error('Error saving session metadata:', error);
      return false;
    }
  }

  /**
   * Get session metadata from Firebase
   */
  async getSessionMetadata(sessionId: string): Promise<SessionMetadata | null> {
    if (isDemoMode || !this.database) {
      console.log('🎭 DEMO: Would fetch session metadata:', sessionId);
      return null;
    }

    try {
      const sessionRef = ref(this.database, `sessions/${sessionId}/metadata`);
      const snapshot = await get(sessionRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as SessionMetadata;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching session metadata:', error);
      return null;
    }
  }

  /**
   * Update user presence in session
   */
  async updateUserPresence(sessionId: string, userId: string, presence: UserPresence): Promise<boolean> {
    if (isDemoMode || !this.database) {
      console.log('�� DEMO: Would update user presence:', userId);
      return true;
    }

    try {
      const presenceRef = ref(this.database, `sessions/${sessionId}/presence/${userId}`);
      await set(presenceRef, presence);
      return true;
    } catch (error) {
      console.error('❌ Error updating user presence:', error);
      return false;
    }
  }

  /**
   * Listen to session presence changes
   */
  listenToPresence(sessionId: string, callback: (users: Record<string, UserPresence>) => void): () => void {
    if (isDemoMode || !this.database) {
      console.log('🎭 DEMO: Would listen to presence for:', sessionId);
      return () => {};
    }

    const presenceRef = ref(this.database, `sessions/${sessionId}/presence`);
    
    onValue(presenceRef, (snapshot) => {
      const users = snapshot.val() || {};
      callback(users);
    });

    // Return cleanup function
    return () => {
      off(presenceRef);
    };
  }

  /**
   * Remove user from session presence
   */
  async removeUserPresence(sessionId: string, userId: string): Promise<boolean> {
    if (isDemoMode || !this.database) {
      console.log('🎭 DEMO: Would remove user presence:', userId);
      return true;
    }

    try {
      const presenceRef = ref(this.database, `sessions/${sessionId}/presence/${userId}`);
      await remove(presenceRef);
      return true;
    } catch (error) {
      console.error('❌ Error removing user presence:', error);
      return false;
    }
  }

  /**
   * Clean up session data (called when session ends)
   */
  async cleanupSession(sessionId: string): Promise<boolean> {
    if (isDemoMode || !this.database) {
      console.log('🎭 DEMO: Would cleanup session:', sessionId);
      return true;
    }

    try {
      const sessionRef = ref(this.database, `sessions/${sessionId}`);
      await remove(sessionRef);
      console.log('✅ Session cleaned up from Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error cleaning up session:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
