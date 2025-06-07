import React, { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { ArticleParams } from "@/constants/NewsData";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { View } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type NewsListProps = {
  data: ArticleParams[];
  loading: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onPressItem: (item: ArticleParams) => void;
  ListHeaderComponent: React.ComponentType;
  skeletonCount?: number;
  onEndReached: ((info: { distanceFromEnd: number }) => void) | null;
  ListFooterComponent: React.JSX.Element | null;
  refreshControl?: boolean;
};

export default function NewsList({
  data,
  loading,
  isRefreshing = false,
  onRefresh,
  onPressItem,
  ListHeaderComponent,
  skeletonCount = 3,
  onEndReached,
  ListFooterComponent,
  refreshControl,
}: NewsListProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

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

  const renderNewsItem = useCallback(
    ({ item }: { item: ArticleParams }) => (
      <NewsCard
        key={item.url}
        title={item.title}
        bodyText={item.description}
        image={item.image}
        sourceName={item.source.name}
        time={item.publishedAt}
        onPress={() => onPressItem(item)}
      />
    ),
    [onPressItem]
  );

  if (loading) {
    return (
      <FlatList
        data={Array(skeletonCount).fill(null)}
        renderItem={() => <NewsCardSkeleton style={{ marginVertical: 20 }} />}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.skeletonContainer}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderNewsItem}
      keyExtractor={(item) => item.url}
      ListHeaderComponent={ListHeaderComponent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={
        refreshControl ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["rgb(29, 108, 122)"]}
            progressBackgroundColor={themeColors.background}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  skeletonContainer: {
    gap: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
});
