import { ArticleParams } from "@/constants/NewsData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

// Obtem todos os favoritos
export const getFavorites = async (): Promise<ArticleParams[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Falha ao buscar favoritos:", error);
    return [];
  }
};

// Adiciona um favorito
export const addFavorite = async (news: ArticleParams): Promise<void> => {
    try {
        const favorites = await getFavorites()

        // Evita duplicatas
        if (!favorites.some(fav => fav.url === news.url)) {
            const newsFavorites = [news, ...favorites]
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newsFavorites))
        }
    } catch (error) {
        console.error("Falha ao adicionar favoritos:", error);
        
    }
}

// Remove um favorito
export const removeFavorite = async (newsUrl: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(fav => fav.url !== newsUrl);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error("Falha ao remover favorito:", error);
  }
};

// Verifica se uma notícia é favorita
export const isFavorite = async (newsUrl: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.url === newsUrl);
  } catch (error) {
    console.error("Falha ao verificar favorito:", error);
    return false;
  }
};
