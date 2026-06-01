import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ======================================================
// ISI CLOUDINARY CREDENTIALS ANDA DI SINI
// Ambil dari https://cloudinary.com → Dashboard
// ======================================================
cloudinary.config({
  cloud_name: "darslervz",       // contoh: "myshopcloud"
  api_key:    "955631182369755",          // contoh: "123456789012345"
  api_secret: "S2pG12RPdUUphlSAFAAubfHiDvg",       // contoh: "abcXYZ123..."
});
// ======================================================

async function uploadFolder(localFolder, cloudFolder) {
  if (!fs.existsSync(localFolder)) {
    console.log(`  ⚠️  Folder tidak ditemukan: ${localFolder}`);
    return [];
  }

  const files = fs.readdirSync(localFolder);
  const results = [];

  console.log(`\n📁 Uploading ke Cloudinary folder: "${cloudFolder}" (${files.length} files)`);
  console.log("─".repeat(60));

  for (const file of files) {
    const filePath = path.join(localFolder, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      // Nama file tanpa extension untuk public_id
      const publicId = path.parse(file).name;

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: `bigcart/${cloudFolder}`,
          public_id: publicId,
          overwrite: true,
          resource_type: "auto", // otomatis detect image/svg/dll
        });

        console.log(`  ✅ ${file}`);
        console.log(`     📎 ${result.secure_url}\n`);

        results.push({
          name: file,
          folder: cloudFolder,
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (err) {
        console.log(`  ❌ GAGAL: ${file} — ${err.message}`);
      }
    }
  }

  return results;
}

async function main() {
  console.log("🚀 Mulai upload gambar ke Cloudinary...");
  console.log("=".repeat(60));

  // Verifikasi credentials sebelum mulai
  const config = cloudinary.config();
  if (
    config.cloud_name === "PASTE_CLOUD_NAME" ||
    config.api_key === "PASTE_API_KEY" ||
    config.api_secret === "PASTE_API_SECRET"
  ) {
    console.error("❌ ERROR: Cloudinary credentials belum diisi!");
    console.error("   Buka file upload-images.mjs dan isi cloud_name, api_key, api_secret");
    process.exit(1);
  }

  console.log(`✅ Cloudinary config: cloud_name = "${config.cloud_name}"`);

  const baseDir = path.join(__dirname, "public/images");

  const banners    = await uploadFolder(path.join(baseDir, "banners"),    "banners");
  const categories = await uploadFolder(path.join(baseDir, "categories"), "categories");
  const products   = await uploadFolder(path.join(baseDir, "proudcts"),   "products"); // typo folder asli

  const allResults = { banners, categories, products };

  // Simpan semua URL ke file JSON
  const outputPath = path.join(__dirname, "uploaded-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));

  console.log("=".repeat(60));
  console.log(`\n🎉 Upload selesai!`);
  console.log(`📄 Semua URL tersimpan di: uploaded-urls.json`);
  console.log(`\n📊 Summary:`);
  console.log(`   Banners    : ${banners.length} file`);
  console.log(`   Categories : ${categories.length} file`);
  console.log(`   Products   : ${products.length} file`);
  console.log(`   TOTAL      : ${banners.length + categories.length + products.length} file`);
  console.log(`\n💡 Buka uploaded-urls.json untuk melihat semua URL gambar`);
}

main().catch((err) => {
  console.error("\n💥 Error:", err.message);
  process.exit(1);
});
