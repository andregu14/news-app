import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import SearchBar from "@/components/SearchBar";
import HighlightCard from "@/components/HighlightCard";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Header style={styles.header} />
      <SearchBar style={styles.searchBar} />
      <View style={styles.carrousel}>
        <Text style={styles.carrouselText}>🔥 Em alta</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} scrollToOverflowEnabled={true}>
          <HighlightCard key={1} />
          <HighlightCard key={2} />
          <HighlightCard key={3} />
        </ScrollView>
      </View>

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
    paddingLeft: 10
  },
  carrouselText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
