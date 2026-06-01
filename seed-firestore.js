/**
 * BigCart - Firestore Seed Script
 * Menjalankan: node seed-firestore.js
 * Letakkan file ini di root project atau di apps/api/
 * Pastikan path ke firebase-adminsdk.json sudah benar
 */

const admin = require("firebase-admin");
const path = require("path");

// ─── INIT FIREBASE ADMIN ────────────────────────────────────────────────────
const serviceAccountPath = path.resolve(
  __dirname,
  "apps/api/firebase-adminsdk.json"
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "pasrah-7096f",
  });
}

const db = admin.firestore();

// ─── DATA: CATEGORIES ───────────────────────────────────────────────────────
const categories = [
  {
    id: "babycare",
    name: "Baby Care",
    slug: "babycare",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270350/bigcart/categories/babycare.svg",
    isActive: true,
    sortOrder: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270352/bigcart/categories/bevarages.svg",
    isActive: true,
    sortOrder: 2,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "edible-oil",
    name: "Edible Oil",
    slug: "edible-oil",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270353/bigcart/categories/edibale%20oil.svg",
    isActive: true,
    sortOrder: 3,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "fruits",
    name: "Fruits",
    slug: "fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270355/bigcart/categories/fruits.svg",
    isActive: true,
    sortOrder: 4,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "grocery",
    name: "Grocery",
    slug: "grocery",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270357/bigcart/categories/grocery.svg",
    isActive: true,
    sortOrder: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "household",
    name: "Household",
    slug: "household",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270358/bigcart/categories/household.svg",
    isActive: true,
    sortOrder: 6,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "vegetables",
    name: "Vegetables",
    slug: "vegetables",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270360/bigcart/categories/vegetable.svg",
    isActive: true,
    sortOrder: 7,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// ─── DATA: BANNERS ───────────────────────────────────────────────────────────
const banners = [
  {
    id: "banner-1",
    title: "Fresh Groceries Delivered",
    subtitle: "Get fresh produce delivered to your door",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270349/bigcart/banners/banner-1.jpg",
    link: "/products",
    isActive: true,
    sortOrder: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// ─── DATA: PRODUCTS ──────────────────────────────────────────────────────────
const products = [
  {
    id: "avocado-001",
    name: "Fresh Avocado",
    slug: "fresh-avocado",
    description:
      "Creamy and delicious fresh avocados, perfect for salads, guacamole, or toast.",
    price: 2.99,
    originalPrice: 3.99,
    discount: 25,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270366/bigcart/products/avacado.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270366/bigcart/products/avacado.png",
    ],
    unit: "piece",
    stock: 150,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 128,
    tags: ["fresh", "organic", "fruit"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "broccoli-001",
    name: "Fresh Broccoli",
    slug: "fresh-broccoli",
    description:
      "Crisp, nutritious broccoli florets. Rich in vitamins and minerals.",
    price: 1.49,
    originalPrice: 1.99,
    discount: 25,
    categoryId: "vegetables",
    categoryName: "Vegetables",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270388/bigcart/products/fresh%20brocoli.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270388/bigcart/products/fresh%20brocoli.png",
    ],
    unit: "bunch",
    stock: 200,
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 87,
    tags: ["fresh", "vegetable", "healthy"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "peach-001",
    name: "Fresh Peach",
    slug: "fresh-peach",
    description: "Sweet and juicy fresh peaches. Naturally ripened for maximum flavor.",
    price: 3.49,
    originalPrice: 4.49,
    discount: 22,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270396/bigcart/products/fresh%20peach.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270396/bigcart/products/fresh%20peach.png",
    ],
    unit: "kg",
    stock: 100,
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 204,
    tags: ["fresh", "fruit", "seasonal"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "lemons-001",
    name: "Fresh Lemons",
    slug: "fresh-lemons",
    description: "Bright, zesty lemons. Perfect for cooking, baking, or refreshing drinks.",
    price: 0.99,
    originalPrice: 1.49,
    discount: 34,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270402/bigcart/products/lemons.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270402/bigcart/products/lemons.png",
    ],
    unit: "piece",
    stock: 500,
    isActive: true,
    isFeatured: false,
    rating: 4.4,
    reviewCount: 156,
    tags: ["citrus", "fresh", "fruit"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "pineapple-001",
    name: "Fresh Pineapple",
    slug: "fresh-pineapple",
    description: "Sweet tropical pineapples, hand-selected for ripeness and flavor.",
    price: 2.49,
    originalPrice: 3.49,
    discount: 29,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270424/bigcart/products/pineapple.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270424/bigcart/products/pineapple.png",
    ],
    unit: "piece",
    stock: 80,
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 312,
    tags: ["tropical", "fresh", "fruit"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "pomegranate-001",
    name: "Fresh Pomegranate",
    slug: "fresh-pomegranate",
    description:
      "Antioxidant-rich pomegranates. Bursting with sweet-tart flavor.",
    price: 3.99,
    originalPrice: 4.99,
    discount: 20,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270441/bigcart/products/pomegranate.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270441/bigcart/products/pomegranate.png",
    ],
    unit: "piece",
    stock: 60,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 95,
    tags: ["superfood", "fresh", "fruit"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "red-grapes-001",
    name: "Red Grapes",
    slug: "red-grapes",
    description: "Sweet, seedless red grapes. Perfect for snacking or wine pairings.",
    price: 4.49,
    originalPrice: 5.99,
    discount: 25,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270444/bigcart/products/red%20grapes.png",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270444/bigcart/products/red%20grapes.png",
    ],
    unit: "500g",
    stock: 120,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 178,
    tags: ["seedless", "fresh", "fruit"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "splash-promo-001",
    name: "Organic Fruit Bundle",
    slug: "organic-fruit-bundle",
    description:
      "A curated selection of our freshest organic fruits. Great value combo pack.",
    price: 12.99,
    originalPrice: 18.99,
    discount: 32,
    categoryId: "fruits",
    categoryName: "Fruits",
    image:
      "https://res.cloudinary.com/darslervz/image/upload/v1780270467/bigcart/products/splash-1.jpg",
    images: [
      "https://res.cloudinary.com/darslervz/image/upload/v1780270467/bigcart/products/splash-1.jpg",
    ],
    unit: "bundle",
    stock: 40,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 432,
    tags: ["organic", "bundle", "value", "featured"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// ─── HELPER: Batch Write dengan progress ─────────────────────────────────────
async function seedCollection(collectionName, data) {
  console.log(`\n📦 Seeding collection: ${collectionName} (${data.length} docs)...`);

  const batch = db.batch();

  for (const item of data) {
    const { id, ...docData } = item;
    const docRef = id
      ? db.collection(collectionName).doc(id)
      : db.collection(collectionName).doc();
    batch.set(docRef, docData, { merge: true });
    console.log(`  ✅ ${collectionName}/${id || "(auto-id)"} → ${docData.name}`);
  }

  await batch.commit();
  console.log(`  🎉 ${data.length} dokumen berhasil ditulis ke [${collectionName}]`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  BigCart Firestore Seed Script");
  console.log("  Project: pasrah-7096f");
  console.log("═══════════════════════════════════════════════════");

  try {
    // Test koneksi dulu
    console.log("\n🔌 Menguji koneksi Firestore...");
    await db.collection("_seed_test").doc("ping").set({ ts: Date.now() });
    await db.collection("_seed_test").doc("ping").delete();
    console.log("  ✅ Koneksi Firestore OK!\n");

    // Seed semua collection
    await seedCollection("categories", categories);
    await seedCollection("banners", banners);
    await seedCollection("products", products);

    console.log("\n═══════════════════════════════════════════════════");
    console.log("  ✅ SEED SELESAI!");
    console.log(`  - ${categories.length} categories`);
    console.log(`  - ${banners.length} banners`);
    console.log(`  - ${products.length} products`);
    console.log("═══════════════════════════════════════════════════\n");
  } catch (error) {
    console.error("\n❌ SEED GAGAL:", error.message);
    if (error.code === "ENOENT") {
      console.error(
        "\n  ⚠️  File service account tidak ditemukan!"
      );
      console.error(
        "  Pastikan path benar: apps/api/firebase-adminsdk.json"
      );
      console.error(
        "  Atau jalankan script ini dari root folder project.\n"
      );
    }
    process.exit(1);
  }
}

main();
