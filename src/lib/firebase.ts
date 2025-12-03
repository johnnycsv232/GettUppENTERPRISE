/**
 * @file firebase.ts
 * @description Firebase client SDK initialization (lazy loaded for build safety)
 * @module lib/firebase
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Lazy-loaded instances
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

/**
 * Get Firebase config from environment variables
 */
function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Firebase config not available. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set.');
  }

  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
}

/**
 * Get or initialize Firebase app
 */
function getApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(getFirebaseConfig());
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

/**
 * Get Firebase Auth instance
 */
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!authInstance) {
      authInstance = getAuth(getApp());
    }
    return authInstance[prop as keyof Auth];
  },
});

/**
 * Get Firestore instance
 */
export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!dbInstance) {
      dbInstance = getFirestore(getApp());
    }
    return dbInstance[prop as keyof Firestore];
  },
});

/**
 * Get Storage instance
 */
export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_, prop) {
    if (!storageInstance) {
      storageInstance = getStorage(getApp());
    }
    return storageInstance[prop as keyof FirebaseStorage];
  },
});

// Export getter for app if needed
export { getApp };
