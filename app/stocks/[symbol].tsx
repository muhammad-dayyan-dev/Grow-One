import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProfile } from "@/api/finnhub";
import { Notice } from "@/components/Notice";
import { useMarket } from "@/context/MarketContext";
import { getFeatured, type Profile, type Stock } from "@/data";
import { compactMillions, money, quoteTime, signedPercent } from "@/format";
import { colors, radius } from "@/theme";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function StockDetailScreen() {
  const { symbol: rawSymbol } = useLocalSearchParams<{ symbol: string }>();
  const symbol = (rawSymbol || "").toUpperCase();
  const router = useRouter();
  const {
    quotes,
    watchlist,
    demo,
    error,
    loading,
    refresh,
    isSaved,
    toggleWatchlist,
  } = useMarket();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const stock: Stock = getFeatured(symbol) ||
    watchlist.find((item) => item.symbol === symbol) || {
      symbol,
      name: profile?.name || symbol,
      category: "Stock",
    };
  const quote = quotes[symbol];
  const positive = (quote?.changePercent ?? 0) >= 0;

  useEffect(() => {
    if (demo || !symbol) return;
    let active = true;
    if (!quotes[symbol]) void refresh([symbol]);
    setProfileLoading(true);
    fetchProfile(symbol)
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((reason: unknown) => {
        if (active)
          setProfileError(
            reason instanceof Error
              ? reason.message
              : "Company details are unavailable.",
          );
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, [symbol, demo]);

  const openWebsite = async () => {
    if (profile?.website && /^https?:\/\//.test(profile.website))
      await Linking.openURL(profile.website);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh([symbol])}
            tintColor={colors.green}
          />
        }
      >
        <View style={styles.toolbar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={21} color={colors.ink} />
          </Pressable>
          <Text style={styles.toolbarTitle}>Stock details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isSaved(symbol) ? "Remove from watchlist" : "Add to watchlist"
            }
            onPress={() =>
              toggleWatchlist({ ...stock, name: profile?.name || stock.name })
            }
            style={styles.iconButton}
          >
            <Ionicons
              name={isSaved(symbol) ? "bookmark" : "bookmark-outline"}
              size={21}
              color={colors.green}
            />
          </Pressable>
        </View>

        {demo && (
          <Notice
            title="Sample data"
            detail="This quote is illustrative and is not a current market price."
          />
        )}
        {error && !demo && (
          <Notice title="Quote unavailable" detail={error} tone="error" />
        )}
        {profileError && (
          <Notice
            title="Company information unavailable"
            detail={profileError}
            tone="error"
          />
        )}

        <View style={styles.identity}>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>{symbol.slice(0, 1)}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={2}>
              {profile?.name || stock.name}
            </Text>
            <Text style={styles.symbol}>
              {symbol}
              {profile?.exchange && profile.exchange !== "—"
                ? ` · ${profile.exchange}`
                : ""}
            </Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.cardEyebrow}>
            {demo ? "SAMPLE PRICE" : "LATEST AVAILABLE PRICE"}
          </Text>
          <Text style={styles.price}>
            {money(quote?.price, profile?.currency)}
          </Text>
          <View
            style={[
              styles.changePill,
              { backgroundColor: positive ? colors.greenSoft : colors.redSoft },
            ]}
          >
            <Ionicons
              name={positive ? "trending-up" : "trending-down"}
              size={17}
              color={positive ? colors.green : colors.red}
            />
            <Text
              style={[
                styles.change,
                { color: positive ? colors.green : colors.red },
              ]}
            >
              {signedPercent(quote?.changePercent)} (
              {money(quote?.change, profile?.currency)})
            </Text>
          </View>
          <Text style={styles.quoteTime}>
            {demo
              ? "Illustrative numbers · no quote time"
              : quote
                ? `Provider timestamp: ${quoteTime(quote.timestamp)}`
                : loading
                  ? "Loading quote…"
                  : "No quote available"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Today’s range</Text>
        <View style={styles.metricCard}>
          <Metric
            label="Day low"
            value={money(quote?.low, profile?.currency)}
          />
          <Metric
            label="Day high"
            value={money(quote?.high, profile?.currency)}
          />
          <Metric
            label="Previous close"
            value={money(quote?.previousClose, profile?.currency)}
          />
          <Metric label="Change" value={signedPercent(quote?.changePercent)} />
        </View>

        <Text style={styles.sectionTitle}>Company snapshot</Text>
        {demo ? (
          <Notice
            title="Connect to see company information"
            detail="A free Finnhub key adds industry, market cap, exchange, and company website."
          />
        ) : (
          <>
            {profileLoading && <ActivityIndicator color={colors.green} />}
            <View style={styles.metricCard}>
              <Metric label="Industry" value={profile?.industry || "—"} />
              <Metric
                label="Market cap"
                value={compactMillions(profile?.marketCap)}
              />
              <Metric label="Country" value={profile?.country || "—"} />
              <Metric label="Currency" value={profile?.currency || "USD"} />
            </View>
          </>
        )}
        {!!profile?.website && (
          <Pressable
            accessibilityRole="link"
            onPress={() => void openWebsite()}
            style={styles.website}
          >
            <Text style={styles.websiteText}>Visit company website</Text>
            <Ionicons name="open-outline" size={17} color={colors.green} />
          </Pressable>
        )}
        <Text style={styles.disclaimer}>
          Data by Finnhub when connected. Quotes can be delayed or unavailable.
          For information only; no trading or investment advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 17,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 8,
  },
  monogram: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  monogramText: { color: colors.green, fontWeight: "900", fontSize: 25 },
  identityText: { flex: 1 },
  name: { color: colors.ink, fontSize: 22, fontWeight: "900" },
  symbol: { color: colors.muted, fontSize: 12, marginTop: 4 },
  priceCard: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 23,
  },
  cardEyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  price: { color: colors.ink, fontSize: 38, fontWeight: "900", marginTop: 9 },
  changePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 13,
  },
  change: { fontSize: 13, fontWeight: "800" },
  quoteTime: { color: colors.muted, fontSize: 11, marginTop: 17 },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 5,
  },
  metricCard: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 6,
  },
  metric: { width: "50%", padding: 15, minHeight: 79 },
  metricLabel: { color: colors.muted, fontSize: 12 },
  metricValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 7,
  },
  website: {
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  websiteText: { color: colors.green, fontSize: 13, fontWeight: "800" },
  disclaimer: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});
