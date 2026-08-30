"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, RotateCcw, ArrowRight, ExternalLink } from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { orders, currency } = useAppState();
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  const activeTrackingOrder = orders.find((o) => o.id === selectedOrderTracking) || orders[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Your Orders</h1>
        <p className="text-xs text-text-secondary mt-1">
          Track packages, initiate returns, download invoices, and reorder items.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center text-text-muted mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            You have no past orders
          </h2>
          <p className="text-xs text-text-secondary max-w-sm mb-6">
            When you place an order, your tracking details, invoices, and delivery status will appear here.
          </p>
          <Link href="/">
            <Button variant="amazon-yellow" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of Orders */}
          <div className="lg:col-span-7 space-y-4">
            {orders.map((order) => {
              const isSelected = order.id === activeTrackingOrder?.id;

              return (
                <div
                  key={order.id}
                  className={`bg-surface rounded-xl border transition-all overflow-hidden ${
                    isSelected ? "border-amazon-amber shadow-md" : "border-border hover:border-gray-400"
                  }`}
                >
                  {/* Order Card Header */}
                  <div className="bg-surface-secondary px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex gap-6">
                      <div>
                        <span className="text-text-muted block">ORDER PLACED</span>
                        <span className="font-semibold text-text-primary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">TOTAL</span>
                        <span className="font-semibold text-amazon-price">
                          {formatCurrency(order.totalAmountINR, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">SHIP TO</span>
                        <span className="font-semibold text-text-primary truncate max-w-[120px] block">
                          {order.shippingAddress.fullName}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-text-muted block">ORDER # {order.id}</span>
                      <button
                        onClick={() => setSelectedOrderTracking(order.id)}
                        className="text-amazon-link hover:underline font-semibold"
                      >
                        View Tracking Timeline
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 divide-y divide-border">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                        <div className="relative w-16 h-16 bg-white rounded border border-border overflow-hidden shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary text-xs line-clamp-2">
                            {item.product.title}
                          </h4>
                          <div className="text-xs text-text-secondary mt-1">
                            Qty: {item.quantity} • {formatCurrency(item.product.price, currency)}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Link href={`/product/${item.product.id}`}>
                              <Button variant="amazon-yellow" size="sm">
                                Buy it again
                              </Button>
                            </Link>
                            <Link href="/customer-service">
                              <Button variant="outline" size="sm">
                                Return item
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Tracking Visualizer */}
          {activeTrackingOrder && (
            <div className="lg:col-span-5">
              <div className="sticky top-20 bg-surface rounded-xl border border-border p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-6 h-6 text-amazon-amber" />
                    <div>
                      <h3 className="font-bold text-sm text-text-primary">
                        Status: {activeTrackingOrder.status}
                      </h3>
                      <p className="text-xs text-status-success font-semibold">
                        Arriving Today by 9:00 PM
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-surface-secondary px-2.5 py-1 rounded border border-border font-mono">
                    #{activeTrackingOrder.id}
                  </span>
                </div>

                {/* Tracking Progress Bar */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Package Journey
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {activeTrackingOrder.trackingSteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-surface ${
                            step.completed
                              ? "border-status-success text-status-success"
                              : step.current
                              ? "border-amazon-amber text-amazon-amber animate-pulse"
                              : "border-border text-text-muted"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              step.completed
                                ? "text-text-primary"
                                : step.current
                                ? "text-amazon-amber"
                                : "text-text-muted"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[11px] text-text-secondary">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Details */}
                <div className="bg-surface-secondary p-3 rounded-lg border border-border text-xs space-y-1">
                  <span className="text-text-muted font-bold block mb-1">Shipping Address:</span>
                  <p className="font-semibold text-text-primary">
                    {activeTrackingOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-text-secondary">
                    {activeTrackingOrder.shippingAddress.street}, {activeTrackingOrder.shippingAddress.city},{" "}
                    {activeTrackingOrder.shippingAddress.state} {activeTrackingOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-text-secondary">{activeTrackingOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
