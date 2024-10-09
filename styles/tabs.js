import { StyleSheet } from "react-native";
import { COLORS } from "../utils/constant";

export const tabStyle = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 2,
    margin: 5,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },

  title: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  selected: {
    borderRadius: 10,
    borderWidth: 2,
    elevation: 2,
    margin: 5,
    borderColor: COLORS.white,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
