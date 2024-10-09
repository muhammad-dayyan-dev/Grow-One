import { FlatList, Image, Text, View } from "react-native";
import React, { useState } from "react";
import { homeStyle } from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SearchBar, StockContainer, Tabs } from "../components";
import logo from "../assets/splash.png";
import { buttonTypes, dummyStocks } from "../utils/constant";

const Home = () => {
  const { container, text, row, image, heading } = homeStyle;
  const [selectedTab, setSelectedTab] = useState(null);

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <SafeAreaView style={container}>
      <StatusBar style="light" />
      <View style={row}>
        <Image source={logo} style={image} />
        <SearchBar placeholder="Search a Stock" />
      </View>

      <FlatList
        data={buttonTypes}
        horizontal={true}
        style={{ marginVertical: 15 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Tabs
            text={item.name}
            onPress={() => handleTabPress(item.name)}
            isSelected={selectedTab === item.name}
          />
        )}
      />

      <View style={heading}>
        <Text style={text}>Name</Text>
        <Text style={text}>Price</Text>
        <Text style={text}>24hr/Change</Text>
      </View>

      <FlatList
        data={dummyStocks}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <StockContainer
            name={item.name}
            price={item.price}
            change={item.change}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
