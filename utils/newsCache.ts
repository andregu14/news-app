import AsyncStorage from "@react-native-async-storage/async-storage";

export const HOME_NEWS_CACHE_KEY = "homeNewsCache";

const CACHE_EXPIRATION_HOURS = 6; // Cache valido por 6 horas
const MAX_CACHE_ITEMS = 25 // Limite de itens no cache

/**
 * Salva dados no cache com um timestamp.
 */
export const setCache = async (key: string, data: any): Promise<void> => {
  try {
    // Limita o array aos primeiros MAX_CACHE_ITEMS itens
    const limitedData = Array.isArray(data) ? data.slice(0, MAX_CACHE_ITEMS) : data

    const item = {
      data: limitedData,
      timeStamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Falha ao salvar dados no cache: ", error);
  }
};

/**
 * Obtem dados do cache, se não estiverem expirados.
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const itemString = await AsyncStorage.getItem(key);
    if (!itemString) {
      return null;
    }

    const item = JSON.parse(itemString);
    const now = Date.now();
    const isExpired = 
      now - item.timeStamp > CACHE_EXPIRATION_HOURS * 60 * 60 * 1000;

    if (isExpired) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return item.data as T;
  } catch (error) {
    console.error("Falha ao recuperar dados do cache: ", error);
    return null;
  }
};
