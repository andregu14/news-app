import React, { useState } from 'react';
import { TextInput, StyleSheet, useColorScheme, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { View, Text, ViewProps } from "./Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from '../constants/Colors';

type SearchBarProps = ViewProps & {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Pesquisar",
  style,
  ...otherProps
}: SearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light'; // Garantir que colorScheme não seja null/undefined
  const themeColors = Colors[colorScheme];

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: themeColors.tint === Colors.dark.tint ? 'rgba(255, 255, 255, 0.2)' : '#eee' },
        style,
      ]}
      darkColor="rgba(255, 255, 255, 0.10)"
      lightColor="#fff"
      {...otherProps}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: themeColors.tint === Colors.dark.tint ? "#3F3F3F" : "#eee" },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={28}
          color={themeColors.tint}
        />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText} 
        onSubmitEditing={onSubmitEditing} 
        placeholder={placeholder}
        placeholderTextColor={
          themeColors.tint === Colors.dark.tint
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.5)"
        }
        style={[
          styles.input,
          {
            borderColor: themeColors.tint === Colors.dark.tint ? "rgba(255, 255, 255, 0.2)" : "#eee", 
            color: themeColors.text, 
          },
        ]}
        inputMode="search"
        returnKeyType="search"
        accessibilityLabel="Campo de pesquisa" // Acessibilidade
        accessibilityHint="Digite aqui para pesquisar notícias" // Acessibilidade
      />
      {/* Botão de limpar aparece se houver texto */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton} accessibilityLabel="Limpar pesquisa">
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={themeColors.tint === Colors.dark.tint ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
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
  },
  iconContainer: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
  },  
  input: {
    height: "100%",
    flex: 1,
    paddingLeft: 15,
    paddingRight: 35,
    borderLeftWidth: 1,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  }
});
