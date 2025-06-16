import {
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useState, useCallback, useRef } from "react";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { getFavorites } from "@/utils/favoritesCache";
import { ArticleParams } from "@/constants/NewsData";
import NewsCard from "@/components/NewsCard";
import Colors from "@/constants/Colors";
import { View, Text } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const PRESS_COOLDOWN = 1000;

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<ArticleParams[]>([]);
  const lastPressTimeRef = useRef(0);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const favs = await getFavorites();
        if (favs !== favorites) {
          setFavorites(favs);
        }
      };
      loadFavorites();
    }, [])
  );

  // Função para navegar para os detalhes da notícia
  const handleCardPress = useCallback(
    (item: ArticleParams) => {
      // prevenção de múltiplos toques
      const now = Date.now();
      if (now - lastPressTimeRef.current < PRESS_COOLDOWN) {
        return;
      }
      lastPressTimeRef.current = now;

      console.log("Navegando para detalhes do item:", item.title);
      router.push({
        pathname: "/newsDetails",
        params: {
          newsTitle: item.title,
          newsDescription: item.description,
          newsContent: item.content,
          newsUrl: item.url,
          newsImage: item.image,
          newsPublishedAt: item.publishedAt,
          newsSourceName: item.source.name,
          newsSourceUrl: item.source.url,
        },
      });
    },
    [router]
  );

  const renderNewsItem = useCallback(
    ({ item }: { item: ArticleParams }) => (
      <NewsCard
        key={item.url}
        title={item.title}
        bodyText={item.description}
        image={item.image}
        sourceName={item.source.name}
        time={item.publishedAt}
        onPress={() => handleCardPress(item)}
      />
    ),
    [handleCardPress]
  );

  const ItemSeparator = useCallback(
    () => (
      <View
        style={[
          styles.separator,
          {
            backgroundColor: themeColors.borderColor,
          },
        ]}
      />
    ),
    [themeColors.borderColor]
  );

  const EmptyComponent = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorTextTitle}>
        Você ainda não tem notícias favoritas.
      </Text>
      <Text style={styles.errorTextMessage}>
        Adicione alguma notícia aos favoritos e tente novamente.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_700Bold",
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          headerTintColor: "#fff",
        }}
      />
      <FlatList
        data={favorites}
        renderItem={renderNewsItem}
        ListEmptyComponent={EmptyComponent}
        keyExtractor={(item) => item.url}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
      <View
        style={[
          styles.bottomView,
          {
            height: insets.bottom,
            backgroundColor: themeColors.background,
          },
        ]}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 100,
  },
  separator: {
    height: 1,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  listContainer: {
    flexGrow: 1,
  },
  errorTextTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  errorTextMessage: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
