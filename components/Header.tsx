import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ViewProps } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = ViewProps & {
  onMenuPress?: () => void;
  onAccountPress?: () => void;
};

export default function Header(props: HeaderProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const color = Colors[colorScheme ?? "light"].headerIcon;
  const iconSize = 28;

  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <>
      {/* Header */}
      <View
        style={[
          props.style,
          styles.container,
          { backgroundColor: themeColors.headerBackground },
        ]}
        testID="header"
      >
        <TouchableOpacity
          onPress={props.onAccountPress}
          testID="account-button"
        >
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
            name="widgets"
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    zIndex: 2,
    width: "100%",
    gap: 60,
    padding: 10,
    justifyContent: "space-around",
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
