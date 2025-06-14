import { key } from "@/constants/ApiKey";
import { getCategoryFromLabel } from "@/constants/Categories";
import { ArticleParams } from "@/constants/NewsData";
import { fetchNewsAPI } from "@/services/newsAPI";
import { formatTimeAgo } from "@/utils/dateFormat";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { getCache, setCache, HOME_NEWS_CACHE_KEY } from "@/utils/newsCache";

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
  errorMessage: string | null;
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
    errorMessage: null,
  },
  searchResults: {
    articles: [],
    loading: true,
    isRefreshing: false,
    loadingMore: false,
    hasMore: true,
    error: null,
    errorMessage: null,
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
  async (isRefresh: boolean = false, { getState, rejectWithValue }) => {
    try {
      const delay = isRefresh
        ? 500
        : Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);

      // Simula delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      const data = await fetchNewsAPI("", key);

      // Formata as datas
      const formattedArticles = formatArticles(data.articles);

      const currentState = getState() as RootState;
      const oldArticles = currentState.news.homeNews.articles;
      let finalArticlesList: ArticleWithOriginalDate[];

      if (isRefresh) {
        const newUrls = new Set(formattedArticles.map((a) => a.url));
        const filteredOldArticles = oldArticles.filter(
          (a) => !newUrls.has(a.url)
        );
        finalArticlesList = [...formattedArticles, ...filteredOldArticles];
      } else {
        finalArticlesList = formattedArticles;
      }

      await setCache(HOME_NEWS_CACHE_KEY, finalArticlesList);

      return { articles: finalArticlesList };
    } catch (error) {
      const cachedArticles = await getCache<ArticleWithOriginalDate[]>(
        HOME_NEWS_CACHE_KEY
      );
      if (cachedArticles && cachedArticles.length > 0) {
        console.error("API falhou, usando cache.", error);
        return {
          articles: cachedArticles,
          error:
            error instanceof Error
              ? error.message
              : "Ocorreu um erro desconhecido ao buscar as notícias.",
        };
      }
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido ao buscar as notícias."
      );
    }
  }
);

export const fetchMoreHomeNewsAsync = createAsyncThunk(
  "news/fetchMoreHomeNews",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastIndexOfNews = state.news.homeNews.articles.length - 1;
    const oldestArticle = state.news.homeNews.articles[lastIndexOfNews];
    if (!oldestArticle) {
      return rejectWithValue("Não há artigos anteriores para carregar mais.");
    }

    try {
      const toDate = oldestArticle.originalPublishedAt;
      const data = await fetchNewsAPI("", key, undefined, toDate);

      // Remove o primeiro elemento do array
      data.articles.splice(0, 1);

      const finalArticlesList = [
        ...state.news.homeNews.articles,
        ...formatArticles(data.articles),
      ];
      await setCache(HOME_NEWS_CACHE_KEY, finalArticlesList);

      // Retorna os artigos formatados após a remoção
      return formatArticles(data.articles);
    } catch (error) {
      console.error("Não foi possível carregar mais notícias.", error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar mais notícias."
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { loadingMore, hasMore } = state.news.homeNews;
      return !loadingMore && hasMore;
    },
  }
);

// --- Açoes para busca de dados searchScreen ---

export const fetchSearchNewsAsync = createAsyncThunk(
  "news/fetchSearchNews",
  async (searchTerm: string, { rejectWithValue }) => {
    try {
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
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Sua busca não pôde ser completada. Tente novamente."
      );
    }
  }
);

export const fetchMoreSearchNewsAsync = createAsyncThunk(
  "news/fetchMoreSearchNews",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const searchQuery = state.search.query;
    const lastIndexOfSearch = state.news.searchResults.articles.length - 1;
    const oldestArticle = state.news.searchResults.articles[lastIndexOfSearch];

    if (!oldestArticle) {
      return rejectWithValue("Não há resultados de busca para carregar mais.");
    }

    try {
      // Define a data do ultimo artigo
      const toDate = oldestArticle.originalPublishedAt;

      // Verifica se e categoria para busca especifica
      const category = getCategoryFromLabel(searchQuery);

      const data = await fetchNewsAPI(searchQuery, key, category, toDate);

      // Remove o primeiro elemento do array
      data.articles.splice(0, 1);

      // Retorna os artigos formatados após a remoção
      return formatArticles(data.articles);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar mais resultados."
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { loadingMore, hasMore } = state.news.searchResults;
      return !loadingMore && hasMore;
    },
  }
);

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetErrorMessage: (state) => {
      state.homeNews.errorMessage = initialState.homeNews.errorMessage;
      state.searchResults.errorMessage =
        initialState.searchResults.errorMessage;
    },
  },
  extraReducers: (builder) => {
    // --- Home news reducers ---
    builder
      .addCase(fetchHomeNewsAsync.pending, (state) => {
        state.homeNews.isRefreshing = state.homeNews.articles.length > 0;
        state.homeNews.loading = state.homeNews.articles.length === 0;
        state.homeNews.error = null;
        state.homeNews.errorMessage = null;
      })
      .addCase(fetchHomeNewsAsync.fulfilled, (state, action) => {
        state.homeNews.articles = action.payload.articles;
        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.hasMore = action.payload.articles.length > 0; // Se a primeira busca não retornar nada, não há mais o que buscar
        state.homeNews.error = action.payload.error || null;
        state.homeNews.errorMessage = action.payload.error || null;
      })
      .addCase(fetchHomeNewsAsync.rejected, (state, action) => {
        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.error = action.payload as string;
        state.homeNews.errorMessage = action.payload as string;
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
        state.homeNews.error = action.payload as string;
        state.homeNews.errorMessage = action.payload as string;
        state.homeNews.hasMore = false;
      })

      // Search news reducers
      .addCase(fetchSearchNewsAsync.pending, (state) => {
        state.searchResults.loading = true;
        state.searchResults.error = null;
        state.searchResults.errorMessage = null;
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
        state.searchResults.error = action.payload as string;
        state.searchResults.errorMessage = action.payload as string;
        state.searchResults.articles = [];
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
        state.searchResults.error = action.payload as string;
        state.searchResults.errorMessage = action.payload as string;
      });
  },
});

export const { resetErrorMessage } = newsSlice.actions;
export default newsSlice.reducer;
