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
              marginTop: 40,
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
            marginBottom: 15,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 4,
              width: 7,
              height: 41,
              backgroundColor: themeColors.mainColor,
              borderRadius: 14,
            }}
          />
          <TitleText style={{ marginHorizontal: 19 }}>Notícias</TitleText>
          <Text
            style={{ marginHorizontal: 19, color: themeColors.secondaryText }}
          >
            Fique por dentro
          </Text>
        </View>
      )}
    </>
  );
}
