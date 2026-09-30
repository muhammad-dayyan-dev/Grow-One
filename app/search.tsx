import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchSymbols } from "@/api/finnhub";
import { Notice } from "@/components/Notice";
import { StockRow } from "@/components/StockRow";
import { useMarket } from "@/context/MarketContext";
import { featuredStocks, type Stock } from "@/data";
import { colors, radius } from "@/theme";

export default function SearchScreen() {
  const router = useRouter();
  const { quotes, demo, isSaved, toggleWatchlist } = useMarket();
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalized = query.trim().toLowerCase();

  useEffect(() => {
    if (demo || normalized.length < 2) {
      setRemote([]);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setRemote([]);
    setError(null);
    const timer = setTimeout(() => {
      searchSymbols(normalized)
        .then((results) => {
          if (active) setRemote(results);
        })
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error ? reason.message : "Search failed.",
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [normalized, demo]);

  const results = useMemo(() => {
    const local = featuredStocks.filter((stock) =>
      `${stock.symbol} ${stock.name}`.toLowerCase().includes(normalized),
    );
    const known = new Set(local.map((stock) => stock.symbol));
    return [...local, ...remote.filter((stock) => !known.has(stock.symbol))];
  }, [normalized, remote]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={21} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Find a symbol</Text>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Company name or ticker"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.input}
          accessibilityLabel="Search companies or symbols"
        />
        {!!query && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery("")}
          >
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {demo && (
          <Notice
            title="Sample search"
            detail="Add a Finnhub key to search beyond the featured symbols."
          />
        )}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {normalized ? "Results" : "Popular symbols"}
          </Text>
          {loading && <ActivityIndicator size="small" color={colors.green} />}
        </View>
        {error && (
          <Notice title="Search unavailable" detail={error} tone="error" />
        )}
        {results.length ? (
          <View style={styles.card}>
            {results.map((stock) => (
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
            ))}
          </View>
        ) : normalized && !loading && !error ? (
          <Text style={styles.empty}>
            No matching symbols found. Try a ticker or company name.
          </Text>
        ) : null}
        {!demo && (
          <Text style={styles.hint}>
            Search results are provided by Finnhub. Open a result to load its
            latest available quote.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  back: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.ink, fontSize: 22, fontWeight: "900" },
  searchBox: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.ink },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 16,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 30,
    fontSize: 13,
    lineHeight: 20,
  },
  hint: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});
