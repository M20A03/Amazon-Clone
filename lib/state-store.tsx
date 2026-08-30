"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { type Product, COUNTRIES } from "./data/products";
import { type CurrencyCode, generateUUID } from "./utils";
import { registerToastHandler, registerAuthErrorHandler } from "./fetcher";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmountINR: number;
  currency: CurrencyCode;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: {
    cardLast4: string;
    cardBrand: string;
  };
  createdAt: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    time: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface StateContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotalINR: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // User & Auth
  user: UserProfile | null;
  isAuthLoading: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Country & Currency
  country: string;
  currency: CurrencyCode;
  setCountryAndCurrency: (countryName: string, currencyCode: CurrencyCode) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "status" | "trackingSteps">) => Promise<Order>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeToast: (id: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const CART_STORAGE_KEY = "amazon_cart_v2";
const USER_STORAGE_KEY = "amazon_user_v2";
const ORDERS_STORAGE_KEY = "amazon_orders_v2";
const GEO_STORAGE_KEY = "amazon_geo_v2";

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [country, setCountry] = useState<string>("India");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Helper to trigger toast
  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = generateUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Register global fetcher interceptor hooks
  useEffect(() => {
    registerToastHandler(addToast);
    registerAuthErrorHandler(() => {
      logout();
    });
  }, []);

  // Initial client hydration from LocalStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedGeo = localStorage.getItem(GEO_STORAGE_KEY);
      if (storedGeo) {
        const parsed = JSON.parse(storedGeo);
        setCountry(parsed.country || "India");
        setCurrency(parsed.currency || "INR");
      }
    } catch {
      // Storage unavailable or disabled
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Cross-tab synchronization via BroadcastChannel
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel("amazon_state_sync_channel");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "CART_SYNC") {
        setCart(payload);
      } else if (type === "USER_SYNC") {
        setUser(payload);
      } else if (type === "ORDERS_SYNC") {
        setOrders(payload);
      } else if (type === "GEO_SYNC") {
        setCountry(payload.country);
        setCurrency(payload.currency);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Broadcast state changes helper
  const broadcastSync = (type: string, payload: unknown) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("amazon_state_sync_channel");
        channel.postMessage({ type, payload });
        channel.close();
      } catch {
        // BroadcastChannel failed
      }
    }
  };

  // Cart operations with persistence
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      broadcastSync("CART_SYNC", updated);
      return updated;
    });

    addToast(`Added "${product.title.slice(0, 32)}..." to your Cart.`, "success");
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((i) => i.product.id === productId);
      const updated = prev.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      broadcastSync("CART_SYNC", updated);
      if (itemToRemove) {
        addToast(`Removed "${itemToRemove.product.title.slice(0, 32)}..." from Cart.`, "info");
      }
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      broadcastSync("CART_SYNC", updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
    broadcastSync("CART_SYNC", []);
  };

  // Auth operations
  const login = async (email: string, name?: string): Promise<boolean> => {
    const profile: UserProfile = {
      id: generateUUID(),
      name: name || email.split("@")[0],
      email,
      token: `jwt_session_${generateUUID()}`,
    };
    setUser(profile);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      document.cookie = `amazon_session=${profile.token}; path=/; max-age=604800; SameSite=Lax`;
    } catch {}
    broadcastSync("USER_SYNC", profile);
    addToast(`Welcome back, ${profile.name}!`, "success");
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    return login(email, name);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = `amazon_session=; path=/; max-age=0`;
    } catch {}
    broadcastSync("USER_SYNC", null);
    addToast("You have been signed out.", "info");
  };

  // Country & Currency selector
  const setCountryAndCurrency = (countryName: string, currencyCode: CurrencyCode) => {
    setCountry(countryName);
    setCurrency(currencyCode);
    const geo = { country: countryName, currency: currencyCode };
    try {
      localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo));
      document.cookie = `geo_country=${countryName}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `geo_currency=${currencyCode}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    broadcastSync("GEO_SYNC", geo);
    addToast(`Delivery destination updated to ${countryName} (${currencyCode})`, "info");
    setIsLocationModalOpen(false);
  };

  // Create Order
  const createOrder = async (
    orderData: Omit<Order, "id" | "createdAt" | "status" | "trackingSteps">
  ): Promise<Order> => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: now.toISOString(),
      status: "Out for Delivery",
      trackingSteps: [
        { title: "Order Placed", time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { title: "Payment Verified (Idempotent)", time: "Just now", completed: true },
        { title: "Packed at Amazon Fulfillment Center", time: "In Progress", completed: true },
        { title: "Out for Delivery with Amazon Logistics", time: "Expected by 9:00 PM", completed: false, current: true },
        { title: "Delivered", time: "Pending", completed: false },
      ],
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      broadcastSync("ORDERS_SYNC", updated);
      return updated;
    });

    clearCart();
    return newOrder;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalINR = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <StateContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotalINR,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        user,
        isAuthLoading,
        login,
        signup,
        logout,
        country,
        currency,
        setCountryAndCurrency,
        isLocationModalOpen,
        setIsLocationModalOpen,
        orders,
        createOrder,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
