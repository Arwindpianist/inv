import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { createSupabaseMobileClient } from "@mycelium-inv/db";
import { colors } from "@mycelium-inv/styles";
import { getPendingScans } from "../../lib/storage";
import { useOfflineSync } from "../../hooks/useOfflineSync";

export default function SyncStatusScreen() {
  const [pendingScans, setPendingScans] = useState<any[]>([]);
  const { isSyncing, syncNow } = useOfflineSync();

  useEffect(() => {
    loadPendingScans();
    const interval = setInterval(loadPendingScans, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingScans = async () => {
    const scans = await getPendingScans();
    setPendingScans(scans);
  };

  const synced = pendingScans.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: synced ? "#22c55e" : "#eab308" },
          ]}
        />
        <Text style={styles.statusText}>
          {synced ? "All synced" : `${pendingScans.length} pending`}
        </Text>
        {!synced && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={syncNow}
            disabled={isSyncing}
          >
            <Text style={styles.syncButtonText}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={pendingScans}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.scanItem}>
            <Text style={styles.scanText}>Item: {item.item_id}</Text>
            <Text style={styles.scanText}>Delta: {item.quantity_delta}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending scans</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: "600",
  },
  scanItem: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scanText: {
    color: colors.foreground,
    fontSize: 14,
  },
  emptyText: {
    color: colors["muted-foreground"],
    textAlign: "center",
    marginTop: 32,
  },
  syncButton: {
    marginLeft: "auto",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "600",
  },
});

