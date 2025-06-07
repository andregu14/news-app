import { key } from "@/constants/ApiKey";
import { getCategoryFromLabel } from "@/constants/Categories";
import { ArticleParams, newsData } from "@/constants/NewsData";
import { fetchNewsAPI } from "@/services/newsAPI";
import { formatTimeAgo } from "@/utils/dateFormat";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface ArticleWithOriginalDate extends ArticleParams {
  originalPublishedAt: string;
}

interface NewsSectionState {
  articles: ArticleWithOriginalDate[];
  loading: boolean;
  isRefreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
}

interface NewsState {
  homeNews: NewsSectionState;
  searchResults: NewsSectionState;
}

const initialState: NewsState = {
  homeNews: {
    articles: [],
    loading: true,
    isRefreshing: false,
    loadingMore: false,
    hasMore: true,
    error: null,
  },
  searchResults: {
    articles: [],
    loading: true,
    isRefreshing: false,
    loadingMore: false,
    hasMore: true,
    error: null,
  },
};

// Funcao para formatar datas
const formatArticles = (articles: ArticleParams[]) => {
  return articles.map((article) => ({
    ...article,
    publishedAt: formatTimeAgo(article.publishedAt),
    originalPublishedAt: article.publishedAt,
  }));
};

// --- Açoes para busca de dados home ---

export const fetchHomeNewsAsync = createAsyncThunk(
  "news/fetchHomeNews",
  async (isRefresh: boolean = false) => {
    const delay = isRefresh
      ? 500
      : Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);

    // Simula delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const data = await fetchNewsAPI("", key);

    // Formata as datas
    const formattedArticles = formatArticles(data.articles);

    return { articles: formattedArticles, isRefresh };
  }
);

export const fetchMoreHomeNewsAsync = createAsyncThunk(
  "news/fetchMoreHomeNews",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const lastIndexOfNews = state.news.homeNews.articles.length - 1;
    const oldestArticle = state.news.homeNews.articles[lastIndexOfNews];

    if (!oldestArticle) {
      throw new Error("Não há artigos para basear a busca");
    }

    const toDate = oldestArticle.originalPublishedAt;
    const data = await fetchNewsAPI("", key, undefined, toDate);

    // Remove o primeiro elemento do array
    data.articles.splice(0, 1);

    // Retorna os artigos formatados após a remoção
    return formatArticles(data.articles);
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { loadingMore, hasMore } = state.news.homeNews;
      if (loadingMore || !hasMore) {
        return false;
      }
      return true;
    },
  }
);

// --- Açoes para busca de dados searchScreen ---

export const fetchSearchNewsAsync = createAsyncThunk(
  "news/fetchSearchNews",
  async (searchTerm: string) => {
    const delay = Math.floor(Math.random() * (2500 - 1000 + 1) + 2000);

    // Simula delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Verifica se e categoria para busca especifica
    const category = getCategoryFromLabel(searchTerm);

    let data;
    if (category) {
      data = await fetchNewsAPI(searchTerm, key, category);
    } else {
      data = await fetchNewsAPI(searchTerm, key);
    }

    // Formata as datas
    const formattedArticles = formatArticles(data.articles);

    return { articles: formattedArticles };
  }
);

export const fetchMoreSearchNewsAsync = createAsyncThunk(
  "news/fetchMoreSearchNews",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const searchQuery = state.search.query;
    const lastIndexOfSearch = state.news.searchResults.articles.length - 1;
    const oldestArticle = state.news.searchResults.articles[lastIndexOfSearch];

    // Verifica se e categoria para busca especifica
    const category = getCategoryFromLabel(searchQuery);

    if (!oldestArticle) {
      throw new Error("Não há artigos para basear a busca");
    }
    
    // Define a data do ultimo artigo
    const toDate = oldestArticle.originalPublishedAt;

    let data;
    if (category) {
      data = await fetchNewsAPI(searchQuery, key, category, toDate);
    } else {
      data = await fetchNewsAPI(searchQuery, key, undefined, toDate);
    }
    // Remove o primeiro elemento do array
    data.articles.splice(0, 1);

    // Retorna os artigos formatados após a remoção
    return formatArticles(data.articles);
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { loadingMore, hasMore } = state.news.searchResults;
      if (loadingMore || !hasMore) {
        return false;
      }
      return true;
    },
  }
);

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Home news reducers ---
    builder
      .addCase(fetchHomeNewsAsync.pending, (state) => {
        if (state.homeNews.articles.length > 0) {
          state.homeNews.isRefreshing = true;
        } else {
          state.homeNews.loading = true;
        }
        state.homeNews.error = null;
      })
      .addCase(fetchHomeNewsAsync.fulfilled, (state, action) => {
        if (action.payload.isRefresh) {
          // Se refresh verifica e remove noticias com urls duplicadas adicionando as noticias novas no comeco
          const newUrls = new Set(
            action.payload.articles.map((article) => article.url)
          );

          const filteredOldArticles = state.homeNews.articles.filter(
            (article) => !newUrls.has(article.url)
          );

          state.homeNews.articles = [
            ...action.payload.articles,
            ...filteredOldArticles,
          ];
        } else {
          // Carga inicial
          state.homeNews.articles = action.payload.articles;
        }

        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.hasMore = action.payload.articles.length > 0; // Se a primeira busca não retornar nada, não há mais o que buscar
      })
      .addCase(fetchHomeNewsAsync.rejected, (state, action) => {
        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.error =
          action.error.message || "Erro ao buscar notícias.";
        state.homeNews.articles = formatArticles(newsData.articles); // Fallback temporario
        state.homeNews.hasMore = false;
      })
      // --- fetchMoreHomeNews ---
      .addCase(fetchMoreHomeNewsAsync.pending, (state) => {
        state.homeNews.loadingMore = true;
      })
      .addCase(fetchMoreHomeNewsAsync.fulfilled, (state, action) => {
        // Adiciona os novos artigos a lista existente
        state.homeNews.articles.push(...action.payload);
        state.homeNews.loadingMore = false;
        // Se a API retornar um array vazio, significa que não há mais notícias
        state.homeNews.hasMore = action.payload.length > 0;
      })
      .addCase(fetchMoreHomeNewsAsync.rejected, (state, action) => {
        state.homeNews.loadingMore = false;
        state.homeNews.error =
          action.error.message || "Erro ao carregar mais notícias.";
      })

      // Search news reducers
      .addCase(fetchSearchNewsAsync.pending, (state) => {
        state.searchResults.loading = true;
        state.searchResults.error = null;
        state.searchResults.articles = []; // Limpa resultados antigos ao iniciar nova busca
        state.searchResults.hasMore = true;
      })
      .addCase(fetchSearchNewsAsync.fulfilled, (state, action) => {
        state.searchResults.articles = action.payload.articles;
        state.searchResults.loading = false;
        state.searchResults.hasMore = action.payload.articles.length > 0;
      })
      .addCase(fetchSearchNewsAsync.rejected, (state, action) => {
        state.searchResults.loading = false;
        state.searchResults.error = action.error.message || "Erro na busca.";
        state.searchResults.articles = formatArticles(newsData.articles);
        state.searchResults.hasMore = false;
      })
      // fetchMoreSearchNews
      .addCase(fetchMoreSearchNewsAsync.pending, (state) => {
        state.searchResults.loadingMore = true;
      })
      .addCase(fetchMoreSearchNewsAsync.fulfilled, (state, action) => {
        state.searchResults.articles.push(...action.payload);
        state.searchResults.loadingMore = false;
        state.searchResults.hasMore = action.payload.length > 0;
      })
      .addCase(fetchMoreSearchNewsAsync.rejected, (state, action) => {
        state.searchResults.loadingMore = false;
        state.searchResults.error =
          action.error.message || "Erro ao carregar mais resultados.";
      });
  },
});

export default newsSlice.reducer;
