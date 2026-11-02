import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDDlHU7czAv4oDk9OVloxi4-SfugtTnSLg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jay-axis.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jay-axis",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jay-axis.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "175235416395",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:175235416395:web:f4e22e7e2f4f72fc7e28ce",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NZ8C9FTHGF"
};

export const isFirebaseConfigured = true;

// Initialize Firebase App (Singleton for Next.js SSR / Fast Refresh)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Authentication & Cloud Firestore
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Safe client-side analytics initialization (avoids SSR errors on the server)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Graceful fallback if analytics is blocked by client privacy extensions
  });
}

export { analytics };
