# 🛒 Amazon Clone Enterprise Edition (Next.js 15 App Router)

A bulletproof, enterprise-ready, high-performance Amazon Clone built from the ground up with **Next.js 15 (Turbopack)**, **TypeScript (Strict Mode)**, **Tailwind CSS + CSS Custom Properties Design Tokens**, **Zero-FOUC Theme Engine**, **Parallel/Intercepting Routes**, **Idempotent Payment State Machine**, and **Multi-Stage CI/CD**.

---

## 🌟 Key Architectural Features

- **🛡️ Business Logic Fortress**:
  - UUIDv4 Idempotency Key generation & server deduplication preventing double submissions.
  - Multi-tab synchronization using `BroadcastChannel('amazon_state_sync_channel')` and `localStorage`.
  - Offline network resilience with exponential backoff, jitter, and transparent fallback caching.
  - Zero Flash of Unauthenticated Content (FOUC).

- **⚡ Next-Level Routing & Middleware**:
  - **Parallel & Intercepting Routes**: `@modal/(.)product/[id]` quick-view product modal over the catalog grid with full URL shareability at `/product/[id]`.
  - **Stateful URL Sync**: Live category filtering, search terms, and sort options synced with URL query parameters (`?category=&search=&sort=`).
  - **Edge Middleware**: Geo-routing & dynamic currency conversion (INR, USD, EUR, GBP, JPY), bot crawler optimization with `X-Robots-Tag`, and A/B test bucket assignment.

- **🎨 Design System & Accessibility**:
  - Centralized CSS Custom Properties token engine in `globals.css` with 8px/4px spatial grid.
  - Zero-FOUC Dark/Light mode engine with inlined `<head>` script.
  - WCAG 2.1 AA compliant color contrast and high-visibility `:focus-visible` rings.

- **🚀 DevOps & CI/CD Pipeline**:
  - Multi-stage GitHub Actions pipeline (`.github/workflows/deploy.yml`): Quality Gate -> Staging Deploy -> Automated Playwright E2E Smoke Suite -> Production Swap.
  - Pre-commit git hooks via Husky & lint-staged.
  - Build-time & runtime environment variable validation with Zod.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, CSS Custom Properties
- **Icons**: Lucide React
- **Validation**: Zod
- **CI/CD**: GitHub Actions, Playwright

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Build & Validate
```bash
# Strict TypeScript Typecheck
npm run typecheck

# Production Build
npm run build
```

---

## 📜 License
MIT
