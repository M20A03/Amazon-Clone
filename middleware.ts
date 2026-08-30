import { NextResponse, type NextRequest } from "next/server";

// Known Search Engine Crawler User Agents
const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "baiduspider",
  "twitterbot",
  "facebookexternalhit",
  "linkedinbot",
];

// Protected Routes requiring authentication
const PROTECTED_ROUTES = ["/account", "/orders/history"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

  const response = NextResponse.next();

  // =========================================================================
  // 1. Bot & Search Engine Crawler Optimization
  // =========================================================================
  if (isBot) {
    response.headers.set("X-Robots-Tag", "index, follow, max-image-preview:large");
    response.headers.set("X-Bot-Detection", "true");
    // Serve with higher CDN cache efficiency for crawlers
    response.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return response;
  }

  // =========================================================================
  // 2. Geo-Routing & Currency Auto-Detection
  // =========================================================================
  const existingGeoCountry = request.cookies.get("geo_country");
  const existingGeoCurrency = request.cookies.get("geo_currency");

  if (!existingGeoCountry || !existingGeoCurrency) {
    const detectedCountryCode =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "IN";

    let defaultCountry = "India";
    let defaultCurrency = "INR";

    switch (detectedCountryCode.toUpperCase()) {
      case "US":
        defaultCountry = "United States";
        defaultCurrency = "USD";
        break;
      case "GB":
      case "UK":
        defaultCountry = "United Kingdom";
        defaultCurrency = "GBP";
        break;
      case "DE":
      case "FR":
      case "IT":
      case "ES":
        defaultCountry = "Germany";
        defaultCurrency = "EUR";
        break;
      case "JP":
        defaultCountry = "Japan";
        defaultCurrency = "JPY";
        break;
      default:
        defaultCountry = "India";
        defaultCurrency = "INR";
    }

    if (!existingGeoCountry) {
      response.cookies.set({
        name: "geo_country",
        value: defaultCountry,
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
      });
    }

    if (!existingGeoCurrency) {
      response.cookies.set({
        name: "geo_currency",
        value: defaultCurrency,
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  // =========================================================================
  // 3. A/B Testing Cookie Injection (Deterministic 50/50 Split)
  // =========================================================================
  const existingAbBucket = request.cookies.get("ab_bucket");
  if (!existingAbBucket) {
    const bucket = Math.random() < 0.5 ? "A" : "B";
    response.cookies.set({
      name: "ab_bucket",
      value: bucket,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
    response.headers.set("X-AB-Bucket", bucket);
  } else {
    response.headers.set("X-AB-Bucket", existingAbBucket.value);
  }

  // =========================================================================
  // 4. Auth Route Guarding
  // =========================================================================
  const sessionToken = request.cookies.get("amazon_session");
  const isProtectedPath = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add security headers to response
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts
     */
    "/((?!api|_next/static|_next/image|images|fonts|favicon.ico).*)",
  ],
};
