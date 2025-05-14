import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ViewProps } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet, TouchableOpacity } from "react-native";

type HeaderProps = ViewProps & {
  onMenuPress?: () => void
  onAccountPress?: () => void
}

export default function Header(props: HeaderProps) {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].headerIcon;
  const iconSize = 28;

  return (
    <View style={[props.style, { width: "100%" }]}>
      <View style={styles.container} testID="header">
        <TouchableOpacity onPress={props.onAccountPress} testID="account-button">
          <MaterialCommunityIcons
            name="account"
            size={iconSize}
            color={color}
            testID="icon-account"
          />
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="diamond-stone"
          size={iconSize}
          color={color}
          testID="icon-diamond-stone"
        />
        <TouchableOpacity onPress={props.onMenuPress} testID="menu-button">
          <MaterialCommunityIcons
            name="menu"
            size={iconSize}
            color={color}
            testID="icon-menu"
          />
        </TouchableOpacity>
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
    marginTop: 10,
    height: 1,
    width: "100%",
  },
});
