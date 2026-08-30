"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/lib/state-store";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const { signup } = useAppState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup(name, email, password);
      router.push(redirectPath);
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="mb-5 sm:mb-6">
        <div className="flex items-center gap-0.5 font-black text-2xl sm:text-3xl tracking-tighter text-text-primary">
          <span>amazon</span>
          <span className="text-amazon-orange text-xs sm:text-sm font-bold pt-1 sm:pt-2">.in</span>
        </div>
      </Link>

      <div className="w-full max-w-sm bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4 sm:mb-5">Create Account</h1>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="First and last name"
              className="w-full px-3 py-2 text-base sm:text-sm rounded-md border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber focus:ring-1 focus:ring-amazon-amber"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@example.com"
              className="w-full px-3 py-2 text-base sm:text-sm rounded-md border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber focus:ring-1 focus:ring-amazon-amber"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 text-base sm:text-sm rounded-md border border-border bg-surface text-text-primary outline-none focus:border-amazon-amber focus:ring-1 focus:ring-amazon-amber"
            />
            <p className="text-[11px] text-text-muted mt-1">
              Passwords must be at least 6 characters.
            </p>
          </div>

          <Button
            type="submit"
            variant="amazon-yellow"
            size="lg"
            className="w-full font-bold shadow-sm text-sm sm:text-base"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <p className="text-[11px] text-text-secondary mt-4 leading-relaxed">
          By creating an account, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
        </p>

        <hr className="my-4 sm:my-5 border-border" />

        <div className="text-xs text-text-secondary">
          Already have an account?{" "}
          <Link
            href={`/login${redirectPath !== "/" ? `?redirect=${redirectPath}` : ""}`}
            className="text-amazon-link font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupForm />
    </Suspense>
  );
}
