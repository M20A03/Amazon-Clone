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
      
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      {modal}
      <Footer />
    </div>
  );
}
