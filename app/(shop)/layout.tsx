import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Subnav } from "@/components/layout/subnav";
import { Footer } from "@/components/layout/footer";

export default function ShopLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 bg-amazon-navy" />}>
        <Navbar />
      </Suspense>
      <Suspense fallback={<div className="h-10 bg-amazon-dark" />}>
        <Subnav />
      </Suspense>
      
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-2.5 sm:px-4 md:px-6 py-4 pb-20 md:pb-8">
        {children}
      </main>

      {modal}
      <Footer />
    </div>
  );
}
