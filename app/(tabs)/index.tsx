import { useEffect } from "react";
import {
  FlatList, View, Text, StyleSheet, RefreshControl,
  TouchableOpacity, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/lib/colors";
import { useFeed } from "@/hooks/useFeed";
import ActivityCard from "@/components/ActivityCard";

export default function FeedScreen() {
  const { activities, loading, refreshing, hasMore, load, refresh, loadMore, toggleKudo } = useFeed();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={Colors.orange} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard activity={item} onKudo={toggleKudo} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.orange}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={<FeedHeader onSearch={() => router.push("/search")} />}
        ListEmptyComponent={<EmptyFeed />}
        ListFooterComponent={
          hasMore && activities.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={Colors.orange} size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

function FeedHeader({ onSearch }: { onSearch: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>STRIDE</Text>
      <TouchableOpacity onPress={onSearch} style={styles.headerBtn}>
        <Ionicons name="search" size={22} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

function EmptyFeed() {
  const router = useRouter();
  return (
    <View style={styles.empty}>
      <Ionicons name="people-outline" size={56} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>Your feed is empty</Text>
      <Text style={styles.emptyText}>
        Follow other athletes or record your first activity to get started.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => router.push("/(tabs)/record")}
      >
        <Text style={styles.emptyBtnText}>Record an Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  list: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { color: Colors.text, fontSize: 20, fontWeight: "700" },
  emptyText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20 },
  emptyBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  emptyBtnText: { color: "#000", fontWeight: "700", fontSize: 15 },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
});
