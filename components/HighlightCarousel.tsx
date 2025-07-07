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
import HighlightCardMain, {
  HighlightCardMainSkeleton,
} from "./HighlightCardMain";

type HighlightCarouselProps = {
  data?: ArticleParams[];
  loading?: boolean;
  maxItems?: number;
  style?: ViewStyle;
  onCardPress: (item: ArticleParams) => void;
};

export default function HighlightCarousel({
  data = [],
  loading = false,
  maxItems = 6,
  style,
  onCardPress,
}: HighlightCarouselProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  // Dados para renderizar (skeletons ou dados reais)
  const renderData = loading
    ? Array.from({ length: maxItems }, (_, index) => ({
        id: `skeleton-${index}`,
      }))
    : data.slice(1, maxItems);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => {
      if (loading) {
        return <HighlightCardSkeleton />;
      }

      return (
        <HighlightCard
          description={item.title}
          image={item.image}
          department={item.source.name}
          onPress={() => onCardPress(item)}
        />
      );
    },
    [loading, onCardPress]
  );

  if (!loading && (!data || data.length === 0)) {
    return null;
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
      {/* Main Card */}
      {loading ? (
        <HighlightCardMainSkeleton />
      ) : (
        <HighlightCardMain
          description={data[0].title}
          image={data[0].image}
          onPress={() => onCardPress(data[0])}
        />
      )}

      {/* Carrossel */}
      <FlatList
        data={renderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.url}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        initialNumToRender={3}
        windowSize={5}
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
    paddingHorizontal: 10,
  },
});
