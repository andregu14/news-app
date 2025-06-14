import { Text, TitleText, View } from "@/components/Themed";
import { useLocalSearchParams, Stack, useFocusEffect } from "expo-router";
import { StyleSheet, ScrollView, Share } from "react-native";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import Colors, { departmentColors } from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import AuthorDetails from "@/components/AuthorDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useRef, useState } from "react";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "@/utils/favoritesCache";
import { ArticleParams } from "@/constants/NewsData";
import { Ionicons } from "@expo/vector-icons";
import Toast from "@/components/ToastMessage";
import { ExternalLink } from "@/components/ExternalLink";

const SHARE_PRESS_COOLDOWN = 2000;
const FAVORITE_PRESS_COOLDOWN = 1000;

export default function NewsDetailsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const params = useLocalSearchParams();
  const newsTitle = params.newsTitle as string;
  const newsDescription = params.newsDescription as string;
  const newsContent = params.newsContent as string;
  const newsUrl = params.newsUrl as string;
  const newsImage = params.newsImage as string;
  const newsPublishedAt = params.newsPublishedAt as string;
  const newsSourceName = params.newsSourceName as string;
  const newsSourceUrl = params.newsSourceUrl as string;

  const insets = useSafeAreaInsets();
  const colorsConfig = departmentColors["Tecnologia"];

  const [isFavorited, setIsFavorited] = useState(false);
  const lastPressTimeFavoriteRef = useRef(0);
  const lastPressTimeShareRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const checkFavoriteStatus = async () => {
        const favorited = await isFavorite(newsUrl);
        setIsFavorited(favorited);
      };
      checkFavoriteStatus();
    }, [newsUrl])
  );

  const toggleFavorite = async () => {
    const newsItem: ArticleParams = {
      title: newsTitle,
      description: newsDescription,
      content: newsContent,
      url: newsUrl,
      image: newsImage,
      publishedAt: newsPublishedAt,
      source: {
        name: newsSourceName,
        url: newsSourceUrl,
      },
    };

    // prevenção de múltiplos toques
    const now = Date.now();
    if (now - lastPressTimeFavoriteRef.current < FAVORITE_PRESS_COOLDOWN) {
      return;
    }
    lastPressTimeFavoriteRef.current = now;

    if (isFavorited) {
      await removeFavorite(newsUrl);
      Toast.show({
        type: "favorite_removed",
        text1: "Removido dos Favoritos",
        position: "top",
        visibilityTime: 2000,
        topOffset: insets.top + 20,
        onPress: () => Toast.hide(),
      });
    } else {
      await addFavorite(newsItem);
      Toast.show({
        type: "favorite_added",
        text1: "Adicionado aos Favoritos",
        position: "top",
        visibilityTime: 2000,
        topOffset: insets.top + 20,
        onPress: () => Toast.hide(),
      });
    }
    setIsFavorited(!isFavorited);
  };

  const handleShare = async () => {
    try {
      // prevenção de múltiplos toques
      const now = Date.now();
      if (now - lastPressTimeShareRef.current < SHARE_PRESS_COOLDOWN) {
        return;
      }
      lastPressTimeShareRef.current = now;

      const result = await Share.share({
        message: `${newsTitle}\n\nConfira esta notícia em: ${newsUrl}`,
        url: newsUrl,
        title: newsTitle,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log();
          console.log(`Compartilhado via ${result.activityType}`);
        } else {
          console.log("Notícia compartilhada com sucesso!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Compartilhamento cancelado.");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const IconButton = ({ onPress, style, children }: PressableProps) => (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
      }}
      hitSlop={16}
      android_ripple={{
        borderless: true,
      }}
    >
      {children}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: newsSourceName,
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_700Bold",
            color: colorsConfig.backgroundColor ?? themeColors.text,
          },
          headerStyle: {
            backgroundColor: colorsConfig?.textColor ?? themeColors.background,
          },
          headerTintColor: colorsConfig?.backgroundColor ?? themeColors.text,

          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <IconButton onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorited ? "heart" : "heart-outline"}
                  size={24}
                  color={"#fff"}
                />
              </IconButton>
              <IconButton onPress={handleShare}>
                <Ionicons
                  name={"share-social-sharp"}
                  size={24}
                  color={"#fff"}
                />
              </IconButton>
            </View>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={newsImage} style={styles.image} contentFit="cover" />
        <TitleText style={styles.title}>{newsTitle}</TitleText>
        <Text
          style={[styles.description, { color: themeColors.secondaryText }]}
        >
          {newsDescription}
        </Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <AuthorDetails
          style={styles.authorDetails}
          date={newsPublishedAt}
          department={newsSourceName}
          name={newsSourceName}
        />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Text style={styles.content}>{`${newsContent}`}</Text>
        <View style={styles.externalLinkContainer}>
          <ExternalLink href={newsUrl}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons
                name="open-outline"
                size={20}
                color={themeColors.mainColor}
              />
              <Text
                style={[
                  styles.externalLinkText,
                  { color: themeColors.mainColor },
                ]}
              >
                Ler matéria completa
              </Text>
            </View>
          </ExternalLink>
        </View>

        <View
          style={[styles.separator, { marginBottom: insets.bottom + 20 }]}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </ScrollView>

      <StatusBar style="light" />
      <View
        style={[
          styles.bottomView,
          {
            height: insets.bottom,
            backgroundColor: themeColors.background,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: "100%",
    height: 250,
  },
  title: {
    marginVertical: 20,
    paddingHorizontal: 20,
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  description: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  authorDetails: {
    marginHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: "90%",
    alignSelf: "center",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  externalLinkContainer: {
    marginVertical: 25,
    alignItems: "center",
  },
  externalLinkText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textDecorationLine: "underline",
  },
});
