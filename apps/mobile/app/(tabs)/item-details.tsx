import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createSupabaseMobileClient } from "@mycelium-inv/db";
import { colors } from "@mycelium-inv/styles";

export default function ItemDetailsScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantityDelta, setQuantityDelta] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (barcode) {
      loadItem();
    }
  }, [barcode]);

  const loadItem = async () => {
    try {
      const supabase = createSupabaseMobileClient();
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("barcode", barcode)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (err) {
      console.error("Error loading item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = () => {
    router.push({
      pathname: "/(tabs)/adjust-stock",
      params: {
        itemId: item?.id.toString(),
        quantityDelta,
        note,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.label}>Barcode: {item.barcode}</Text>
        <Text style={styles.label}>Current Quantity: {item.quantity}</Text>
        <Text style={styles.label}>Cost: ${item.cost || 0}</Text>
        <Text style={styles.label}>MRSP: ${item.mrsp || 0}</Text>

        <TextInput
          style={styles.input}
          placeholder="Quantity Change (+/-)"
          placeholderTextColor={colors["muted-foreground"]}
          value={quantityDelta}
          onChangeText={setQuantityDelta}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Note (optional)"
          placeholderTextColor={colors["muted-foreground"]}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdjustStock}>
          <Text style={styles.buttonText}>Adjust Stock</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    margin: 16,
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
  input: {
    backgroundColor: `${colors.background}66`,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    color: colors.foreground,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    color: colors.foreground,
    fontSize: 16,
  },
});

