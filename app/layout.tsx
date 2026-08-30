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
    default: "Amazon.in: Online Shopping India - Buy Mobiles, Laptops, Cameras, Books, Watches, Apparel, Shoes and E-Gift Cards.",
    template: "%s | Amazon.in",
  },
  description:
    "Online Shopping India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards. Free Shipping & Cash on Delivery Available.",
  keywords: ["Amazon", "Shopping", "Electronics", "Deals", "Online Shopping", "India"],
  authors: [{ name: "Amazon Clone Enterprise" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg",
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
