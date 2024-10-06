import { View, Text } from "react-native";
import React from "react";
import { homeStyle } from "../styles";

const Home = () => {
  const { container, text } = homeStyle;
  return (
    <View style={container}>
      <Text style={text}>Home</Text>
    </View>
  );
};

export default Home;
