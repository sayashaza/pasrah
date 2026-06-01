import * as admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Explicitly load .env from apps/api/ folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!admin.apps.length) {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

    console.log("ENV FIREBASE_SERVICE_ACCOUNT:", serviceAccountPath);

    if (!serviceAccountPath) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not set in .env");
    }

    // Resolve path relative to apps/api/ folder
    const resolvedPath = path.resolve(__dirname, "../../", serviceAccountPath);
    console.log("Resolved JSON path:", resolvedPath);
    console.log("File exists:", fs.existsSync(resolvedPath));

    const serviceAccount = JSON.parse(
      fs.readFileSync(resolvedPath, "utf8")
    );

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