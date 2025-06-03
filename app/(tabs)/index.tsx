import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  useColorScheme,
  RefreshControl,
  Dimensions,
} from "react-native";
import { TitleText, View } from "@/components/Themed";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import SearchBar from "@/components/SearchBar";
import HighlightCard from "@/components/HighlightCard";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "expo-router";
import { newsData, ArticleParams } from "@/constants/NewsData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HighlightCardSkeleton from "@/components/HighlightCardSkeleton";
import Colors from "@/constants/Colors";
import NewsCardSkeleton from "@/components/NewsCardSkeleton";
import SideMenu from "@/components/SideMenu";
import AccountSideMenu from "@/components/AccountSideMenu";
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
import { formatDistanceToNowStrict } from "date-fns";
const { ptBR } = require("date-fns/locale");

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
        const response = await fetch(
          `https://gnews.io/api/v4/top-headlines?country=br&apikey=${apiKey}`
        );
        if (!response.ok) throw new Error("Falha ao buscar notícias");
        else console.log("Dados de todas as noticias extraidos com sucesso!");
        const data = await response.json();

        // Formatar as datas para "ha x tempo"
        const formattedArticles = data.articles.map(
          (article: ArticleParams) => {
            const timeAgo = formatDistanceToNowStrict(
              new Date(article.publishedAt),
              {
                addSuffix: true,
                locale: ptBR,
              }
            );
            return {
              ...article,
              publishedAt: timeAgo.replace("há", "Há"),
            };
          }
        );

        setNews(formattedArticles);
      } catch (error) {
        console.error("Erro ao buscar notícias, usando dados locais:", error);
        // Formatar as datas para "ha x tempo"
        const formattedArticles = newsData.articles.map(
          (article: ArticleParams) => {
            const timeAgo = formatDistanceToNowStrict(
              new Date(article.publishedAt),
              {
                addSuffix: true,
                locale: ptBR,
              }
            );
            return {
              ...article,
              publishedAt: timeAgo.replace("há", "Há"),
            };
          }
        );

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

  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      router.push({ pathname: "/searchResults", params: { query } });
      dispatch(setQuery(query));
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

  // Função para renderizar cada item da lista
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

  // Função chamada pelo RefreshControl
  const onRefresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  const handlePresentAboutUsModal = useCallback(() => {
    aboutUsRef.current?.present();
  }, []);

  const ItemSeparator = () => (
    <View
      style={[
        styles.separator,
        {
          backgroundColor: themeColors.borderColor,
        },
      ]}
    />
  );

  const ListHeader = () => (
    <>
      {/* Search Bar */}
      <SearchBar
        style={styles.searchBar}
        onSubmitEditing={handleSearchSubmit}
      />
      {/* Carrousel */}
      <View style={styles.carrousel}>
        <View style={styles.carrouselTextWrapper}>
          <TitleText style={[styles.carrouselText, { fontSize: 18 }]}>
            🔥 Em alta
          </TitleText>
          <MaterialCommunityIcons
            name="arrow-right"
            style={[
              styles.carrouselText,
              { color: themeColors.text, fontSize: 22 },
            ]}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollToOverflowEnabled={true}
        >
          {loading ? (
            // Mostrar Skeletons durante o carregamento
            <>
              <HighlightCardSkeleton />
              <HighlightCardSkeleton />
              <HighlightCardSkeleton />
              <HighlightCardSkeleton />
              <HighlightCardSkeleton />
            </>
          ) : (
            // Mostrar Cards reais após carregar
            news &&
            news.length > 0 &&
            news.slice(0, 5).map((item) => {
              return (
                <HighlightCard
                  key={item.url}
                  description={item.description}
                  image={item.image}
                  onPress={() => handleCardPress(item)}
                />
              );
            })
          )}
        </ScrollView>
      </View>
      <TitleText style={styles.listTitle}>🗞️ Últimas Notícias</TitleText>
    </>
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
        <StatusBar style="auto" />
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
              {loading && !isRefreshing ? (
                <FlatList
                  data={[1, 2, 3]}
                  renderItem={() => (
                    <NewsCardSkeleton style={{ marginVertical: 60 }} />
                  )}
                  keyExtractor={(item) => item.toString()}
                  ListHeaderComponent={ListHeader}
                  contentContainerStyle={{ gap: 20 }}
                  keyboardShouldPersistTaps="handled"
                />
              ) : (
                <FlatList
                  data={news}
                  renderItem={renderNewsItem}
                  keyExtractor={(item) => item.url}
                  ListHeaderComponent={ListHeader}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  ItemSeparatorComponent={ItemSeparator}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={onRefresh}
                      colors={["rgb(29, 108, 122)"]} // Cor do indicador no Android
                    />
                  }
                />
              )}
            </View>
            <AboutUsModal ref={aboutUsRef} appVersion={appVersion} />
          </ReanimatedDrawerLayout>
        </ReanimatedDrawerLayout>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginTop: 40,
    alignSelf: "center",
    width: "90%",
  },
  carrousel: {
    marginTop: 60,
    marginBottom: 90,
  },
  carrouselTextWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carrouselText: {
    fontSize: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  listTitle: {
    marginHorizontal: 20,
  },
  separator: {
    height: 1,
    marginHorizontal: 15,
    marginVertical: 15,
  },
});
