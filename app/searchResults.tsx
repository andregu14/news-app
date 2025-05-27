import { View, Text } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
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
import SearchBar from "@/components/SearchBar";
import { DataParams } from "@/constants/NewsData";
import NewsCard from "@/components/NewsCard";
import { Image } from "expo-image";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AboutUsModal from "@/components/AboutUsModal";

const { width: screenWidth } = Dimensions.get("window");
const drawerWidth = screenWidth * 0.8;

export default function SearchResults() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const leftDrawerRef = useRef<DrawerLayoutMethods>(null);
  const rightDrawerRef = useRef<DrawerLayoutMethods>(null);
  const [news, setNews] = useState<DataParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const aboutUsRef = useRef<BottomSheetModal>(null);

  const appVersion = require("../app.json").expo.version;

  const handleSearchSubmit = useCallback(
    (query: string) => {
      console.log("Pesquisa submetida:", query);
      setSearchQuery(query);
      setLoading(true);
      fetchNews(query);
    },
    [router]
  );

  // Função para buscar notícias
  const fetchNews = useCallback(async (searchTerm: string) => {
    setLoading(true);

    // Delay para loading
    const delay = Math.floor(Math.random() * (2500 - 1000 + 1) + 2000);
    setTimeout(async () => {
      try {
        const endpoint = `http://192.168.15.5:3000/news/search/${encodeURIComponent(
          searchTerm
        )}`;

        const response = await fetch(endpoint);

        if (!response.ok) throw new Error("Falha ao buscar notícias");

        const data = await response.json();
        setNews(data.results);
      } catch (error) {
        console.error("Erro ao buscar notícias", error);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, []);

  useEffect(() => {
    fetchNews(searchQuery);
  }, [fetchNews, searchQuery]);

  // Funções para controlar os menus
  const handleAccountPress = () => {
    leftDrawerRef.current?.openDrawer();
  };

  const handleMenuPress = () => {
    rightDrawerRef.current?.openDrawer();
  };

  // Função para navegar para os detalhes da notícia
  const handleCardPress = useCallback(
    (item: DataParams) => {
      console.log("Navegando para detalhes do item:", item.id);
      router.push({ pathname: "/newsDetails", params: { newsId: item.id } });
    },
    [router]
  );

  const handlePresentAboutUsModal = useCallback(() => {
    aboutUsRef.current?.present();
  }, []);

  // Função para renderizar cada item da lista
  const renderNewsItem = useCallback(
    ({ item }: { item: DataParams }) => (
      <NewsCard
        key={item.id}
        title={item.title}
        bodyText={item.description}
        image={item.image}
        department={item.department}
        time={item.created_at || item.time}
        onPress={() => handleCardPress(item)}
      />
    ),
    [handleCardPress]
  );

  const ItemSeparator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: themeColors.borderColor,
        marginHorizontal: 15,
        marginVertical: 5,
      }}
    />
  );

  const ListHeader = () => (
    <>
      {/* Search Bar */}
      <SearchBar
        style={styles.searchBar}
        onSubmitEditing={handleSearchSubmit}
        defaultValue={searchQuery}
      />
    </>
  );

  const ShowResults = () => (
    <View style={{ flex: 1 }}>
      {loading ? (
        <>
          <ListHeader />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} />
          </View>
        </>
      ) : news.length > 0 ? (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item: DataParams) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ItemSeparatorComponent={ItemSeparator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ListHeader />
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
              style={{ marginTop: insets.top + 10 }}
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
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  searchBar: {
    marginVertical: 40,
    alignSelf: "center",
    width: "90%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    gap: 30,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
});
