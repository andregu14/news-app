import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Image, ScrollView } from "react-native";
import { newsData, DataParams } from "@/constants/NewsData";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useState, useEffect } from "react";
import AuthorDetails from "@/components/AuthorDetails";

export default function NewsDetailsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const [newsItem, setNewsItem] = useState<DataParams>();

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await fetch(`http://192.168.15.5:3000/news/${newsId}`);
        if (!response.ok)
          throw new Error("Falha ao buscar detalhes da notícia");
        const data = await response.json();
        if (response.ok)
          console.log("Noticia encontrada com sucesso!", data.title);
        setNewsItem(data);
      } catch (error) {
        console.error(
          "Erro ao buscar detalhes da notícia, usando dados locais:",
          error
        );
        // Fallback para dados locais
        const localNewsItem = newsData.find(
          (item) => item.id.toString() === newsId
        );
        setNewsItem(localNewsItem);
      }
    };

    fetchNewsDetails();
  }, [newsId]);

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
        <AuthorDetails
          style={styles.authorDetails}
          date={newsItem.created_at ?? ""}
          department={newsItem.department}
          name={newsItem.author ?? ""}
        />
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
    marginTop: 30,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  authorDetails: {
    marginLeft: 20,
    marginTop: 20,
  },
  description: {
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "90%",
    alignSelf: "center",
  },
});
