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
import { useCallback, useEffect, useRef, useState } from "react";
import AccountSideMenu from "@/components/AccountSideMenu";
import SideMenu from "@/components/SideMenu";
import { ArticleParams } from "@/constants/NewsData";
import { Image } from "expo-image";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AboutUsModal from "@/components/AboutUsModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import NewsListHeader from "@/components/NewsListHeader";
import NewsList from "@/components/NewsList";
import { formatTimeAgo } from "@/utils/dateFormat";
import { fetchNewsAPI, NewsAPIError } from "@/services/newsAPI";

const { width: screenWidth } = Dimensions.get("window");
const drawerWidth = screenWidth * 0.8;

export default function SearchResults() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const leftDrawerRef = useRef<DrawerLayoutMethods>(null);
  const rightDrawerRef = useRef<DrawerLayoutMethods>(null);
  const [news, setNews] = useState<ArticleParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const aboutUsRef = useRef<BottomSheetModal>(null);
  const reduxQuery = useSelector((state: RootState) => state.search.query);
  const [searchQuery, setSearchQuery] = useState(reduxQuery || "");

  const appVersion = require("../app.json").expo.version;
  const apiKey = "aaaa"

  // Função para buscar notícias
  const fetchNews = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    // Delay para loading
    const delay = Math.floor(Math.random() * (2500 - 1000 + 1) + 2000);
    
    setTimeout(async () => {
      try {
        const data = await fetchNewsAPI(searchTerm, apiKey);
        
        // Formatar as datas para "ha x tempo"
        const formattedArticles = data.articles.map((article) => ({
          ...article,
          publishedAt: formatTimeAgo(article.publishedAt),
        }));

        setNews(formattedArticles);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        setError(
          error instanceof NewsAPIError
            ? error.message
            : "Erro ao buscar notícias. Tente novamente mais tarde."
        );
        setNews([]);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, []);

  useEffect(() => {
    if (reduxQuery && reduxQuery !== searchQuery) {
      setSearchQuery(reduxQuery);
      rightDrawerRef.current?.closeDrawer();
      fetchNews(reduxQuery);
    }
  }, [reduxQuery]);

  useEffect(() => {
    fetchNews(searchQuery);
  }, [fetchNews, searchQuery]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      setSearchQuery(query);
      setLoading(true);
      fetchNews(query);
    },
    [fetchNews]
  );

  // Funções para controlar os menus
  const handleAccountPress = () => {
    leftDrawerRef.current?.openDrawer();
  };

  const handleMenuPress = () => {
    rightDrawerRef.current?.openDrawer();
  };

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

  const handlePresentAboutUsModal = useCallback(() => {
    aboutUsRef.current?.present();
  }, []);

  const ShowResults = () => (
    <View style={{ flex: 1 }}>
      {loading ? (
        <>
          <NewsListHeader 
            showCarrousel={false} 
            showTitle={false}
            defaultSearchValue={searchQuery}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} />
          </View>
        </>
      ) : error ? (
        <View style={{ flex: 1 }}>
          <NewsListHeader
            showCarrousel={false}
            showTitle={false}
            handleSearchSubmit={handleSearchSubmit}
            defaultSearchValue={searchQuery}
          />
          <View style={styles.notFoundContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Image
              style={styles.notFoundImage}
              source={require("@/assets/images/not_found.png")}
              contentFit="cover"
              alt="Erro ao buscar notícias"
            />
          </View>
        </View>
      ) : news.length > 0 ? (
        <NewsList
          data={news}
          loading={loading}
          isRefreshing={loading}
          onRefresh={() => fetchNews(searchQuery)}
          onPressItem={handleCardPress}
          ListHeaderComponent={() => (
            <NewsListHeader
              showCarrousel={false}
              showTitle={false}
              searchBarStyle={{ marginBottom: 35 }}
              handleSearchSubmit={handleSearchSubmit}
              defaultSearchValue={searchQuery}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <NewsListHeader
            showCarrousel={false}
            showTitle={false}
            handleSearchSubmit={handleSearchSubmit}
            defaultSearchValue={searchQuery}
          />
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>
              Nenhuma notícia encontrada para
              <Text style={styles.queryText}> "{searchQuery}"</Text>
            </Text>
            <Image
              style={styles.notFoundImage}
              source={require("@/assets/images/not_found.png")}
              contentFit="cover"
              alt="Nenhuma noticia encontrada"
            />
          </View>
        </View>
      )}
    </View>
  );

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
            <View style={[styles.content]}>
              {/* Header */}
              <Header
                style={{ marginTop: insets.top }}
                onMenuPress={handleMenuPress}
                onAccountPress={handleAccountPress}
              />
              <ShowResults />
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 180,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 180,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  queryText: {
    fontWeight: "bold",
    color: "rgb(29, 108, 122)",
  },
  notFoundImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "red",
    fontWeight: "500",
  },
});
