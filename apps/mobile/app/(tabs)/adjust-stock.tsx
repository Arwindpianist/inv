import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createSupabaseMobileClient } from "@mycelium-inv/db";
import { colors } from "@mycelium-inv/styles";

export default function AdjustStockScreen() {
  const { itemId, quantityDelta, note } = useLocalSearchParams<{
    itemId: string;
    quantityDelta: string;
    note: string;
  }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseMobileClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // Try to sync online first
      const tenantId = user.user_metadata?.tenant_id;
      if (tenantId) {
        try {
          const { error } = await supabase.from("scans").insert({
            tenant_id: tenantId,
            item_id: parseInt(itemId!),
            user_id: user.id,
            quantity_delta: parseInt(quantityDelta!),
            note: note || null,
          });

          if (!error) {
            router.push("/(tabs)/sync-status");
            return;
          }
        } catch (err) {
          // Fall through to offline queue
        }
      }

      // Queue for offline sync
      await addPendingScan({
        item_id: parseInt(itemId!),
        quantity_delta: parseInt(quantityDelta!),
        note: note || undefined,
      });

      router.push("/(tabs)/sync-status");
    } catch (err) {
      console.error("Error adjusting stock:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Adjust Stock</Text>
        <Text style={styles.label}>Item ID: {itemId}</Text>
        <Text style={styles.label}>Quantity Change: {quantityDelta}</Text>
        {note && <Text style={styles.label}>Note: {note}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.foreground,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});

