import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notice } from "@/components/Notice";
import { StockRow } from "@/components/StockRow";
import { useMarket } from "@/context/MarketContext";
import { colors, radius } from "@/theme";

export default function WatchlistScreen() {
  const router = useRouter();
  const {
    quotes,
    watchlist,
    watchlistReady,
    loading,
    error,
    demo,
    refresh,
    toggleWatchlist,
  } = useMarket();
  const requested = useRef("");
  const symbols = watchlist.map((stock) => stock.symbol);
  const symbolKey = symbols.join(",");

  useEffect(() => {
    if (demo || !watchlistReady) return;
    const missing = symbols.filter((symbol) => !quotes[symbol]);
    const key = missing.join(",");
    if (key && key !== requested.current) {
      requested.current = key;
      void refresh(missing);
    }
  }, [demo, watchlistReady, symbolKey, quotes, refresh]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh(symbols)}
            tintColor={colors.green}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR SPACE</Text>
            <Text style={styles.title}>Watchlist</Text>
            <Text style={styles.subtitle}>
              Keep the companies you follow close.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Find stocks"
            onPress={() => router.push("/search")}
            style={styles.add}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {demo && (
          <Notice
            title="Sample data"
            detail="Watchlist changes are saved on this device. Example prices are not current quotes."
          />
        )}
        {error && (
          <Notice
            title="Some data could not load"
            detail={error}
            tone="error"
          />
        )}

        {!watchlistReady ? (
          <ActivityIndicator color={colors.green} />
        ) : watchlist.length ? (
          <View style={styles.card}>
            {watchlist.map((stock) => (
              <StockRow
                key={stock.symbol}
                stock={stock}
                quote={quotes[stock.symbol]}
                onPress={() =>
                  router.push({
                    pathname: "/stocks/[symbol]",
                    params: { symbol: stock.symbol },
                  })
                }
                onSave={() => toggleWatchlist(stock)}
                saved
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="bookmark-outline"
                size={30}
                color={colors.green}
              />
            </View>
            <Text style={styles.emptyTitle}>Build your watchlist</Text>
            <Text style={styles.emptyText}>
              Save a symbol from Explore or search for a company to follow.
            </Text>
            <Pressable
              onPress={() => router.push("/search")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Find stocks</Text>
            </Pressable>
          </View>
        )}
        {!!watchlist.length && (
          <Text style={styles.hint}>
            Tap a bookmark to remove it. Pull down to refresh quotes.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: { color: colors.ink, fontSize: 29, fontWeight: "900", marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 6 },
  add: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: { textAlign: "center", color: colors.muted, fontSize: 11 },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 42,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 20,
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.pill,
    marginTop: 20,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
});
