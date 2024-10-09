import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { containerStyle } from "../styles";

const StockContainer = ({ name, price, change, onPress }) => {
  const { container, text, profitTag, lossTag } = containerStyle;
  const finalStyle = change > 0 ? profitTag : lossTag;
  return (
    <TouchableOpacity style={container} onPress={onPress}>
      <Text style={text}>{name}</Text>
      <Text style={text}>{price}</Text>
      <View style={finalStyle}>
        <Text style={text}>{change}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StockContainer;
