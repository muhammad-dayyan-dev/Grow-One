import { StyleSheet } from "react-native";
import { COLORS } from "../utils/constant";

export const containerStyle = StyleSheet.create({
  container: {
    flex: 0,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
  },

  profitTag: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    borderRadius: 5,
    paddingVertical: 5,
    width: 60,
    alignItems: "center",
  },

  lossTag: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 16,
    borderRadius: 5,
    paddingVertical: 5,
    width: 60,
    alignItems: "center",
  },
});
