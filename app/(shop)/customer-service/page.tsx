"use client";

import React, { useState } from "react";
import { ShieldCheck, RotateCcw, Truck, HelpCircle, ChevronDown, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HELP_TOPICS = [
  {
    icon: RotateCcw,
    title: "Returns & Replacements",
    description: "Return eligible items within 30 days of delivery. Free doorstep pickup and instant refund.",
    content: "Most items purchased on Amazon can be returned within 30 days of receipt. Once we receive your item, refunds are processed within 2-4 business days directly to your original payment method.",
  },
  {
    icon: Truck,
    title: "Track Your Package",
    description: "View real-time GPS tracking and estimated arrival times for all active shipments.",
    content: "Track your active orders in real-time from your 'Returns & Orders' dashboard. You will receive SMS and email notifications at every milestone.",
  },
  {
    icon: ShieldCheck,
    title: "100% Purchase Protection",
    description: "Guaranteed safe payments, genuine products, and hassle-free dispute resolution.",
    content: "The Amazon A-to-z Guarantee protects you when you buy items sold and fulfilled by a third-party seller. Our guarantee covers both the timely delivery and the condition of your items.",
  },
  {
    icon: CreditCard,
    title: "Payment & Pricing",
    description: "Manage cards, UPI, Cash on Delivery, and multi-currency exchange rates.",
    content: "We accept Visa, MasterCard, American Express, RuPay, UPI, NetBanking, and Cash on Delivery. All transactions are protected by 256-bit SSL encryption.",
  },
];

export default function CustomerServicePage() {
  const [openTopic, setOpenTopic] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-extrabold text-text-primary">
          Amazon Customer Service
        </h1>
        <p className="text-sm text-text-secondary max-w-lg mx-auto">
          How can we help you today? Explore quick self-service actions or reach our 24/7 dedicated support team.
        </p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HELP_TOPICS.map((topic, idx) => {
          const Icon = topic.icon;
          const isOpen = openTopic === idx;

          return (
            <div
              key={topic.title}
              className={`bg-surface rounded-xl border p-5 transition-all cursor-pointer ${
                isOpen ? "border-amazon-amber shadow-md" : "border-border hover:border-gray-400"
              }`}
              onClick={() => setOpenTopic(isOpen ? null : idx)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amazon-amber/15 text-amazon-amber flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-text-primary">{topic.title}</h3>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{topic.description}</p>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-border text-xs text-text-secondary leading-relaxed animate-fade-in">
                  {topic.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Concierge Support Banner */}
      <div className="bg-surface rounded-xl border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-secondary">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-status-success/15 text-status-success flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Need direct assistance?</h3>
            <p className="text-xs text-text-secondary">
              Our 24/7 customer care concierge is available via live chat and phone.
            </p>
          </div>
        </div>

        <Link href="/orders">
          <Button variant="amazon-yellow" size="md">
            Go to Your Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
