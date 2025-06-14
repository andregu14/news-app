import SearchBar from "./SearchBar";
import { TitleText, View, Text } from "./Themed";
import { useColorScheme, ViewStyle } from "react-native";
import HighlightCarousel from "./HighlightCarousel";
import { ArticleParams } from "@/constants/NewsData";
import Colors from "@/constants/Colors";

type NewsListHeaderProps = {
  data?: ArticleParams[];
  showSearch?: boolean;
  showCarrousel?: boolean;
  showTitle?: boolean;
  loading?: boolean;
  handleSearchSubmit?: (query: string) => void;
  searchBarStyle?: ViewStyle;
  onHighlightCardPress?: (item: ArticleParams) => void;
};

export default function NewsListHeader({
  data,
  showSearch = true,
  showCarrousel = true,
  showTitle = true,
  loading,
  handleSearchSubmit,
  searchBarStyle,
  onHighlightCardPress,
}: NewsListHeaderProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <>
      {/* Search Bar */}
      {showSearch && (
        <SearchBar
          style={[
            searchBarStyle,
            {
              marginTop: 25,
              alignSelf: "center",
              width: "90%",
            },
          ]}
          onSubmitEditing={handleSearchSubmit}
          loading={loading}
        />
      )}

      {/* Carrousel */}
      {showCarrousel && (
        <HighlightCarousel
          data={data}
          loading={loading}
          maxItems={6}
          onCardPress={onHighlightCardPress ? onHighlightCardPress : () => {}}
        />
      )}

      {/* Titulo da lista de noticias */}
      {showTitle && (
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 18,
            marginTop: 6,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              top: -1,
              width: 5,
              height: 32,
              backgroundColor: themeColors.mainColor,
              borderRadius: 2,
            }}
          />

          <View style={{ marginLeft: 16 }}>
            <TitleText
              style={{
                fontSize: 18,
                marginBottom: 2,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Notícias
            </TitleText>

            <Text
              style={{
                color: themeColors.secondaryText,
                fontSize: 13,
                opacity: 0.7,
              }}
            >
              Fique por dentro
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
