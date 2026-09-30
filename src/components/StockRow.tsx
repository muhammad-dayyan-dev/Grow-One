import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Quote, Stock } from "../data";
import { money, signedPercent } from "../format";
import { colors } from "../theme";

type Props = {
  stock: Stock;
  quote?: Quote;
  onPress: () => void;
  onSave?: () => void;
  saved?: boolean;
};

export function StockRow({ stock, quote, onPress, onSave, saved }: Props) {
  const positive = (quote?.changePercent ?? 0) >= 0;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${stock.name}`}
        onPress={onPress}
        style={styles.main}
      >
        <View
          style={[
            styles.monogram,
            stock.category === "ETF" && styles.etfMonogram,
          ]}
        >
          <Text style={styles.monogramText}>{stock.symbol.slice(0, 1)}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text numberOfLines={1} style={styles.name}>
            {stock.name}
          </Text>
        </View>
        <View style={styles.values}>
          <Text style={styles.price}>{money(quote?.price)}</Text>
          <Text
            style={[
              styles.change,
              {
                color: quote
                  ? positive
                    ? colors.green
                    : colors.red
                  : colors.muted,
              },
            ]}
          >
            {signedPercent(quote?.changePercent)}
          </Text>
        </View>
      </Pressable>
      {onSave && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            saved
              ? `Remove ${stock.symbol} from watchlist`
              : `Add ${stock.symbol} to watchlist`
          }
          onPress={onSave}
          hitSlop={10}
          style={styles.save}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={19}
            color={saved ? colors.green : colors.muted}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 78,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  main: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  monogram: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E9EDEA",
    alignItems: "center",
    justifyContent: "center",
  },
  etfMonogram: { backgroundColor: "#E9EBF8" },
  monogramText: { fontSize: 17, fontWeight: "800", color: colors.navy },
  identity: { flex: 1, marginLeft: 12, minWidth: 0 },
  symbol: { fontSize: 15, fontWeight: "800", color: colors.ink },
  name: { marginTop: 3, fontSize: 12, color: colors.muted },
  values: { alignItems: "flex-end", paddingLeft: 8 },
  price: { fontSize: 15, fontWeight: "800", color: colors.ink },
  change: { marginTop: 3, fontSize: 12, fontWeight: "700" },
  save: { paddingLeft: 13, paddingVertical: 14 },
});
