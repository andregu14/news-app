import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Image, ScrollView } from "react-native";
import { newsData } from "@/constants/NewsData";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function NewsDetailsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { newsId } = useLocalSearchParams<{ newsId: string }>();

  // Encontrar a notícia correspondente
  // Certifique-se de que newsId é um número antes de comparar
  const newsItem = newsData.find((item) => item.id.toString() === newsId);

  // Se a notícia não for encontrada, mostrar uma mensagem
  if (!newsItem) {
    return (
      <View style={styles.container}>
        <Text>Notícia não encontrada.</Text>
      </View>
    );
  }

  // Renderizar os detalhes da notícia encontrada
  return (
    <View style={styles.container}>
      {/* Configurar o título via Stack.Screen options */}
      <Stack.Screen
        options={{
          title: newsItem.department,
          headerTitleStyle: { fontSize: 18 },
        }}
      />
      <ScrollView>
        <Image
          source={{ uri: newsItem.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{newsItem.title}</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.description}>{newsItem.description}</Text>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.secondaryText }]}>
            Publicado há {newsItem.time}
          </Text>
          <Text style={[styles.footerText, { color: themeColors.secondaryText }]}>
            Em {newsItem.department}
          </Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    marginTop: 10,
    height: 1,
    width: "90%",
    alignSelf: "center"
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    marginTop: 5,
  },
});
