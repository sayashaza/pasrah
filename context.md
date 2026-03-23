# Project Context: Big Cart - Full-Stack Grocery Platform

## 1. Project Overview

This project is a comprehensive, production-ready grocery e-commerce platform. It consists of a mobile consumer app, a web-based admin dashboard, and a robust backend API. The architecture leverages your established expertise in Node.js, Next.js, and React Native to build a scalable system suitable for commercial deployment or high-quality educational content.

## 2. Tech Stack & Infrastructure

- **Mobile Application:** Expo (React Native), TypeScript.
- **Admin Dashboard:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend API:** Node.js, Express, TypeScript.
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Authentication (Email/Password, Google OAuth, Facebook OAuth).
- **Storage:** Firebase Cloud Storage (for product images and user avatars).
- **Design System:** Figma.

## 3. Design & UI/UX Guidelines

- **Source of Truth:** All UI implementations must strictly adhere to the provided Figma file: [Big Cart Community Figma](https://www.figma.com/design/OHvB6K84zS0LM3YYJcztfM/Grocery-App--Big-Cart---Community-?node-id=0-1&m=dev).
- **Asset Workflow (Important):** The AI cannot automatically download images from Figma. Therefore, when generating UI components, the AI must:
  1. Assume the developer has manually exported the required assets from Figma.
  2. Write the code using logical local paths (e.g., `/public/assets/icons/cart.svg` for Next.js or `require('../../assets/icons/cart.png')` for Expo).
  3. Explicitly list the asset names the developer needs to export from Figma to make the generated component render correctly.
- **Design Tokens:** Colors, typography, and spacing must be extracted from Figma and configured as global variables (e.g., in Tailwind config for Admin, and a `theme.ts` file for Expo) to ensure 100% parity between the mobile app and the admin panel.
- **Visual Reference:** If the AI needs visual context for a complex layout that cannot be described in text, the developer will provide a screenshot of the specific Figma frame.

## 4. Core System Features

### A. Backend API (Node.js/TypeScript)

- **Architecture:** Follow a controller-service-route pattern for clean separation of concerns.
- **User Management:** Endpoints for profile creation, updating, and role verification (Customer vs. Admin).
- **Product Catalog:** CRUD operations for products, categories, and inventory management. Support for image upload processing.
- **Order Processing:** Complex logic for cart validation, total calculation (including taxes/delivery), order status updates (Pending, Processing, Shipped, Delivered), and order history retrieval.

### B. Mobile Application (Expo)

- **Auth Flow:** Login, Registration, Password Recovery, and OAuth integrations matching the Figma screens.
- **Shopping Experience:** Home feed with categories/promotions, product detail pages, search & filtering.
- **Cart & Checkout:** Persistent cart state, secure checkout flow, and order confirmation.
- **User Profile:** Order history tracking, address management, and account settings.

### C. Admin Dashboard (Next.js)

- **Access Control:** Strict protected routes requiring an 'Admin' role in Firestore.
- **Dashboard:** Overview metrics (total sales, active orders, user count).
- **Product Management:** Interfaces to add, edit, and delete products, including image uploads to Firebase Storage.
- **Order Management:** Interface to view all orders and update their fulfillment statuses.
- **User Management:** View registered users and manage their access.

## 5. Coding Standards & AI Directives

When generating code for this project, you must adhere strictly to the following rules:

1.  **TypeScript First:** All code must be strongly typed. Define comprehensive interfaces/types for Firestore documents, API requests/responses, and component props. Avoid `any`.
2.  **Modularity:** Write small, reusable components and utility functions.
3.  **Error Handling:** Implement robust `try/catch` blocks for all asynchronous operations, especially API calls and Firebase interactions. Return standardized error responses from the Node.js API.
4.  **Security:** Ensure backend routes that modify data or access sensitive info include middleware to verify the Firebase Auth token.
5.  **State Management:** Use modern state management appropriately (e.g., Zustand or Redux Toolkit for complex shared state, React Context for simpler app-wide state like Auth/Theme).
6.  **No Placeholders:** When generating UI components, use the exact hex codes, font weights, and layout structures implied by the standard Big Cart Figma design.

## 6. Project Initialization Strategy (Suggested Order of Operations)

1.  **Phase 1: Infrastructure.** Setup Firebase project, configure Firestore security rules, enable Auth providers.
2.  **Phase 2: Backend API.** Initialize Node.js/TS project, connect to Firebase Admin SDK, build core CRUD endpoints.
3.  **Phase 3: Admin Panel.** Initialize Next.js, setup Tailwind theme based on Figma, build authentication, connect to API for product uploads.
4.  **Phase 4: Mobile App.** Initialize Expo, build UI components matching Figma, implement navigation, integrate with Auth and API.
