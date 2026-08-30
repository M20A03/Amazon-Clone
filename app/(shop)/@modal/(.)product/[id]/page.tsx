import React from "react";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";
import { ProductModalContent } from "@/components/product/product-modal";

interface ModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductModalPage({ params }: ModalPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-5xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl border border-border bg-surface animate-fade-in">
        <ProductModalContent product={product} isModal={true} />
      </div>
    </div>
  );
}
