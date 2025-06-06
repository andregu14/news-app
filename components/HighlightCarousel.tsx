import React, { useCallback } from "react";
import { FlatList, StyleSheet, ViewStyle, ListRenderItem } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TitleText, View } from "./Themed";
import HighlightCard from "./HighlightCard";
import HighlightCardSkeleton from "./HighlightCardSkeleton";
import { ArticleParams } from "@/constants/NewsData";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

type HighlightCarouselProps = {
  data?: ArticleParams[];
  loading?: boolean;
  maxItems?: number;
  style?: ViewStyle;
};

export default function HighlightCarousel({
  data = [],
  loading = false,
  maxItems = 5,
  style,
}: HighlightCarouselProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  // Função para navegar para os detalhes da notícia
  const handleCardPress = useCallback(
    (item: ArticleParams) => {
      console.log("Navegando para detalhes do item:", item.title);
      router.push({
        pathname: "/newsDetails",
        params: {
          newsTitle: encodeURIComponent(item.title),
          newsDescription: encodeURIComponent(item.description),
          newsContent: item.content,
          newsUrl: encodeURIComponent(item.url),
          newsImage: encodeURIComponent(item.image),
          newsPublishedAt: encodeURIComponent(item.publishedAt),
          newsSourceName: encodeURIComponent(item.source.name),
          newsSourceUrl: encodeURIComponent(item.source.url),
        },
      });
    },
    [router]
  );

  // Dados para renderizar (skeletons ou dados reais)
  const renderData = loading
    ? Array.from({ length: maxItems }, (_, index) => ({
        id: `skeleton-${index}`,
        isSkeletonCard: true,
      }))
    : data.slice(0, maxItems);

  const renderItem: ListRenderItem<any> = ({ item }) => {
    if (loading || item.isSkeletonCard) {
      return <HighlightCardSkeleton />;
    }

    return (
      <HighlightCard
        description={item.title}
        image={item.image}
        department={item.source.name}
        onPress={() => handleCardPress(item)}
      />
    );
  };

  if (!loading && (!data || data.length === 0)) {
    return null; // Não renderiza nada se não há dados
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header com título */}
      <View style={styles.header}>
        <FontAwesome6 name="fire" size={22} color={themeColors.mainColor} />
        <TitleText
          style={[
            styles.title,
            { fontSize: 18, position: "absolute", left: 50 },
          ]}
        >
          Em alta
        </TitleText>

        <MaterialCommunityIcons
          name="arrow-right"
          size={22}
          color={themeColors.mainColor}
        />
      </View>

      {/* Carrossel */}
      <FlatList
        data={renderData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          loading || item.isSkeletonCard
            ? `skeleton-${index}`
            : item.url || `item-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    marginBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 10, // Padding nas laterais para dar espaço
  },
});
