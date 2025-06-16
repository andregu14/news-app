import React, { useCallback } from "react";
import { Button, FlatList, RefreshControl, StyleSheet } from "react-native";
import { ArticleParams } from "@/constants/NewsData";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { View, Text, TitleText } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";

type NewsListProps = {
  data: ArticleParams[];
  loading: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onPressItem: (item: ArticleParams) => void;
  ListHeaderComponent?: React.JSX.Element;
  skeletonCount?: number;
  onEndReached: ((info: { distanceFromEnd: number }) => void) | null;
  ListFooterComponent: React.JSX.Element | null;
  refreshControl?: boolean;
  error: string | null;
  showError?: boolean;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  onRetry: () => void;
};

const ErrorComponent = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View style={styles.centerContainer}>
    <TitleText style={styles.errorTextTitle}>Ops, algo deu errado.</TitleText>
    <MaterialIcons
      name="error"
      size={70}
      color="red"
      style={{ marginBottom: 10 }}
    />
    <Text style={styles.errorTextMessage}>{message}</Text>
    <Button title="Tentar Novamente" onPress={onRetry} color={"#00695C"} />
  </View>
);

const EmptyComponent = (onRetry: () => void) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTextTitle}>Nenhuma notícia encontrada.</Text>
    <Text style={styles.errorTextMessage}>Tente novamente mais tarde.</Text>
    <Button title="Tentar Novamente" onPress={onRetry} color={"#00695C"} />
  </View>
);

export default function NewsList({
  data,
  loading,
  isRefreshing = false,
  onRefresh,
  onPressItem,
  ListHeaderComponent,
  ListEmptyComponent,
  skeletonCount = 3,
  onEndReached,
  ListFooterComponent,
  refreshControl = true,
  error,
  onRetry,
  showError = false,
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

  // Estado de Loading Inicial
  if (loading && data.length === 0) {
    return (
      <FlatList
        data={Array(skeletonCount).fill(null)}
        renderItem={() => <NewsCardSkeleton />}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.skeletonContainer}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  // Estado de Erro
  if (error && showError) {
    return (
      <View style={{ flex: 1 }}>
        {ListHeaderComponent}
        <ErrorComponent message={error || ""} onRetry={onRetry} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderNewsItem}
      keyExtractor={(item) => item.url}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent ?? (() => EmptyComponent(onRetry))}
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
      maxToRenderPerBatch={5}
      windowSize={7}
      initialNumToRender={3}
      removeClippedSubviews
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
    marginBottom: 100,
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
});
