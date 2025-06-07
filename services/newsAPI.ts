import { ArticleParams } from "@/constants/NewsData";
import { NewsCategory } from "@/constants/Categories";

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

export const fetchNewsAPI = async (
  searchTerm: string,
  apiKey: string,
  category?: NewsCategory,
  toDate?: string
): Promise<NewsAPIResponse> => {
  try {
    let endpoint = category
      ? `https://gnews.io/api/v4/top-headlines?country=br&category=${category}&apikey=${apiKey}`
      : `https://gnews.io/api/v4/top-headlines?country=br&q=${searchTerm}&apikey=${apiKey}`;

    if (toDate) {
      endpoint += `&to=${toDate}`;
    }

    const response = await fetch(endpoint);

    console.log("Procurando em: ", endpoint);

    if (!response.ok) {
      const errorData = await response.json();
      throw new NewsAPIError(
        errorData.errors.join(", ") || "Falha ao buscar notícias",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error;
    }
    throw new NewsAPIError("Erro ao conectar com o servidor de notícias");
  }
};
