import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const isConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_PRIVATE_KEY_HERE");

if (isConfigured && getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

function getDb() {
  if (!isConfigured) {
    console.warn("Firebase Admin not configured — using mock Firestore");
    return null;
  }
  return getFirestore();
}

function getAdminAuth() {
  if (!isConfigured) {
    console.warn("Firebase Admin not configured — using mock Auth");
    return null;
  }
  return getAuth();
}

export const adminDb = getDb();
export const adminAuth = getAdminAuth();
