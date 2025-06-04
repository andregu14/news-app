import SearchBar from "./SearchBar";
import { TitleText } from "./Themed";
import { ViewStyle } from "react-native";
import HighlightCarousel from "./HighlightCarousel";
import { ArticleParams } from "@/constants/NewsData";

type NewsListHeaderProps = {
  data?: ArticleParams[];
  showSearch?: boolean;
  showCarrousel?: boolean;
  showTitle?: boolean;
  loading?: boolean;
  handleSearchSubmit?: (query: string) => void;
  searchBarStyle?: ViewStyle;
  defaultSearchValue?: string;
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
  defaultSearchValue,
  onHighlightCardPress,
}: NewsListHeaderProps) {
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
            }
          ]}
          onSubmitEditing={handleSearchSubmit}
          defaultValue={defaultSearchValue}
        />
      )}

      {/* Carrousel */}
      {showCarrousel && (
        <HighlightCarousel
          data={data}
          loading={loading}
          onCardPress={onHighlightCardPress}
          maxItems={8}
        />
      )}

      {/* Titulo da lista de noticias */}
      {showTitle && (
        <TitleText 
          style={{
            marginHorizontal: 20,
            marginBottom: 15,
          }}
        >
          🗞️ Últimas Notícias
        </TitleText>
      )}
    </>
  );
}