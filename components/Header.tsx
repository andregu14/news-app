import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ViewProps } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type HeaderProps = ViewProps & {
  onMenuPress?: () => void;
  onAccountPress?: () => void;
};

export default function Header(props: HeaderProps) {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const color = Colors[colorScheme ?? "light"].headerIcon;
  const iconSize = 26;

  const themeColors = Colors[colorScheme ?? "light"];

  const handleHomeScreen = () => {
    if (pathname !== "/") {
      router.replace("/");
    }
  };

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
        <Pressable
          onPress={props.onAccountPress}
          testID="account-button"
          android_ripple={{
            borderless: true,
            radius: 22,
            color:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          }}
        >
          <MaterialCommunityIcons
            name="account"
            size={iconSize}
            color={color}
            testID="icon-account"
          />
        </Pressable>
        <Pressable
          onPress={handleHomeScreen}
          testID="index-button"
          android_ripple={{
            borderless: true,
            radius: 22,
            color:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          }}
        >
          <FontAwesome6
            name="newspaper"
            size={iconSize}
            color={color}
            testID="icon-newspaper"
          />
        </Pressable>
        <Pressable
          onPress={props.onMenuPress}
          testID="menu-button"
          android_ripple={{
            borderless: true,
            radius: 22,
            color:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          }}
        >
          <MaterialCommunityIcons
            name="widgets"
            size={iconSize}
            color={color}
            testID="icon-menu"
          />
        </Pressable>
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
