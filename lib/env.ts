import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_KEY: z.string().min(1).default("amzn_live_enterprise_pk_9938472910"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.enum(["INR", "USD", "EUR", "GBP", "JPY"]).default("INR"),
  NEXT_PUBLIC_DEFAULT_COUNTRY: z.string().default("India"),
  DATABASE_URL: z.string().optional().default("postgresql://postgres:password@localhost:5432/amazon_clone"),
  ENABLE_AB_TESTING: z.enum(["true", "false"]).default("true"),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || "amzn_live_enterprise_pk_9938472910",
    NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "INR",
    NEXT_PUBLIC_DEFAULT_COUNTRY: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "India",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/amazon_clone",
    ENABLE_AB_TESTING: process.env.ENABLE_AB_TESTING || "true",
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables. Check .env.local against lib/env.ts");
  }

  return parsed.data;
}

export const env = getEnv();
