import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

const PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";

const PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured =
  Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);

function getPublicSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return {
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseAnonKey: PUBLIC_SUPABASE_ANON_KEY,
  };
}

// Browser client (for client components)
export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Server client (for server components and API routes)
export function createSupabaseServerClient(cookies: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: any) => void;
}) {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
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
  const { supabaseUrl } = getPublicSupabaseConfig();
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
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
  if (typeof window === "undefined") {
    // Server-side
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  // Client-side (React Native)
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

