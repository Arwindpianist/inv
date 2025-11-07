import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1810",
          borderTopColor: "rgba(248,245,232,0.15)",
        },
        tabBarActiveTintColor: "#b1a235",
        tabBarInactiveTintColor: "#c4b896",
      }}
    >
      <Tabs.Screen name="scanner" options={{ title: "Scanner", tabBarIcon: () => "📷" }} />
      <Tabs.Screen name="item-details" options={{ title: "Details", tabBarIcon: () => "📦" }} />
      <Tabs.Screen name="sync-status" options={{ title: "Sync", tabBarIcon: () => "🔄" }} />
    </Tabs>
  );
}

