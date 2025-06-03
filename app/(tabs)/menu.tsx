import { ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import { Text, TitleText, View } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { newsData } from "@/constants/NewsData";
import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import { setQuery } from "@/store/searchSlice";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const appVersion = require("../../app.json").expo.version;

export default function MenuScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Estado para notificações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const menuItems: string[] = [
    "Tecnologia",
    "Economia",
    "Ciência",
    "Esportes",
    "Política",
    "Entretenimento",
    "Saúde",
    "Mundo",
  ];

  // Função para navegar para notícias do departamento
  const handleDepartmentPress = useCallback(
    (department: string) => {
      console.log("Navegando para departamento:", department);
      router.push({ pathname: "/searchResults", params: { department } });
      dispatch(setQuery(department));
    },
    [router, newsData]
  );

  const handleNotificationsToggle = useCallback(() => {
    setNotificationsEnabled(!notificationsEnabled);
    Toast.show({
      type: notificationsEnabled ? "error" : "success",
      text1: notificationsEnabled
        ? "Notificações desativadas"
        : "Notificações ativadas",
      text2: notificationsEnabled
        ? "Você não receberá mais atualizações"
        : "Você receberá atualizações de notícias",
      visibilityTime: 4000,
      topOffset: insets.top + 10,
      onPress: () => Toast.hide(),
    });
  }, [notificationsEnabled]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Cabeçalho do Menu */}
      <View style={styles.headerSection}>
        <TitleText style={styles.headerTitle}>Menu</TitleText>
      </View>

      {/* Seção de Perfil */}
      <Pressable style={styles.profileSection}>
        <View style={styles.profileContent}>
          <View style={styles.avatarPlaceholder}>
            <MaterialCommunityIcons name="account" size={32} color={"#000"} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Visitante</Text>
            <Text
              style={[
                styles.profileSubtext,
                { color: themeColors.secondaryText },
              ]}
            >
              Faça login para personalizar
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={themeColors.secondaryText}
          />
        </View>
      </Pressable>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* Seção de Departamentos */}
      <View>
        <TitleText style={styles.sectionTitle}>Departamentos</TitleText>
        {menuItems.map((department, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: pressed
                  ? colorScheme === "dark"
                    ? "#333"
                    : "#f5f5f5"
                  : "transparent",
              },
            ]}
            onPress={() => handleDepartmentPress(department)}
          >
            <View style={styles.menuItemContent}>
              <MaterialCommunityIcons
                name={
                  department === "Tecnologia"
                    ? "laptop"
                    : department === "Economia"
                    ? "chart-line"
                    : department === "Ciência"
                    ? "flask"
                    : department === "Esportes"
                    ? "soccer"
                    : department === "Política"
                    ? "domain"
                    : department === "Entretenimento"
                    ? "movie"
                    : department === "Saúde"
                    ? "heart-pulse"
                    : department === "Mundo"
                    ? "earth"
                    : "newspaper"
                }
                size={24}
                color={themeColors.text}
              />
              <Text style={styles.menuItemText}>{department}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={themeColors.secondaryText}
                style={styles.chevron}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* Seção de Configurações */}
      <View>
        <TitleText style={styles.sectionTitle}>Configurações</TitleText>
        <View style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={themeColors.text}
            />
            <Text style={styles.menuItemText}>Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: "#767577", true: themeColors.tint }}
            />
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
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
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={themeColors.text}
            />
            <Text style={styles.menuItemText}>Configurações</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={themeColors.secondaryText}
              style={styles.chevron}
            />
          </View>
        </Pressable>
      </View>

      {/* Versão do App */}
      <Text style={[styles.versionText, { color: themeColors.secondaryText }]}>
        {`Versão ${appVersion}`}
      </Text>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    marginTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
  },
  profileSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  profileSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
  versionText: {
    textAlign: "center",
    marginTop: "10%",
    fontSize: 12,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
    alignSelf: "center",
  },
});
