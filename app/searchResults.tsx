import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import ReanimatedDrawerLayout, {
  DrawerType,
  DrawerPosition,
  DrawerLayoutMethods,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import { useCallback, useEffect, useMemo, useRef } from "react";
import AccountSideMenu from "@/components/AccountSideMenu";
import SideMenu from "@/components/SideMenu";
import { ArticleParams } from "@/constants/NewsData";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AboutUsModal from "@/components/AboutUsModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import NewsListHeader from "@/components/NewsListHeader";
import NewsList from "@/components/NewsList";
import {
  fetchMoreSearchNewsAsync,
  fetchSearchNewsAsync,
  resetErrorMessage,
} from "@/store/newsSlice";
import { setQuery } from "@/store/searchSlice";
import { Image } from "expo-image";
import Toast from "@/components/ToastMessage";

const { width: screenWidth } = Dimensions.get("window");
const drawerWidth = screenWidth * 0.8;
const PRESS_COOLDOWN = 1000;

export default function SearchResults() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const dispatch = useDispatch<AppDispatch>();
  const leftDrawerRef = useRef<DrawerLayoutMethods>(null);
  const rightDrawerRef = useRef<DrawerLayoutMethods>(null);
  const aboutUsRef = useRef<BottomSheetModal>(null);
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const {
    articles: news,
    loading,
    error,
    hasMore,
    loadingMore,
    errorMessage,
  } = useSelector((state: RootState) => state.news.searchResults);
  const lastPressTimeRef = useRef(0);

  const appVersion = require("../app.json").expo.version;

  // Função para buscar notícias
  const fetchNews = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return;
      console.log("Buscando notícias para:", searchTerm);
      dispatch(fetchSearchNewsAsync(searchTerm));
    },
    [dispatch]
  );

  // Verifica se searchQuery mudou para fazer nova busca
  useEffect(() => {
    if (searchQuery?.trim()) {
      rightDrawerRef.current?.closeDrawer();
      fetchNews(searchQuery);
    }
  }, [searchQuery, fetchNews]);

  // Função para carregar mais items
  const handleLoadMore = useCallback(() => {
    console.log("Fim da lista atingida buscando mais noticias");
    if (hasMore && !loadingMore) {
      dispatch(fetchMoreSearchNewsAsync());
    }
  }, [dispatch, hasMore, loadingMore]);

  // Função de retry
  const handleRetry = useCallback(() => {
    if (searchQuery) {
      fetchNews(searchQuery);
    }
  }, [fetchNews, searchQuery]);

  // Função para submeter nova busca
  const handleSearchSubmit = useCallback(
    (query: string) => {
      dispatch(setQuery(query));
    },
    [dispatch]
  );

  // Mostra um toast onError
  useEffect(() => {
    if (errorMessage) {
      Toast.show({
        type: "error",
        text1: errorMessage as string,
        autoHide: false,
        position: "bottom",
        bottomOffset: insets.bottom + 50,
        onPress: () => {
          Toast.hide();
        },
      });
      dispatch(resetErrorMessage());
    }
  }, [errorMessage, dispatch]);

  // Componente para lista vazia
  const EmptyComponent = useMemo(
    () => (
      <View
        style={[styles.centerContainer, { marginBottom: insets.bottom * 2 }]}
      >
        <Text style={styles.centerText}>
          Nenhum resultado encontrado para{" "}
          <Text style={styles.queryText}>"{searchQuery}"</Text>
        </Text>
        <Image
          style={styles.image}
          source={require("@/assets/images/not_found.png")}
          contentFit="contain"
          alt="Nenhuma notícia encontrada"
        />
        <Text style={[styles.subText, { color: themeColors.secondaryText }]}>
          Tente buscar por outros termos.
        </Text>
      </View>
    ),
    [searchQuery]
  );

  // Componente de header da lista e memorizado
  const listHeader = useMemo(
    () => (
      <NewsListHeader
        showCarrousel={false}
        showTitle={false}
        handleSearchSubmit={handleSearchSubmit}
      />
    ),
    [handleSearchSubmit]
  );

  // Funções para controlar os menus
  const handleAccountPress = () => {
    leftDrawerRef.current?.openDrawer();
  };

  const handleMenuPress = () => {
    rightDrawerRef.current?.openDrawer();
  };

  // Função para navegar para os detalhes da notícia
  const handleCardPress = useCallback((item: ArticleParams) => {
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
  }, []);

  // Função para mostrar modal
  const handlePresentAboutUsModal = useCallback(() => {
    aboutUsRef.current?.present();
  }, []);

  return (
    <>
      {/* Status Bar "absolute" View */}
      <View
        style={{
          position: "absolute",
          backgroundColor: themeColors.headerBackground,
          height: insets.top,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      />
      <View style={{ flex: 1 }}>
        {/* Conteudo */}
        <ReanimatedDrawerLayout
          drawerWidth={drawerWidth}
          ref={leftDrawerRef}
          drawerPosition={DrawerPosition.LEFT}
          drawerType={DrawerType.FRONT}
          renderNavigationView={() => (
            <AccountSideMenu onPressAbout={handlePresentAboutUsModal} />
          )}
          drawerContainerStyle={{ marginTop: insets.top }}
        >
          <ReanimatedDrawerLayout
            drawerWidth={drawerWidth}
            ref={rightDrawerRef}
            drawerPosition={DrawerPosition.RIGHT}
            drawerType={DrawerType.FRONT}
            renderNavigationView={() => <SideMenu />}
            drawerContainerStyle={{ marginTop: insets.top }}
          >
            <View style={[styles.content, { paddingTop: insets.top }]}>
              <Header
                onMenuPress={handleMenuPress}
                onAccountPress={handleAccountPress}
              />
              <NewsList
                data={news}
                loading={loading}
                error={error}
                showError={error ? true : false}
                onRetry={handleRetry}
                onPressItem={handleCardPress}
                onEndReached={handleLoadMore}
                refreshControl={false}
                ListHeaderComponent={listHeader}
                ListEmptyComponent={EmptyComponent}
                ListFooterComponent={
                  loadingMore ? (
                    <ActivityIndicator
                      style={{ marginVertical: 20 }}
                      size="small"
                      color={themeColors.mainColor}
                    />
                  ) : null
                }
              />
            </View>
            <View
              style={[
                styles.bottomView,
                {
                  height: insets.bottom,
                  backgroundColor: themeColors.background,
                },
              ]}
            />
            <AboutUsModal ref={aboutUsRef} appVersion={appVersion} />
          </ReanimatedDrawerLayout>
        </ReanimatedDrawerLayout>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  centerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
  },
  queryText: {
    fontWeight: "bold",
    color: "rgb(29, 108, 122)",
  },
  image: {
    width: 150,
    height: 150,
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
