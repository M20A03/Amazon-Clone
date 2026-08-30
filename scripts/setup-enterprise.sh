#!/usr/bin/env bash
set -e

echo "================================================================="
echo "  🚀 Enterprise Architecture Setup & Reliability Script"
echo "  Amazon Clone Overhaul - CTO/SRE System Bootstrapper"
echo "================================================================="

echo ""
echo "📦 Step 1: Purging build artifacts and caches..."
rm -rf .next node_modules/.cache .turbo dist out
echo "✓ Cache successfully purged."

echo ""
echo "🔧 Step 2: Enforcing strict TypeScript compiler flags..."
node -e '
const fs = require("fs");
const tsconfigPath = "./tsconfig.json";
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictBindCallApply: true,
    strictPropertyInitialization: true,
    noImplicitThis: true,
    alwaysStrict: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    skipLibCheck: true
  };
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log("✓ tsconfig.json updated with enterprise strict flags.");
}
'

echo ""
echo "🔄 Step 3: Upgrading packages to latest stable versions..."
npm update --save

echo ""
echo "🔍 Step 4: Validating runtime & build environment variables..."
node scripts/validate-env.js

echo ""
echo "✨ Step 5: Running TypeScript typecheck (strict mode)..."
npm run typecheck

echo ""
echo "🏗️ Step 6: Testing production build artifact compilation..."
npm run build

echo ""
echo "================================================================="
echo "  🎉 Enterprise Overhaul Complete! System is 100% Operational."
echo "  Run 'npm run dev' to launch the local development server."
echo "================================================================="
