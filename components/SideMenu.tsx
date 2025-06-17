import React, { useRef } from "react";
import { Animated, StyleSheet, Dimensions, Pressable } from "react-native";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useRouter, usePathname } from "expo-router";
import { useDispatch } from "react-redux";
import { setQuery } from "@/store/searchSlice";
import { CATEGORIES, CategoryItem } from "@/constants/Categories";

const { width: screenWidth } = Dimensions.get("window");
const menuWidth = screenWidth * 0.8;

type MenuItemProps = CategoryItem & {
  onPress?: () => void;
};

type SideMenuProps = {
  onCloseDrawer?: () => void;
};

const MenuItem: React.FC<
  MenuItemProps & { textColor: string; borderColor: string }
> = ({ image, label, onPress, borderColor }) => {
  const horizontalSpacing = 30;
  const itemWidth = menuWidth / 2 - horizontalSpacing;
  const animatedValue = useRef(new Animated.Value(1)).current;

  const animatePress = (pressed: boolean) => {
    Animated.spring(animatedValue, {
      toValue: pressed ? 0.95 : 1,
      useNativeDriver: true,
      damping: 12,
      mass: 0.8,
      stiffness: 100,
    }).start();
  };

  return (
    <Pressable
      onPressIn={() => animatePress(true)}
      onPressOut={() => animatePress(false)}
      onPress={onPress}
      style={[styles.menuItemButton, { width: itemWidth }]}
    >
      <Animated.View
        style={[
          styles.menuItemImageWrapper,
          {
            transform: [{ scale: animatedValue }],
          },
        ]}
      >
        <Image
          style={[
            styles.menuItemImage,
            {
              height: itemWidth,
              width: itemWidth,
              borderColor: borderColor,
            },
          ]}
          source={image}
          contentFit="cover"
          alt={label}
        />
        <BlurView
          intensity={70}
          tint="dark"
          style={styles.menuItemLabelOverlay}
        >
          <Text style={styles.menuItemLabelText}>{label}</Text>
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

export default function SideMenu({ onCloseDrawer }: SideMenuProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleOnPress = (item: CategoryItem) => {
    if (onCloseDrawer) onCloseDrawer();

    if (pathname === "/searchResults") {
      dispatch(setQuery(item.label));
    } else {
      dispatch(setQuery(item.label));
      router.push({
        pathname: "/searchResults",
      });
    }
  };

  return (
    <View
      style={[
        styles.menuContainer,
        {
          backgroundColor: themeColors.background,
          borderLeftWidth: 1,
          borderLeftColor: themeColors.borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.menuHeader,
          { borderBottomColor: themeColors.borderColor },
        ]}
      >
        <Text style={[styles.menuTitleText, { color: themeColors.text }]}>
          Categorias
        </Text>
      </View>

      <View style={styles.menuItemsContainer}>
        {CATEGORIES.map((item) => (
          <MenuItem
            key={item.label}
            {...item}
            onPress={() => handleOnPress(item)}
            textColor={themeColors.text}
            borderColor={themeColors.borderColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    bottom: 0,
    width: menuWidth,
    height: "100%",
    zIndex: 200,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "flex-start",
    borderBottomWidth: 1,
  },
  menuTitleText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  menuItemsContainer: {
    flex: 1,
    flexWrap: "wrap",
    gap: 20,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "center",
    marginTop: 20,
  },
  menuItemButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemImageWrapper: {
    position: "relative",
  },
  menuItemImage: {
    borderRadius: 6,
  },
  menuItemLabelOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  menuItemLabelText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
