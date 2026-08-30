import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PRODUCTS } from "@/lib/data/products";
import { ProductModalContent } from "@/components/product/product-modal";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} - Amazon.in`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/?category=${product.category}`} className="hover:underline">
          {product.category}
        </Link>
        {product.subCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{product.subCategory}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Card Content */}
      <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden">
        <ProductModalContent product={product} isModal={false} />
      </div>
    </div>
  );
}
