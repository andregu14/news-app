import { StyleSheet, Dimensions, Pressable, ToastAndroid } from "react-native";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";

const { width: screenWidth } = Dimensions.get("window");
const menuWidth = screenWidth * 0.8;
const appVersion = require("../app.json").expo.version;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type AccountSideMenuProps = {
  onPressAbout: () => void;
};

type MenuItemProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  isLast?: boolean;
  colorScheme?: "light" | "dark";
};

const MenuItem = memo<
  MenuItemProps & {
    textColor: string;
    borderColor: string;
    colorScheme: "light" | "dark";
  }
>(({ icon, label, onPress, textColor, borderColor, isLast, colorScheme }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItemButton,
      !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
    ]}
    android_ripple={{
      color:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    }}
  >
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color={textColor}
      style={styles.menuItemIcon}
    />
    <Text style={[styles.menuItemText, { color: textColor }]}>{label}</Text>
  </Pressable>
));

function AccountSideMenu({ onPressAbout }: AccountSideMenuProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  const showComingSoonToast = () => {
    ToastAndroid.showWithGravity(
      'Em desenvolvimento',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  }


  const menuItems: MenuItemProps[] = [
    {
      icon: "account-circle-outline",
      label: "Meu Perfil",
      onPress: showComingSoonToast,
    },
    {
      icon: "cog-outline",
      label: "Configurações",
      onPress: showComingSoonToast,
    },
    {
      icon: "shield-account-outline",
      label: "Privacidade",
      onPress: showComingSoonToast,
    },
    {
      icon: "help-circle-outline",
      label: "Ajuda & Suporte",
      onPress: showComingSoonToast,
    },
    {
      icon: "heart-outline",
      label: "Favoritos",
      onPress: () => router.push("/favorites"),
    },
    {
      icon: "bell-outline",
      label: "Notificações",
      onPress: showComingSoonToast,
    },
    {
      icon: "information-outline",
      label: "Sobre",
      onPress: onPressAbout,
    },
    {
      icon: "logout",
      label: "Sair",
      onPress: showComingSoonToast,
      isLast: true,
    },
  ];

  return (
    <View
      style={[
        styles.menuContainer,
        {
          backgroundColor: themeColors.background,
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
        <Text style={[styles.userEmail, { color: themeColors.secondaryText }]}>
          Faça login para personalizar
        </Text>
      </View>

      {/* Items do Menu */}
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
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
      <Text style={[styles.versionText, { color: themeColors.secondaryText }]}>
        {`Versão ${appVersion}`}
      </Text>
    </View>
  );
}

export default memo(AccountSideMenu);

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    bottom: 0,
    width: menuWidth,
    height: "100%",
    zIndex: 100,
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
    fontFamily: "Inter_500Medium",
  },
  versionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 12,
  },
});
