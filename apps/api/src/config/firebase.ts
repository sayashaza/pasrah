import * as admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Explicitly load .env from apps/api/ folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!admin.apps.length) {
  try {
    let serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountVar) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not set in .env");
    }

    let serviceAccount: any = null;

    // Try parsing as JSON directly
    try {
      serviceAccount = JSON.parse(serviceAccountVar);
    } catch (e) {
      // Not direct JSON
    }

    // Try parsing as Base64
    if (!serviceAccount) {
      try {
        const decoded = Buffer.from(serviceAccountVar, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
      } catch (e) {
        // Not Base64
      }
    }

    // Fallback to local file path (for development)
    if (!serviceAccount) {
      const resolvedPath = path.resolve(__dirname, "../../", serviceAccountVar);
      if (fs.existsSync(resolvedPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
      } else {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is neither a valid JSON, Base64 string, nor a valid file path.");
      }
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log("✅ Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();