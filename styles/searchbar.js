import { StyleSheet } from "react-native";
import { COLORS } from "../utils/constant";

export const searchStyle = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    fontSize: 17,
    backgroundColor: COLORS.white,
    fontWeight: "500",
    flex: 1,
  },
});
