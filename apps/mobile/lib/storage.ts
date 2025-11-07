import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_SCANS_KEY = "@mycelium_inv:pending_scans";

export interface PendingScan {
  id: string;
  item_id: number;
  quantity_delta: number;
  note?: string;
  photo_url?: string;
  location?: string;
  timestamp: number;
}

export async function getPendingScans(): Promise<PendingScan[]> {
  try {
    const data = await AsyncStorage.getItem(PENDING_SCANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading pending scans:", error);
    return [];
  }
}

export async function addPendingScan(scan: Omit<PendingScan, "id" | "timestamp">): Promise<void> {
  try {
    const scans = await getPendingScans();
    const newScan: PendingScan = {
      ...scan,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    scans.push(newScan);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(scans));
  } catch (error) {
    console.error("Error saving pending scan:", error);
  }
}

export async function removePendingScan(id: string): Promise<void> {
  try {
    const scans = await getPendingScans();
    const filtered = scans.filter((scan) => scan.id !== id);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing pending scan:", error);
  }
}

export async function clearPendingScans(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_SCANS_KEY);
  } catch (error) {
    console.error("Error clearing pending scans:", error);
  }
}

