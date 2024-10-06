import { StyleSheet } from "react-native";
import { COLORS } from "../utils/constant";

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
