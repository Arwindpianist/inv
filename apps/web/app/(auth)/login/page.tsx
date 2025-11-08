"use client";

import { useState } from "react";
import { createSupabaseClient } from "@mycelium-inv/db";
import { NetworkAnimation } from "@mycelium-inv/styles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <NetworkAnimation opacity={0.3} />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-card text-card-foreground rounded-2xl shadow-[0_0_20px_rgba(92,141,247,0.25)] border border-border/20 p-8 backdrop-blur-xl">
          <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight">
            INV.MyceliumLink
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background/40 border border-border/30 rounded-xl px-3 py-2 text-foreground"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background/40 border border-border/30 rounded-xl px-3 py-2 text-foreground"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background hover:bg-primary/80 rounded-xl px-4 py-2 font-medium disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

