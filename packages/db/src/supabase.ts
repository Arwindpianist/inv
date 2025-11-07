import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Browser client (for client components)
export function createSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Server client (for server components and API routes)
export function createSupabaseServerClient(cookies: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: any) => void;
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookies.set(name, value, options);
      },
    },
  });
}

// Service role client (server-side only, bypasses RLS)
export function createSupabaseServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Mobile client (React Native)
export function createSupabaseMobileClient() {
  if (typeof window === "undefined") {
    // Server-side
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  // Client-side (React Native)
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

