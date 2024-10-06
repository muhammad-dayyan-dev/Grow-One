import { Text } from "react-native";
import React from "react";
import { homeStyle } from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const { container, text } = homeStyle;
  return (
    <SafeAreaView style={container}>
      <StatusBar style="light" />
      <Text style={text}>Home</Text>
    </SafeAreaView>
  );
};

export default Home;
