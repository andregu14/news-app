import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";

const { width: screenWidth } = Dimensions.get("window");
const menuWidth = screenWidth * 0.8;

type MenuItemProps = {
  image: string;
  label: string;
  onPress: () => void;
};

const MenuItem: React.FC<
  MenuItemProps & { textColor: string; borderColor: string }
> = ({ image, label, onPress, textColor, borderColor }) => {
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
          intensity={10}
          blurReductionFactor={1}
          tint="systemChromeMaterialDark"
          style={styles.menuItemLabelOverlay}
          experimentalBlurMethod="dimezisBlurView"
        >
          <Text style={styles.menuItemLabelText}>{label}</Text>
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

export default function SideMenu() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const menuItems: MenuItemProps[] = [
    {
      image: require("@/assets/images/tecnologia.jpg"),
      label: "Tecnologia",
      onPress: () => console.log("Tecnologia"),
    },
    {
      image: require("@/assets/images/economia.jpg"),
      label: "Economia",
      onPress: () => console.log("Economia"),
    },
    {
      image: require("@/assets/images/ciencia.jpg"),
      label: "Ciência",
      onPress: () => console.log("Ciência"),
    },
    {
      image: require("@/assets/images/esporte.jpg"),
      label: "Esportes",
      onPress: () => console.log("Esportes"),
    },
    {
      image: require("@/assets/images/politica.jpeg"),
      label: "Política",
      onPress: () => console.log("Política"),
    },
    {
      image: require("@/assets/images/entretenimento.jpg"),
      label: "Entretenimento",
      onPress: () => console.log("Entretenimento"),
    },
    {
      image: require("@/assets/images/saude.jpg"),
      label: "Saúde",
      onPress: () => console.log("Saúde"),
    },
    {
      image: require("@/assets/images/mundo.jpg"),
      label: "Mundo",
      onPress: () => console.log("Mundo"),
    },
  ];

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
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            image={item.image}
            label={item.label}
            onPress={item.onPress}
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
    borderRadius: 12,
  },
  menuItemLabelOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuItemLabelText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold"
  },
});
