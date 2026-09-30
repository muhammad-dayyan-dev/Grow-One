import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "@/theme";

const lessons: {
  icon: keyof typeof Ionicons.glyphMap;
  number: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "pricetag-outline",
    number: "01",
    title: "What is a ticker?",
    body: "A ticker is a short code for a traded security. AAPL represents Apple shares; SPY represents an exchange traded fund.",
  },
  {
    icon: "trending-up-outline",
    number: "02",
    title: "Reading daily change",
    body: "Daily change compares the latest reported price with the previous close. A positive percentage means the price is higher than that close.",
  },
  {
    icon: "swap-vertical-outline",
    number: "03",
    title: "High and low",
    body: "The day high and low show the highest and lowest reported prices in the current trading session. They can be absent outside coverage.",
  },
  {
    icon: "layers-outline",
    number: "04",
    title: "Stocks and ETFs",
    body: "A stock is a share in one company. An ETF holds a basket of assets and trades like a stock. SPY and QQQ track different indexes.",
  },
  {
    icon: "pie-chart-outline",
    number: "05",
    title: "Market capitalization",
    body: "Market cap is a company’s share price multiplied by its outstanding shares. It is a size measure, not the amount of cash the company owns.",
  },
];

export default function LearnScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>THE BASICS</Text>
        <Text style={styles.title}>Learn as you go</Text>
        <Text style={styles.subtitle}>
          Simple explanations for the numbers you see in Grow One.
        </Text>
        <View style={styles.feature}>
          <Ionicons name="bulb-outline" size={25} color={colors.gold} />
          <Text style={styles.featureTitle}>A quote is a snapshot.</Text>
          <Text style={styles.featureText}>
            Prices can change quickly, and a provider may report them with a
            delay. Check the quote time before making a decision.
          </Text>
        </View>
        {lessons.map((lesson) => (
          <View key={lesson.number} style={styles.lesson}>
            <View style={styles.lessonTop}>
              <View style={styles.icon}>
                <Ionicons name={lesson.icon} size={23} color={colors.green} />
              </View>
              <Text style={styles.number}>{lesson.number}</Text>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonBody}>{lesson.body}</Text>
          </View>
        ))}
        <Text style={styles.disclaimer}>
          Educational content only. Grow One does not provide investment advice
          or trading.
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
    paddingBottom: 38,
    gap: 14,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: { color: colors.ink, fontSize: 29, fontWeight: "900", marginTop: -8 },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: -6,
    marginBottom: 4,
  },
  feature: {
    backgroundColor: colors.navy,
    borderRadius: radius.card,
    padding: 22,
    marginBottom: 3,
  },
  featureTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
  },
  featureText: { color: "#B7C9C3", fontSize: 13, lineHeight: 20, marginTop: 6 },
  lesson: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 20,
  },
  lessonTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  number: { fontSize: 12, color: "#A4B1AC", fontWeight: "900" },
  lessonTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 15,
  },
  lessonBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  disclaimer: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
});
