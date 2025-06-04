import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, useColorScheme, Dimensions } from "react-native";
import { View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { newsData, ArticleParams } from "@/constants/NewsData";
import Colors from "@/constants/Colors";
import SideMenu from "@/components/SideMenu";
import AccountSideMenu from "@/components/AccountSideMenu";
import NewsList from "@/components/NewsList";
import { fetchNewsAPI } from "@/services/newsAPI";
import { formatTimeAgo } from "@/utils/dateFormat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReanimatedDrawerLayout, {
  DrawerType,
  DrawerPosition,
  DrawerLayoutMethods,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import AboutUsModal from "@/components/AboutUsModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch } from "react-redux";
import { setQuery } from "@/store/searchSlice";
import NewsListHeader from "@/components/NewsListHeader";

const { width: screenWidth } = Dimensions.get("window");
const drawerWidth = screenWidth * 0.8;
const appVersion = require("../../app.json").expo.version;

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const dispatch = useDispatch();
  const [news, setNews] = useState<ArticleParams[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const leftDrawerRef = useRef<DrawerLayoutMethods>(null);
  const rightDrawerRef = useRef<DrawerLayoutMethods>(null);
  const aboutUsRef = useRef<BottomSheetModal>(null);

  // const apiKey = "f2abf5755e8f5f3db39550a53a4daa18";
  const apiKey = "aaaa";

  // Função para buscar notícias
  const fetchNews = useCallback(async (refresh = false) => {
    if (!refresh) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    // Delay para refresh e loading
    const delay = refresh
      ? 500
      : Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);

    setTimeout(async () => {
      try {
        const data = await fetchNewsAPI("", apiKey);
        console.log("Dados de todas as notícias extraídos com sucesso!");

        // Formatar as datas para "ha x tempo"
        const formattedArticles = data.articles.map((article) => ({
          ...article,
          publishedAt: formatTimeAgo(article.publishedAt),
        }));

        setNews(formattedArticles);
      } catch (error) {
        console.error("Erro ao buscar notícias, usando dados locais:", error);
        
        // Formatar as datas para "ha x tempo" usando dados locais
        const formattedArticles = newsData.articles.map((article) => ({
          ...article,
          publishedAt: formatTimeAgo(article.publishedAt),
        }));

        setNews(formattedArticles); // Fallback para dados locais
      } finally {
        if (!refresh) {
          setLoading(false);
        }
        setIsRefreshing(false);
      }
    }, delay);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Função chamada pelo RefreshControl
  const onRefresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      dispatch(setQuery(query));
      router.push({ pathname: "/searchResults" });
    },
    [router]
  );

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
                data={news}
                loading={loading}
                isRefreshing={isRefreshing}
                onRefresh={onRefresh}
                onPressItem={handleCardPress}
                ListHeaderComponent={() => (
                  <NewsListHeader
                    data={news}
                    loading={loading}
                    handleSearchSubmit={handleSearchSubmit}
                  />
                )}
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
  }
});
