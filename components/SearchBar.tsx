import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { View, ViewProps } from "./Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type SearchBarProps = ViewProps & {
  onSubmitEditing?: (query: string) => void;
  placeholder?: string;
  loading: boolean | undefined;
};

export default function SearchBar({
  onSubmitEditing,
  placeholder = "Pesquisar...",
  style,
  loading,
  ...otherProps
}: SearchBarProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Atualizar o input quando a query global mudar
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    loading ? undefined : setInputValue("");
  };

  const handleSubmit = () => {
    onSubmitEditing?.(inputValue);
    setInputValue("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const focusedBorderColor = themeColors.searchBarFocused;
  const unfocusedBorderColor = themeColors.borderColor;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused ? focusedBorderColor : unfocusedBorderColor,
        },
        style,
      ]}
      darkColor="#181A20"
      lightColor="#fff"
      {...otherProps}
    >
      {/* ... ícone ... */}
      <View
        style={[styles.iconContainer]}
        darkColor="#00473F"
        lightColor="#00695C"
      >
        <FontAwesome name="search" size={22} color="#fff" />
      </View>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
        readOnly={loading}
        placeholder={placeholder}
        placeholderTextColor={
          themeColors.tint === Colors.dark.tint
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.5)"
        }
        style={[
          styles.input,
          {
            color: themeColors.text,
          },
        ]}
        cursorColor={themeColors.mainColor}
        inputMode="search"
        returnKeyType="search"
        accessibilityLabel="Campo de pesquisa"
        accessibilityHint="Digite aqui para pesquisar notícias"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {/* Botão de limpar aparece se houver texto */}
      {inputValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Limpar pesquisa"
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={
              themeColors.tint === Colors.dark.tint
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)"
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    elevation: 1.5
  },
  iconContainer: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: "100%",
    flex: 1,
    paddingLeft: 15,
    paddingRight: 35,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
});
