"use client";

import { useEffect, useState } from "react";
import {
  createSupabaseClient,
  isSupabaseConfigured,
} from "@mycelium-inv/db";
import { useRouter } from "next/navigation";
import { NetworkAnimation } from "@mycelium-inv/styles";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured;
  const router = useRouter();

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }

    const supabase = createSupabaseClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabaseReady]);

  if (!supabaseReady) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <NetworkAnimation opacity={0.2} />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="max-w-lg text-center text-sm text-muted-foreground space-y-4">
            <p>Supabase environment variables are missing.</p>
            <p>
              Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>,
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
              and <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
              to your environment to enable the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <NetworkAnimation opacity={0.2} />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={user} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

