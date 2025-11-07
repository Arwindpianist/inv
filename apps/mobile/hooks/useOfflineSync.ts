import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { createSupabaseMobileClient } from "@mycelium-inv/db";
import { getPendingScans, removePendingScan, PendingScan } from "../lib/storage";

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const syncPendingScans = async () => {
    setIsSyncing(true);
    try {
      const scans = await getPendingScans();
      if (scans.length === 0) {
        setPendingCount(0);
        return;
      }

      const supabase = createSupabaseMobileClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("Not authenticated, skipping sync");
        return;
      }

      const tenantId = user.user_metadata?.tenant_id;
      if (!tenantId) {
        console.log("No tenant ID, skipping sync");
        return;
      }

      // Sync each pending scan
      for (const scan of scans) {
        try {
          const { error } = await supabase.from("scans").insert({
            tenant_id: tenantId,
            item_id: scan.item_id,
            user_id: user.id,
            quantity_delta: scan.quantity_delta,
            note: scan.note || null,
            photo_url: scan.photo_url || null,
            location: scan.location || null,
          });

          if (error) {
            console.error("Error syncing scan:", error);
            continue;
          }

          // Remove from queue on success
          await removePendingScan(scan.id);
        } catch (err) {
          console.error("Error processing scan:", err);
        }
      }

      // Update pending count
      const remaining = await getPendingScans();
      setPendingCount(remaining.length);
    } catch (error) {
      console.error("Error syncing:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Load initial pending count
    getPendingScans().then((scans) => setPendingCount(scans.length));

    // Sync on app state change (foreground)
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        syncPendingScans();
      }
    });

    // Sync every 5 minutes
    const interval = setInterval(syncPendingScans, 5 * 60 * 1000);

    // Initial sync
    syncPendingScans();

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return {
    isSyncing,
    pendingCount,
    syncNow: syncPendingScans,
  };
}

