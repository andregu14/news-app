import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import SearchBar from "@/components/SearchBar";
import HighlightCard from "@/components/HighlightCard";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "expo-router";
import { newsData, DataParams } from "@/constants/NewsData"; // Importar dados e tipo
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    console.log("Pesquisa submetida:", searchQuery);
  };

  // Função para navegar para os detalhes da notícia
  const handleCardPress = (item: DataParams) => {
    // Navegar para a tela de detalhes. Eventualmente passaremos o ID ou dados.
    console.log("Navegando para detalhes do item:", item.id);
    router.push({ pathname: "/newsDetails", params: { newsId: item.id } });
  };

  return (
    <View style={styles.container}>
      {/* Header Menu */}
      <Header style={styles.header} />
      <ScrollView>
        {/* Search Bar com estado controlado */}
        <SearchBar
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
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
            {newsData.slice(0, 4).map((item) => {
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
        {/* Body */}
        <View style={styles.body}>
          {newsData.map((item) => {
            return (
              <NewsCard
                key={item.id}
                title={item.title}
                bodyText={item.description}
                image={item.image}
                department={item.department}
                time={item.time}
                onPress={() => handleCardPress(item)}
              />
            );
          })}
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
  body: {
    gap: 80,
    marginTop: 100,
  },
});
