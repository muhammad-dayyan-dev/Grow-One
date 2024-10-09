import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { tabStyle } from "../styles";

const Tabs = ({ onPress, text, isSelected }) => {
  const { button, selected, title, selectedText } = tabStyle;
  return (
    <TouchableOpacity style={isSelected ? selected : button} onPress={onPress}>
      <Text style={isSelected ? selectedText : title}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Tabs;
