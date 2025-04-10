import { TextInput, StyleSheet, useColorScheme } from "react-native";
import { View, Text, ViewProps } from "./Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SearchBar(props: ViewProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        props.style,
        styles.container,
        {
          borderColor:
            colorScheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "#eee",
        },
      ]}
      darkColor="rgba(255, 255, 255, 0.10)"
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colorScheme === "dark" ? "#3F3F3F" : "#eee" },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={28}
          color={colorScheme === "dark" ? "#fff" : "#3F3F3F"}
        />
      </View>
      <TextInput
        placeholder="Pesquisar"
        placeholderTextColor={
          colorScheme === "dark"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.5)"
        }
        style={[
          styles.input,
          {
            borderColor:
              colorScheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "#eee",
          },
        ]}
        inputMode="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  input: {
    height: "100%",
    flex: 1,
    paddingLeft: 15,
    borderLeftWidth: 1,
  },
});
