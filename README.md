# Big Cart 🛒

A full-stack e-commerce platform built on a monorepo architecture featuring a React Native mobile application, a Next.js admin dashboard, and a secure Express backend API.

## 📦 Project Architecture

This repository is managed using **Turborepo** containing three core applications under `apps/`:

- **`apps/mobile`**: A React Native (Expo) app offering a premium frontend for end-users. Features include Firebase Authentication guard rails, persistent shopping cart/favorites states via Zustand and AsyncStorage, and dynamic Firestore Order placement and retrieval.
- **`apps/admin`**: A Next.js 16 web interface utilizing Shadcn UI components. Designed for robust administrative control enabling full CRUD management over Brands, Categories, Banners, and Products alongside native Firebase Storage image asset uploading.
- **`apps/api`**: A Node.js configured Express server routing secure backend read/write operations utilizing the Firebase Admin SDK.

## 🚀 Getting Started

1. **Install Workspace Dependencies**

   ```bash
   npm install
   ```

2. **Boot the Platform (Development Mode)**
   ```bash
   npm run dev
   ```
   > Executing `dev` from the root spins up all three workspaces simultaneously (`mobile`, `admin`, and `api`) ensuring they listen synchronously.

---

## 🔑 Environment Credentials & Firebase Setup

Big Cart is deeply integrated with Google Firebase (`Authentication`, `Firestore`, and `Storage`). To run this project locally, you must provide your specific Firebase project configurations to each respective sub-app.

### 1. Mobile App (`apps/mobile/.env`)

Create an `.env` file inside `apps/mobile/` and populate it with the Firebase Web App configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBZ_UUFQ9ycFYI4hh6YGDbvuZoSR2h5GIQ
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=bigcart-3abe2.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=bigcart-3abe2
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=bigcart-3abe2.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=203700906974
EXPO_PUBLIC_FIREBASE_APP_ID=1:203700906974:web:b9df05027e1de9ac94cb4f
```

### 2. Admin Dashboard (`apps/admin/.env`)

Create an `.env` file inside `apps/admin/`. This grants the Next.js client environment authorization to upload product and banner images directly into your Firebase Storage buckets:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBZ_UUFQ9ycFYI4hh6YGDbvuZoSR2h5GIQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bigcart-3abe2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bigcart-3abe2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bigcart-3abe2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=203700906974
NEXT_PUBLIC_FIREBASE_APP_ID=1:203700906974:web:b9df05027e1de9ac94cb4f

NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Backend API (`apps/api/.env`)

Create an `.env` file inside `apps/api/`. The backend requires **elevated backend privileges**. Download a Service Account JSON private key file from your _Firebase Console > Project Settings > Service Accounts > Generate new private key_.

```env
# Supply the absolute or relative path pointing to your downloaded JSON
FIREBASE_SERVICE_ACCOUNT=../../your-firebase-adminsdk.json
PORT=3001
```

_(⚠️ **Crucial**: Ensure your downloaded service account JSON file is explicitly ignored in your root `.gitignore` to prevent hardcoded structural credentials from leaking strictly into source control)._

---

## ☕ Support

If you found this project helpful, please consider supporting the development!

<a href="https://www.buymeacoffee.com/reactbd" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

_Made with ❤️ by Noor Mohammad._
