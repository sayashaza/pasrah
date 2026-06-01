/**
 * BigCart - Verify Firestore Data & API Endpoints
 * Menjalankan: node verify-bigcart.js
 */

const http = require("http");

const API_BASE = "http://localhost:3001";

// ─── HTTP Helper ──────────────────────────────────────────────────────────────
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      })
      .on("error", reject);
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  BigCart API Verification");
  console.log(`  Base URL: ${API_BASE}`);
  console.log("═══════════════════════════════════════════════════\n");

  const endpoints = [
    { label: "Health Check",  path: "/api/health" },
    { label: "Categories",    path: "/api/categories" },
    { label: "Banners",       path: "/api/banners" },
    { label: "Products",      path: "/api/products" },
    { label: "Products Featured", path: "/api/products?featured=true" },
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    const url = `${API_BASE}${ep.path}`;
    try {
      const result = await httpGet(url);
      const ok = result.status >= 200 && result.status < 300;

      if (ok) {
        const count = Array.isArray(result.body?.data)
          ? ` (${result.body.data.length} items)`
          : Array.isArray(result.body)
          ? ` (${result.body.length} items)`
          : "";
        console.log(`  ✅ ${ep.label.padEnd(22)} → HTTP ${result.status}${count}`);
        passed++;
      } else {
        console.log(`  ⚠️  ${ep.label.padEnd(22)} → HTTP ${result.status}`);
        failed++;
      }
    } catch (err) {
      console.log(
        `  ❌ ${ep.label.padEnd(22)} → GAGAL (${err.message})`
      );
      if (err.code === "ECONNREFUSED") {
        console.log(`     ⚠️  API server tidak berjalan di ${API_BASE}`);
        console.log(`     Jalankan dulu: cd apps/api && npm run dev\n`);
      }
      failed++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log(`  Hasil: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("  🎉 Semua endpoint berjalan normal!");
  } else {
    console.log("  ⚠️  Ada endpoint yang bermasalah, cek log di atas.");
  }
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch(console.error);
