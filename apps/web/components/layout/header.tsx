"use client";

import { createSupabaseClient } from "@mycelium-inv/db";
import { useRouter } from "next/navigation";

export function Header({ user }: { user: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user?.email}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign Out
      </button>
    </header>
  );
}

