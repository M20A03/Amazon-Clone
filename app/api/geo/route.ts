import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/data/products";

export async function GET(request: NextRequest) {
  const ipCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "IN";

  const matched =
    COUNTRIES.find((c) => c.code.toUpperCase() === ipCountry.toUpperCase()) ||
    COUNTRIES[0];

  return NextResponse.json({
    success: true,
    country: matched.name,
    countryCode: matched.code,
    currency: matched.currency,
    symbol: matched.symbol,
  });
}
