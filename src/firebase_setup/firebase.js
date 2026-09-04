import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next re-executes modules on hot reload, and initializeApp throws on a second call.
const app = getApps()[0] ?? initializeApp(config);

// Resolved on demand rather than at import time. getAuth validates the config,
// which would otherwise fail the prerender pass on any machine without the env
// vars set. Nothing signs in during SSR anyway.
export function firebaseAuth() {
    return getAuth(app);
}

export function googleSignIn() {
    return signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
}

export function googleSignOut() {
    return signOut(firebaseAuth());
}
