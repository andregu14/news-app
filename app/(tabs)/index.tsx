import React, { useEffect, useCallback, useRef, useMemo } from "react";
import {
  StyleSheet,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import { ArticleParams } from "@/constants/NewsData";
import Colors from "@/constants/Colors";
import SideMenu from "@/components/SideMenu";
import AccountSideMenu from "@/components/AccountSideMenu";
import NewsList from "@/components/NewsList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReanimatedDrawerLayout, {
  DrawerType,
  DrawerPosition,
  DrawerLayoutMethods,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import AboutUsModal from "@/components/AboutUsModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeNewsAsync, fetchMoreHomeNewsAsync } from "@/store/newsSlice";
import { RootState, AppDispatch } from "@/store";
import NewsListHeader from "@/components/NewsListHeader";
import { setQuery } from "@/store/searchSlice";
import Toast from "@/components/ToastMessage";
import { resetErrorMessage } from "@/store/newsSlice";

const { width: screenWidth } = Dimensions.get("window");
const drawerWidth = screenWidth * 0.8;
const appVersion = require("../../app.json").expo.version;
const PRESS_COOLDOWN = 1000;

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const leftDrawerRef = useRef<DrawerLayoutMethods>(null);
  const rightDrawerRef = useRef<DrawerLayoutMethods>(null);
  const aboutUsRef = useRef<BottomSheetModal>(null);
  const lastPressTimeRef = useRef(0);

  // Selecionar dados do Redux
  const {
    articles: news,
    loading,
    isRefreshing,
    loadingMore,
    hasMore,
    error,
    errorMessage,
  } = useSelector((state: RootState) => state.news.homeNews);
  const searchQuery = useSelector((state: RootState) => state.search.query);

  // Função para buscar notícias
  const fetchNews = useCallback(
    (refresh = false) => {
      dispatch(fetchHomeNewsAsync(refresh));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Função chamada pelo RefreshControl
  const onRefresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  // Função para carregar mais items
  const handleLoadMore = useCallback(() => {
    console.log("Fim da lista atingida buscando mais noticias");
    if (hasMore && !loadingMore) {
      dispatch(fetchMoreHomeNewsAsync());
    }
  }, [dispatch, hasMore, loadingMore]);

  // Função para submeter nova busca
  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      dispatch(setQuery(query));
      router.push({ pathname: "/searchResults" });
    },
    [dispatch, router]
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

  // Fechar ambos os menus
  const closeAllDrawers = useCallback(() => {
    leftDrawerRef.current?.closeDrawer();
    rightDrawerRef.current?.closeDrawer();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Quando a tela perde o foco fecha ambos os sideMenus
      return () => {
        closeAllDrawers();
      };
    }, [closeAllDrawers])
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

  // Funções para controlar os menus
  const handleAccountPress = () => {
    leftDrawerRef.current?.openDrawer();
  };

  const handleMenuPress = () => {
    rightDrawerRef.current?.openDrawer();
  };

  const closeRightDrawer = useCallback(() => {
    rightDrawerRef.current?.closeDrawer();
  }, []);

  const handlePresentAboutUsModal = useCallback(() => {
    aboutUsRef.current?.present();
  }, []);

  // Componente de header da lista memorizado
  const listHeader = useMemo(() => {
    return (
      <NewsListHeader
        data={news.slice(0, 5)}
        loading={loading && news.length === 0}
        handleSearchSubmit={handleSearchSubmit}
        onHighlightCardPress={handleCardPress}
        showTitle={news.length > 0 || loading}
        showCarrousel={news.length > 0 || loading}
      />
    );
  }, [news, loading, handleSearchSubmit, handleCardPress]);

  return (
    <>
      {/* Status Bar "absolute" View */}
      <View
        style={{
          position: "absolute",
          backgroundColor: themeColors.headerBackground,
          height: insets.top,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      />
      <View style={{ flex: 1 }}>
        <ReanimatedDrawerLayout
          drawerWidth={drawerWidth}
          ref={leftDrawerRef}
          drawerPosition={DrawerPosition.LEFT}
          drawerType={DrawerType.FRONT}
          onDrawerSlide={() => rightDrawerRef.current?.closeDrawer()}
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
            renderNavigationView={() => (
              <SideMenu onCloseDrawer={closeRightDrawer} />
            )}
            drawerContainerStyle={{ marginTop: insets.top }}
          >
            <View style={[styles.container, { paddingTop: insets.top }]}>
              {/* Header */}
              <Header
                onMenuPress={handleMenuPress}
                onAccountPress={handleAccountPress}
              />
              <NewsList
                data={news.slice(5)}
                loading={loading}
                error={error}
                showError={news.length === 0}
                onRetry={fetchNews}
                isRefreshing={isRefreshing}
                onRefresh={onRefresh}
                onPressItem={handleCardPress}
                onEndReached={handleLoadMore}
                ListHeaderComponent={listHeader}
                ListFooterComponent={
                  loadingMore ? (
                    <ActivityIndicator
                      style={{ marginVertical: 20 }}
                      size={"small"}
                      color={themeColors.mainColor}
                    />
                  ) : null
                }
              />
            </View>
            <AboutUsModal ref={aboutUsRef} appVersion={appVersion} />
          </ReanimatedDrawerLayout>
        </ReanimatedDrawerLayout>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
