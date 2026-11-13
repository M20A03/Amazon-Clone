import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import { StateProvider } from "@/lib/state-store";
import { ToastContainer } from "@/components/ui/toast";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { LocationModal } from "@/components/layout/location-modal";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#131921" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Amazon Clone — Educational Portfolio Demo | by Mayank Raj",
    template: "%s | Amazon Clone Demo",
  },
  description:
    "An open-source educational e-commerce clone built with Next.js, React, and Tailwind CSS for portfolio showcase. Not affiliated with or endorsed by Amazon.com, Inc.",
  keywords: [
    "Portfolio",
    "Next.js",
    "React",
    "E-Commerce Demo",
    "Educational Clone",
  ],
  authors: [{ name: "Mayank Raj" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-text-primary antialiased">
        <div className="bg-amber-600 text-white text-[11px] sm:text-xs px-3 py-1.5 text-center font-medium shadow-sm flex items-center justify-center gap-1.5 z-50 relative">
          <span className="font-bold">⚠️ PORTFOLIO DEMO:</span>
          <span>
            Educational project by Mayank Raj. Not affiliated with Amazon.com.
            Simulated sandbox data only.
          </span>
        </div>
        <ThemeProvider>
          <StateProvider>
            {children}
            <CartDrawer />
            <LocationModal />
            <MobileBottomNav />
            <ToastContainer />
          </StateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
