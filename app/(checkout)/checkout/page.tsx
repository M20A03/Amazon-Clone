"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state-store";
import { formatCurrency, getEstimatedDeliveryDate } from "@/lib/utils";
import { IdempotencyManager } from "@/lib/idempotency";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, CreditCard, Truck, AlertCircle, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotalINR, currency, createOrder, user } = useAppState();

  const [fullName, setFullName] = useState(user?.name || "Mayank Raj");
  const [street, setStreet] = useState("Flat 402, Prestige Tower, Outer Ring Rd");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560103");
  const [country, setCountry] = useState("India");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardName, setCardName] = useState("Mayank Raj");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [idempotencyKey] = useState(() => IdempotencyManager.generateKey("checkout_ord"));

  const delivery = getEstimatedDeliveryDate(2);
  const shippingFeeINR = cartSubtotalINR >= 499 ? 0 : 40;
  const grandTotalINR = cartSubtotalINR + shippingFeeINR;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setSubmitError("Your cart is empty. Please add items before checking out.");
      return;
    }

    // Check idempotency lock
    if (IdempotencyManager.isLocked(idempotencyKey)) {
      console.warn("Duplicate checkout submission blocked by IdempotencyManager.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await IdempotencyManager.executeIdempotent(idempotencyKey, async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const order = await createOrder({
          items: cart,
          totalAmountINR: grandTotalINR,
          currency,
          shippingAddress: {
            fullName,
            street,
            city,
            state,
            postalCode,
            country,
          },
          paymentMethod: {
            cardLast4: cardNumber.slice(-4) || "8821",
            cardBrand: paymentMethod === "card" ? "Visa" : paymentMethod.toUpperCase(),
          },
          estimatedDelivery: delivery.dateString,
        });

        return order;
      });

      router.push("/orders");
    } catch (err: unknown) {
      console.error("Order placement failed:", err);
      setSubmitError("Payment processing error. Your card was not charged. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background">
        <div className="bg-surface p-6 sm:p-8 rounded-xl border border-border text-center max-w-md shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-text-secondary mb-6">
            There are no items to checkout. Browse our catalog to find exciting deals!
          </p>
          <Link href="/">
            <Button variant="amazon-yellow" size="md">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Distraction-Free Checkout Header */}
      <header className="bg-amazon-navy text-white border-b border-border py-2.5 sm:py-3 px-4 sm:px-6 sticky top-0 z-30 shadow">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5 font-black text-xl sm:text-2xl tracking-tighter">
            <span>amazon</span>
            <span className="text-amazon-amber text-xs font-bold pt-1 sm:pt-2">.in</span>
          </Link>

          <h1 className="text-sm sm:text-lg font-bold text-gray-200">
            Checkout (<span className="text-amazon-amber">{cart.length} {cart.length === 1 ? "item" : "items"}</span>)
          </h1>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-300">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-status-success" />
            <span className="hidden sm:inline">256-Bit SSL</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {submitError && (
            <div className="p-3.5 rounded-lg bg-status-error/10 border border-status-error/30 flex items-start gap-3 text-xs text-status-error font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 1: Delivery Address */}
          <section className="bg-surface rounded-xl border border-border p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5 sm:pb-3">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amazon-amber text-gray-900 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-text-primary mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-text-primary mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Payment Method */}
          <section className="bg-surface rounded-xl border border-border p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5 sm:pb-3">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amazon-amber text-gray-900 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Payment Method
              </h2>
            </div>

            {/* Payment Radios */}
            <div className="space-y-2.5 sm:space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "card" ? "border-amazon-amber bg-amazon-amber/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1 accent-amazon-orange"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-text-primary">
                    <CreditCard className="w-4 h-4 text-amazon-amber" />
                    Credit or Debit Card
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Visa, MasterCard, RuPay, American Express
                  </p>

                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-3 pt-3 border-t border-border/60">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-semibold text-text-primary mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-2 text-sm rounded border border-border bg-surface outline-none focus:border-amazon-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-primary mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-2.5 py-2 text-sm rounded border border-border bg-surface outline-none focus:border-amazon-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-primary mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-2.5 py-2 text-sm rounded border border-border bg-surface outline-none focus:border-amazon-amber"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "upi" ? "border-amazon-amber bg-amazon-amber/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="mt-1 accent-amazon-orange"
                />
                <div>
                  <div className="font-bold text-xs text-text-primary">
                    UPI / QR Code (Google Pay, PhonePe, Paytm)
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Instant scan & pay via any UPI app
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-amazon-amber bg-amazon-amber/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-amazon-orange"
                />
                <div>
                  <div className="font-bold text-xs text-text-primary">Cash on Delivery (COD)</div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Pay at your doorstep via cash or card
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Section 3: Review Items */}
          <section className="bg-surface rounded-xl border border-border p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5 sm:pb-3">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amazon-amber text-gray-900 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Review Items & Delivery Speed
              </h2>
            </div>

            <div className="bg-surface-secondary p-3 sm:p-3.5 rounded-lg border border-border flex items-center gap-3 text-xs">
              <Truck className="w-5 h-5 text-status-success shrink-0" />
              <div>
                <p className="font-bold text-status-success">
                  Guaranteed Delivery: {delivery.dateString}
                </p>
                <p className="text-text-secondary">
                  If you order within the next 4 hours via Amazon Prime Express
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3 sm:gap-4 text-xs">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded border border-border overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary line-clamp-1">{item.product.title}</h4>
                    <p className="text-text-secondary mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-amazon-price shrink-0">
                    {formatCurrency(item.product.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-4">
          <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 shadow-md lg:sticky lg:top-20 space-y-3 sm:space-y-4">
            <Button
              variant="amazon-yellow"
              size="lg"
              className="w-full font-bold text-sm sm:text-base shadow-md"
              isLoading={isSubmitting}
              onClick={handlePlaceOrder}
            >
              Place Your Order and Pay
            </Button>

            <p className="text-[10px] sm:text-[11px] text-center text-text-muted">
              By placing your order, you agree to Amazon&apos;s privacy notice and conditions of use.
            </p>

            <hr className="border-border" />

            <h3 className="text-xs sm:text-sm font-bold text-text-primary">Order Summary</h3>

            <div className="space-y-1.5 sm:space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)}):</span>
                <span>{formatCurrency(cartSubtotalINR, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{shippingFeeINR === 0 ? "FREE" : formatCurrency(shippingFeeINR, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{formatCurrency(grandTotalINR, currency)}</span>
              </div>
              <div className="flex justify-between text-status-success font-medium">
                <span>Promotion Applied:</span>
                <span>-FREE One-Day</span>
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex items-baseline justify-between text-sm sm:text-base font-bold">
              <span className="text-text-primary">Order Total:</span>
              <span className="text-lg sm:text-xl text-amazon-price">{formatCurrency(grandTotalINR, currency)}</span>
            </div>

            <div className="bg-surface-secondary p-2.5 sm:p-3 rounded-lg border border-border text-[10px] sm:text-[11px] text-text-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
              <span className="truncate">Idempotent ID: <strong className="font-mono">{idempotencyKey.slice(0, 12)}...</strong></span>
            </div>

            <Link
              href="/"
              className="text-xs text-amazon-link hover:underline flex items-center justify-center gap-1 pt-1 sm:pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
