import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ViewProps } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet } from "react-native";

export default function Header(props: ViewProps) {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].headerIcon;
  const iconSize = 28;

  return (
    <View style={[props.style, { width: "100%" }]}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="account" size={iconSize} color={color} />
        <MaterialCommunityIcons
          name="diamond-stone"
          size={iconSize}
          color={color}
        />
        <MaterialCommunityIcons name="menu" size={iconSize} color={color} />
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    gap: 60,
    justifyContent: "space-around",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
});
