import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function Notice({
  title,
  detail,
  tone = "neutral",
}: {
  title: string;
  detail?: string;
  tone?: "neutral" | "error";
}) {
  return (
    <View style={[styles.box, tone === "error" && styles.error]}>
      <Ionicons
        name={
          tone === "error"
            ? "alert-circle-outline"
            : "information-circle-outline"
        }
        size={20}
        color={tone === "error" ? colors.red : colors.green}
      />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {detail && <Text style={styles.detail}>{detail}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.greenSoft,
  },
  error: { backgroundColor: colors.redSoft },
  text: { flex: 1 },
  title: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  detail: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
});
