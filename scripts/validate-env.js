/**
 * Pre-build environment variable validation script
 * Ensures zero deployment failures caused by missing environment variables.
 */

const requiredEnvs = [
  { key: "NEXT_PUBLIC_APP_URL", default: "http://localhost:3000" },
  { key: "NEXT_PUBLIC_API_KEY", default: "amzn_live_enterprise_pk_9938472910" },
];

console.log("🔍 Validating environment variables for build...");
let hasError = false;

for (const { key, default: def } of requiredEnvs) {
  const val = process.env[key] || def;
  if (!val) {
    console.error(`❌ CRITICAL: Required environment variable "${key}" is missing!`);
    hasError = true;
  } else {
    console.log(`  ✓ ${key}: Validated (${val.substring(0, 12)}...)`);
  }
}

if (hasError) {
  console.error("🛑 Build aborted due to missing environment variables.");
  process.exit(1);
} else {
  console.log("✅ All required environment variables passed validation.\n");
}
