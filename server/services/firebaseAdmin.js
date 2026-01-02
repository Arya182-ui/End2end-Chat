import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const isDemoMode = process.env.DEMO_MODE === 'true' || !process.env.FIREBASE_PROJECT_ID;

let firebaseApp = null;
let database = null;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebaseAdmin = () => {
  if (isDemoMode) {
    console.log('🎭 Firebase Admin running in DEMO MODE');
    return { app: null, database: null };
  }

  if (firebaseApp) {
    return { app: firebaseApp, database };
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('⚠️ Firebase Admin credentials not configured, running in demo mode');
      return { app: null, database: null };
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    });

    database = admin.database();
    console.log('✅ Firebase Admin initialized successfully');
    
    return { app: firebaseApp, database };
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.log('🎭 Falling back to DEMO MODE');
    return { app: null, database: null };
  }
};

/**
 * Save session metadata to Firebase Realtime Database
 */
export const saveSessionMetadata = async (sessionId, metadata) => {
  if (isDemoMode || !database) {
    console.log('🎭 DEMO: Would save session metadata:', sessionId);
    return true;
  }

  try {
    const sessionRef = database.ref(`sessions/${sessionId}/metadata`);
    await sessionRef.set({
      ...metadata,
      lastActivity: Date.now()
    });
    return true;
  } catch (error) {
    console.error('❌ Error saving session metadata:', error);
    return false;
  }
};

/**
 * Update user presence in session
 */
export const updateUserPresence = async (sessionId, userId, presence) => {
  if (isDemoMode || !database) {
    console.log('🎭 DEMO: Would update presence:', userId);
    return true;
  }

  try {
    const presenceRef = database.ref(`sessions/${sessionId}/presence/${userId}`);
    await presenceRef.set(presence);
    return true;
  } catch (error) {
    console.error('❌ Error updating presence:', error);
    return false;
  }
};

/**
 * Remove user presence
 */
export const removeUserPresence = async (sessionId, userId) => {
  if (isDemoMode || !database) {
    console.log('🎭 DEMO: Would remove presence:', userId);
    return true;
  }

  try {
    const presenceRef = database.ref(`sessions/${sessionId}/presence/${userId}`);
    await presenceRef.remove();
    return true;
  } catch (error) {
    console.error('❌ Error removing presence:', error);
    return false;
  }
};

/**
 * Cleanup session data
 */
export const cleanupSession = async (sessionId) => {
  if (isDemoMode || !database) {
    console.log('🎭 DEMO: Would cleanup session:', sessionId);
    return true;
  }

  try {
    const sessionRef = database.ref(`sessions/${sessionId}`);
    await sessionRef.remove();
    return true;
  } catch (error) {
    console.error('❌ Error cleaning up session:', error);
    return false;
  }
};

// Initialize on module load
initializeFirebaseAdmin();
