import { ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { newsData } from "@/constants/NewsData";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

const appVersion = require("../../app.json").expo.version;

export default function MenuScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  // Estado para notificações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Extrair departamentos únicos
  const departments = Array.from(
    new Set(newsData.map((item) => item.department))
  );

  // Função para navegar para notícias do departamento
  const handleDepartmentPress = (department: string) => {
    console.log("Navegando para departamento:", department);
    // TODO: Implementar navegação filtrada por departamento
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Cabeçalho do Menu */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Menu</Text>
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
        <Text style={styles.sectionTitle}>Departamentos</Text>
        {departments.map((department) => (
          <Pressable
            key={department}
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
        <Text style={styles.sectionTitle}>Configurações</Text>
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
              onValueChange={setNotificationsEnabled}
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
    fontWeight: "bold",
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
    fontWeight: "600",
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
    marginBottom: 10
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
    alignSelf: "center",
  },
});
