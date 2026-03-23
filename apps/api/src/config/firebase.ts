import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  try {
    let serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      if (
        serviceAccountStr.startsWith("'") &&
        serviceAccountStr.endsWith("'")
      ) {
        serviceAccountStr = serviceAccountStr.slice(1, -1);
      }
      if (!serviceAccountStr.trim().startsWith("{")) {
        serviceAccountStr = `{${serviceAccountStr.trim().replace(/,$/, "")}}`;
      }
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      console.log("Firebase Admin initialized with service account.");
    } else {
      console.warn(
        "FIREBASE_SERVICE_ACCOUNT is unset. Initializing default app.",
      );
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
