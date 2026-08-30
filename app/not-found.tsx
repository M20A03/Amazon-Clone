import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="bg-surface rounded-2xl border border-border p-10 max-w-lg shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-amazon-amber/20 text-amazon-amber flex items-center justify-center mx-auto">
          <HelpCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-text-primary mb-2">
            Looking for something?
          </h1>
          <p className="text-xs text-text-secondary">
            We&apos;re sorry. The Web address you entered is not a functioning page on our site.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="amazon-yellow" size="md" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Go to Amazon&apos;s Home Page
            </Button>
          </Link>
          <Link href="/?category=Deals" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Explore Deals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
