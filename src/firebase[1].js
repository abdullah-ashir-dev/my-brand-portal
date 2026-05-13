// ============================================================
// FILE: src/firebase.js
// PURPOSE: Firebase setup — connects our app to Firebase
// HOW IT WORKS: We initialize Firebase once here, then import
//   auth, db, storage wherever we need them in App.jsx
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ STEP 1: Paste YOUR Firebase config keys here
// Get these from: Firebase Console → Project Settings → Your Apps → SDK Setup
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ✅ Initialize the Firebase app (do this only once)
const app = initializeApp(firebaseConfig);

// ✅ Export the services we'll use throughout the app
export const auth = getAuth(app);           // For login / signup
export const db = getFirestore(app);        // For storing data (Firestore)
export const storage = getStorage(app);     // For storing images/files
export const googleProvider = new GoogleAuthProvider(); // For Google login button

export default app;
