import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import SearchBar from "@/components/SearchBar";
import HighlightCard from "@/components/HighlightCard";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "expo-router";
import { newsData, DataParams } from "@/constants/NewsData";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabOneScreen() {
  const [news, setNews] = useState<DataParams[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://192.168.15.5:3000/news/");
        if (!response.ok) throw new Error("Falha ao buscar notícias");
        else console.log("Dados de todas as noticias extraidos com sucesso!");
        const data = await response.json();
        setNews(data.news);
      } catch (error) {
        console.error("Erro ao buscar notícias, usando dados locais:", error);
        setNews(newsData); // Fallback para dados locais
      }
    };

    fetchNews();
  }, []);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      // Adicionar aqui a lógica para navegar ou filtrar com a 'query'
      // Exemplo: router.push({ pathname: "/searchResults", params: { query } });
    },
    [router]
  );

  // Função para navegar para os detalhes da notícia
  const handleCardPress = useCallback(
    (item: DataParams) => {
      console.log("Navegando para detalhes do item:", item.id);
      router.push({ pathname: "/newsDetails", params: { newsId: item.id } });
    },
    [router]
  );

  // Função para renderizar cada item da lista
  const renderNewsItem = useCallback(
    ({ item }: { item: DataParams }) => (
      <NewsCard
        key={item.id}
        title={item.title}
        bodyText={item.description}
        image={item.image}
        department={item.department}
        time={item.created_at || item.time}
        onPress={() => handleCardPress(item)}
        style={styles.newsCard}
      />
    ),
    [handleCardPress]
  );

  // Função para extrair a chave única de cada item
  const keyExtractor = useCallback(
    (item: DataParams) => item.id.toString(),
    []
  );

  const ListHeader = () => (
    <>
      {/* Header Menu */}
      <Header style={styles.header} />
      {/* Search Bar */}
      <SearchBar
        style={styles.searchBar}
        onSubmitEditing={handleSearchSubmit}
      />
      {/* Carrousel */}
      <View style={styles.carrousel}>
        <View style={styles.carrouselTextWrapper}>
          <Text style={styles.carrouselText}>🔥 Em alta</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            style={styles.carrouselText}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollToOverflowEnabled={true}
        >
          {news &&
            news.length > 0 &&
            news.slice(0, 4).map((item) => {
              return (
                <HighlightCard
                  key={item.id}
                  description={item.description}
                  image={item.image}
                  onPress={() => handleCardPress(item)}
                />
              );
            })}
        </ScrollView>
      </View>
      <Text style={styles.listTitle}>🗞️ Últimas Notícias</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContentContainer}
        keyboardShouldPersistTaps="handled"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 45,
  },
  searchBar: {
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
  },
  carrousel: {
    marginTop: 60,
    marginBottom: 90,
  },
  carrouselTextWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carrouselText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: -10,
  },
  newsCard: {
    marginHorizontal: 20,
    marginTop: 60,
  },
  listContentContainer: {
    paddingBottom: 20,
  }
});
