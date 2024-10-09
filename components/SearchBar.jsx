import { TextInput } from "react-native";
import React from "react";
import { searchStyle } from "../styles";
import { COLORS } from "../utils/constant";

const SearchBar = ({ placeholder, onChangeText }) => {
  return (
    <TextInput
      style={searchStyle.input}
      placeholderTextColor={COLORS.gray}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
};

export default SearchBar;
