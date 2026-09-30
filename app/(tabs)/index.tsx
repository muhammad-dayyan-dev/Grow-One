import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { featuredStocks } from "@/data";
import { money, quoteTime, signedPercent } from "@/format";
import { colors, radius } from "@/theme";

type Filter = "All" | "Gainers" | "Losers" | "ETFs";
const filters: Filter[] = ["All", "Gainers", "Losers", "ETFs"];

export default function ExploreScreen() {
  const router = useRouter();
  const {
    quotes,
    loading,
    error,
    demo,
    refresh,
    lastRefresh,
    toggleWatchlist,
    isSaved,
  } = useMarket();
  const [filter, setFilter] = useState<Filter>("All");
  const lead = quotes.AAPL;
  const rows = useMemo(
    () =>
      featuredStocks.filter((stock) => {
        if (filter === "ETFs") return stock.category === "ETF";
        if (filter === "Gainers")
          return (quotes[stock.symbol]?.changePercent ?? 0) > 0;
        if (filter === "Losers")
          return (quotes[stock.symbol]?.changePercent ?? 0) < 0;
        return true;
      }),
    [filter, quotes],
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh()}
            tintColor={colors.green}
          />
        }
      >
        <View style={styles.topline}>
          <View>
            <Text style={styles.eyebrow}>GROW ONE</Text>
            <Text style={styles.title}>Explore markets</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search stocks"
            onPress={() => router.push("/search")}
            style={styles.searchIcon}
          >
            <Ionicons name="search" size={22} color={colors.ink} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/search")}
          style={styles.searchField}
        >
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <Text style={styles.searchHint}>Search companies or symbols</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.muted} />
        </Pressable>

        {demo && (
          <Notice
            title="Sample data"
            detail="Add a free Finnhub key in .env to see actual quotes. These prices are examples."
          />
        )}
        {error && (
          <Notice title="Market data unavailable" detail={error} tone="error" />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View Apple details"
          onPress={() => router.push("/stocks/AAPL")}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroLabel}>
              <Ionicons name="pulse" size={14} color={colors.gold} />
              <Text style={styles.heroLabelText}>FEATURED STOCK</Text>
            </View>
            <Ionicons
              name="arrow-forward-outline"
              size={22}
              color={colors.gold}
            />
          </View>
          <Text style={styles.heroName}>Apple Inc.</Text>
          <Text style={styles.heroSymbol}>AAPL · NASDAQ</Text>
          <View style={styles.heroBottom}>
            <View>
              <Text style={styles.heroPrice}>{money(lead?.price)}</Text>
              <Text style={styles.heroCaption}>
                {demo
                  ? "Sample quote"
                  : lead
                    ? `Quote · ${quoteTime(lead.timestamp)}`
                    : "Loading quote"}
              </Text>
            </View>
            <View style={styles.heroChange}>
              <Text style={styles.heroChangeText}>
                {signedPercent(lead?.changePercent)}
              </Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Featured symbols</Text>
            <Text style={styles.sectionSubtitle}>
              Movers are from this list only
            </Text>
          </View>
          {loading && <ActivityIndicator size="small" color={colors.green} />}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filter, filter === item && styles.filterActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.listCard}>
          {rows.length ? (
            rows.map((stock) => (
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
                saved={isSaved(stock.symbol)}
              />
            ))
          ) : (
            <Text style={styles.empty}>
              No {filter.toLowerCase()} to show yet. Pull down to refresh
              quotes.
            </Text>
          )}
        </View>
        <Text style={styles.footnote}>
          {demo
            ? "Sample mode · Quotes are illustrative only."
            : lastRefresh
              ? `Refreshed ${lastRefresh.toLocaleTimeString()} · Data by Finnhub.`
              : "Quotes by Finnhub. Pull down to refresh."}
        </Text>
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
  topline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  searchIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  searchHint: { flex: 1, color: colors.muted, fontSize: 14 },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radius.card,
    padding: 22,
    minHeight: 211,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroLabelText: {
    fontSize: 10,
    color: colors.gold,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  heroName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 27,
  },
  heroSymbol: { color: "#A8BCB6", fontSize: 13, marginTop: 4 },
  heroBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 21,
  },
  heroPrice: { color: "#FFFFFF", fontSize: 28, fontWeight: "900" },
  heroCaption: { color: "#A8BCB6", fontSize: 11, marginTop: 4 },
  heroChange: {
    backgroundColor: "#2B5145",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroChangeText: { color: colors.gold, fontSize: 13, fontWeight: "800" },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  sectionSubtitle: { color: colors.muted, fontSize: 12, marginTop: 4 },
  filters: { gap: 8 },
  filter: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  filterText: { color: colors.muted, fontSize: 12, fontWeight: "800" },
  filterTextActive: { color: "#FFFFFF" },
  listCard: {
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 26,
    fontSize: 13,
    lineHeight: 20,
  },
  footnote: { color: colors.muted, textAlign: "center", fontSize: 11 },
});
