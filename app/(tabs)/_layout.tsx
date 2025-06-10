import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return <MaterialCommunityIcons size={26} {...props} />;
}
function TabBarLabel(props: { name: string; color: string; focused: boolean }) {
  return (
    <Text
      style={{
        color: props.color,
        fontFamily: props.focused ? "Inter_700Bold" : "Inter_400Regular",
        fontSize: 12,
      }}
    >
      {props.name}
    </Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].headerIcon,

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        animation: "fade",

        tabBarIconStyle: {
          marginBottom: -3,
        },

        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: themeColors.headerBackground,
              height: "100%",
            }}
          />
        ),
        tabBarStyle: {
          height: insets.bottom + 55,
        },
        tabBarItemStyle: {
          backgroundColor: "transparent",
        },
        tabBarButton: (props) => {
          const { children, onPress, ...otherProps } = props;
          return (
            <View
              {...otherProps}
              style={[
                {
                  backgroundColor: "transparent",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                  props.style,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  },
                ]}
                android_ripple={{
                  color:
                    colorScheme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              >
                {children}
              </Pressable>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: ({ focused, color }) => (
            <TabBarLabel color={color} name={"início"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
          tabBarLabel: ({ focused, color }) => (
            <TabBarLabel color={color} name={"menu"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
