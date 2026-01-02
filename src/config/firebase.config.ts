import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://demo-project-default-rtdb.firebaseio.com',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000'
};

// Demo mode flag
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_FIREBASE_API_KEY;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;

/**
 * Initialize Firebase app and services
 * Returns null if in demo mode or Firebase is not configured
 */
export const initializeFirebase = (): { app: FirebaseApp | null; auth: Auth | null; database: Database | null } => {
  if (isDemoMode) {
    console.log('🎭 Firebase running in DEMO MODE - no real Firebase connection');
    return { app: null, auth: null, database: null };
  }

  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      database = getDatabase(app);
      console.log('✅ Firebase initialized successfully');
    }
    return { app, auth, database };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.log('🎭 Falling back to DEMO MODE');
    return { app: null, auth: null, database: null };
  }
};

/**
 * Sign in anonymously for session tracking
 * Returns mock user in demo mode
 */
export const signInAnonymouslyToFirebase = async (): Promise<{ uid: string; isAnonymous: boolean } | null> => {
  if (isDemoMode) {
    return {
      uid: `demo-user-${Math.random().toString(36).substring(7)}`,
      isAnonymous: true
    };
  }

  const { auth } = initializeFirebase();
  if (!auth) return null;

  try {
    const userCredential = await signInAnonymously(auth);
    return {
      uid: userCredential.user.uid,
      isAnonymous: userCredential.user.isAnonymous
    };
  } catch (error) {
    console.error('❌ Anonymous sign-in error:', error);
    return null;
  }
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  return !isDemoMode && !!import.meta.env.VITE_FIREBASE_API_KEY;
};

/**
 * Get Firebase services
 */
export const getFirebaseServices = () => {
  return initializeFirebase();
};

export { isDemoMode };
