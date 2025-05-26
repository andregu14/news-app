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

  return (
    <>
      {/* Status Bar Color */}
      <View
        style={[
          styles.statusbarView,
          {
            height: insets.top + 24,
            backgroundColor: colorScheme === "dark" ? "#181A20" : "#fff",
          },
        ]}
      />
      {/* Header */}
      <View
        style={[
          props.style,
          {
            width: "100%",
            backgroundColor: colorScheme === "dark" ? "#181A20" : "#fff",
          },
        ]}
      >
        <View
          style={[styles.container, { backgroundColor: "transparent" }]}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statusbarView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    flexDirection: "row",
    zIndex: 2,
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
