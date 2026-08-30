"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/lib/state-store";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const { login } = useAppState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email);
      router.push(redirectPath);
    } catch {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Amazon Logo */}
      <Link href="/" className="mb-6">
        <div className="flex items-center gap-1 font-black text-3xl tracking-tighter text-text-primary">
          <span>amazon</span>
          <span className="text-amazon-orange text-sm font-bold pt-2">.in</span>
        </div>
      </Link>

      {/* Login Box */}
      <div className="w-full max-w-sm bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary mb-5">Sign in</h1>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@example.com"
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber focus:ring-1 focus:ring-amazon-amber"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-text-primary">Password</label>
              <a href="#" className="text-xs text-amazon-link hover:underline">
                Forgot your password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber focus:ring-1 focus:ring-amazon-amber"
            />
          </div>

          <Button
            type="submit"
            variant="amazon-yellow"
            size="lg"
            className="w-full font-bold shadow-sm"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue
          </Button>
        </form>

        <p className="text-[11px] text-text-secondary mt-4 leading-relaxed">
          By continuing, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm my-6 flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="text-xs text-text-muted">New to Amazon?</span>
        <hr className="flex-1 border-border" />
      </div>

      {/* Create Account Link */}
      <div className="w-full max-w-sm">
        <Link href={`/signup${redirectPath !== "/" ? `?redirect=${redirectPath}` : ""}`}>
          <Button variant="secondary" size="md" className="w-full">
            Create your Amazon account
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
