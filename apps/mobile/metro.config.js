// apps/mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch semua file di monorepo (untuk shared packages)
config.watchFolders = [monorepoRoot];

// 2. Resolver: cari modules di mobile dulu, baru di root monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Pastikan symlinks/junctions diikuti
config.resolver.unstable_enableSymlinks = true;

// 4. Disable package exports untuk kompatibilitas lebih baik
config.resolver.unstable_conditionNames = ["require", "default"];

module.exports = config;
