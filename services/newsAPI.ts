import { ArticleParams } from "@/constants/NewsData";
import { NewsCategory } from "@/constants/Categories";
import NetInfo from "@react-native-community/netinfo";

type NewsAPIResponse = {
  articles: ArticleParams[];
  totalArticles: number;
};

export class NewsAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "NewsAPIError";
  }
}

const cleanSearchTerm = (term: string): string => {
  return term
    .replace(/&/g, "e") // substitui & por 'e'
    .replace(/[+]/g, " ") // substitui + por espaço
    .replace(/[#]/g, "") // remove #
    .trim(); // remove espaços extras no início e fim
};

const TIMEOUT_MS = 15000 // 15 seg

export const fetchNewsAPI = async (
  searchTerm: string,
  apiKey: string,
  category?: NewsCategory | null,
  toDate?: string,
): Promise<NewsAPIResponse> => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      throw new NewsAPIError("Sem conexão com a internet");
    }

    const baseUrl = "https://gnews.io/api/v4/";
    let endpoint = "";
    const params = new URLSearchParams({
      country: "br",
      apikey: apiKey,
    });

    if (category) {
      endpoint = "top-headlines";
      params.append("category", category);
    } else {
      endpoint = "top-headlines";
      params.append("q", cleanSearchTerm(searchTerm));
    }

    if (toDate) {
      params.append("to", toDate);
    }

    const finalUrl = `${baseUrl}${endpoint}?${params.toString()}`;

    // Timeout para internet lenta
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);

    const response = await fetch(finalUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId); // Limpa timeout se a requisicao foi bem sucedida

    console.log("Procurando em: ", finalUrl);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.join(", ") ||
        "Ocorreu um erro no servidor de notícias.";

      throw new NewsAPIError(errorMessage, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error instanceof NewsAPIError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new NewsAPIError("Conexão muito lenta. Tente novamente.");
    }

    throw new NewsAPIError(
      "Não foi possível conectar ao serviço de notícias. Verifique sua conexão e tente novamente."
    );
  }
};
