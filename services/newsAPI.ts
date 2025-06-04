import { ArticleParams } from "@/constants/NewsData";

type NewsAPIResponse = {
  articles: ArticleParams[];
  totalArticles: number;
}

export class NewsAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NewsAPIError';
  }
}

export const fetchNewsAPI = async (searchTerm: string, apiKey: string): Promise<NewsAPIResponse> => {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?country=br&q=${searchTerm}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new NewsAPIError(
        'Falha ao buscar notícias',
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error;
    }
    throw new NewsAPIError(
      'Erro ao conectar com o servidor de notícias'
    );
  }
};
