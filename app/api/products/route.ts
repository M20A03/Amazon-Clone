import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("search")?.toLowerCase().trim();
  const sort = searchParams.get("sort") || "featured";

  let results = [...PRODUCTS];

  if (category && category !== "All") {
    if (category === "Deals") {
      results = results.filter((p) => p.category === "Deals" || p.originalPrice);
    } else {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
  }

  if (query) {
    results = results.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchCategory = p.category.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      return matchTitle || matchCategory || matchDesc;
    });
  }

  if (sort === "price_asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    results.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json(
    {
      success: true,
      total: results.length,
      products: results,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
