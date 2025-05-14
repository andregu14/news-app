import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Easing,
  Platform,
  Pressable,
} from "react-native";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");
const menuWidth = screenWidth * 0.8;
const appVersion = require("../app.json").expo.version;

type AccountSideMenuProps = {
  isVisible: boolean;
  onClose: () => void;
};

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type MenuItemProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  isLast?: boolean;
  colorScheme?: "light" | "dark";
};

const MenuItem: React.FC<
  MenuItemProps & { textColor: string; borderColor: string }
> = ({ icon, label, onPress, textColor, borderColor, isLast, colorScheme }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItemButton,
      !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
      {
        opacity: pressed ? 0.7 : 1,
        backgroundColor: pressed
          ? colorScheme === "dark"
            ? "#333"
            : "#f5f5f5"
          : "transparent",
      },
    ]}
  >
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color={textColor}
      style={styles.menuItemIcon}
    />
    <Text style={[styles.menuItemText, { color: textColor }]}>{label}</Text>
  </Pressable>
);

export default function AccountSideMenu({
  isVisible,
  onClose,
}: AccountSideMenuProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const slideAnim = useRef(new Animated.Value(-menuWidth)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;
  const [isMenuRendered, setIsMenuRendered] = useState(isVisible); // Controla a renderização do menu

  useEffect(() => {
    if (isVisible) {
      setIsMenuRendered(true); // Garante que o menu seja renderizado antes da animação de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -menuWidth,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Após a animação de saída, define isMenuRendered como false para desmontar o componente
        setIsMenuRendered(false);
      });
    }
  }, [isVisible, slideAnim, overlayOpacityAnim]);

  if (!isMenuRendered) {
    return null;
  }

  const menuItems: MenuItemProps[] = [
    {
      icon: "account-circle-outline",
      label: "Meu Perfil",
      onPress: () => console.log("Perfil"),
    },
    {
      icon: "cog-outline",
      label: "Configurações",
      onPress: () => console.log("Configurações"),
    },
    {
      icon: "shield-account-outline",
      label: "Privacidade",
      onPress: () => console.log("Privacidade"),
    },
    {
      icon: "help-circle-outline",
      label: "Ajuda & Suporte",
      onPress: () => console.log("Ajuda"),
    },
    {
      icon: "heart-outline",
      label: "Favoritos",
      onPress: () => console.log("Favoritos"),
    },
    {
      icon: "bell-outline",
      label: "Notificações",
      onPress: () => console.log("Notificações"),
    },
    {
      icon: "information-outline",
      label: "Sobre",
      onPress: () => console.log("Sobre"),
    },
    {
      icon: "logout",
      label: "Sair",
      onPress: () => {
        console.log("Sair");
        onClose();
      },
      isLast: true,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacityAnim }]}
        pointerEvents={isVisible ? "auto" : "none"}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Menu Lateral */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            backgroundColor: themeColors.background,
            transform: [{ translateX: slideAnim }],
            borderRightWidth: 1,
            borderRightColor: themeColors.borderColor,
          },
        ]}
      >
        {/* Account Details */}
        <View
          style={[
            styles.menuHeader,
            { borderBottomColor: themeColors.borderColor },
          ]}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={60}
            color={themeColors.tint}
          />
          <Text style={[styles.userName, { color: themeColors.text }]}>
            Visitante
          </Text>
          <Text
            style={[styles.userEmail, { color: themeColors.secondaryText }]}
          >
            Faça login para personalizar
          </Text>
        </View>

        {/* Items do Menu */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              textColor={themeColors.text}
              borderColor={themeColors.borderColor}
              isLast={item.isLast}
              colorScheme={colorScheme}
            />
          ))}
        </View>

        {/* Versão do App */}
        <Text
          style={[styles.versionText, { color: themeColors.secondaryText }]}
        >
          {`Versão ${appVersion}`}
        </Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Ocupa toda a tela
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 100,
  },
  menuContainer: {
    position: "absolute",
    bottom: 0,
    width: menuWidth,
    height: "100%",
    zIndex: 200,
    elevation: Platform.OS === "android" ? 4 : 0, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  menuItemsContainer: {
    flex: 1,
  },
  menuItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 12,
  },
});
