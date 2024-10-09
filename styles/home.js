import { StyleSheet } from "react-native";
import { COLORS } from "../utils/constant";

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 6,
  },

  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },

  row: {
    flexDirection: "row",
    width: "100%",
    gap: 2,
  },

  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
