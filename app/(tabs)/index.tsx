import React, { useState } from 'react';
import { ScrollView, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import SearchBar from "@/components/SearchBar";
import HighlightCard from "@/components/HighlightCard";
import NewsCard from "@/components/NewsCard";

type DataType = {
  title: string;
  description: string;
  image: string;
};

const data: DataType[] = [
  {
    title: "Title 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: `https://picsum.photos/400/180?random=${Math.random()}`, // Uses Math.random() to generate a random image for each card
  },
  {
    title: "Title 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: `https://picsum.photos/400/180?random=${Math.random()}`,
  },
  {
    title: "Title 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: `https://picsum.photos/400/180?random=${Math.random()}`,
  },
];

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    console.log("Pesquisa submetida:", searchQuery);
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
          <Text style={styles.carrouselText}>🔥 Em alta</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={true}
          >
            {data.map((item, index) => {
              return (
                <HighlightCard
                  key={index}
                  description={item.description}
                  image={item.image}
                />
              );
            })}
          </ScrollView>
        </View>
        {/* Body */}
        <View style={styles.body}>
          {data.map((item, index) => {
            return (
              <NewsCard
                key={index}
                title={item.title}
                bodyText={item.description}
                image={item.image}
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
  carrouselText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 20,
  },
  body: {
    marginTop: 100,
  },
});
