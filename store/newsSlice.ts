import { key } from "@/constants/ApiKey";
import { getCategoryFromLabel } from "@/constants/Categories";
import { ArticleParams, newsData } from "@/constants/NewsData";
import { fetchNewsAPI } from "@/services/newsAPI";
import { formatTimeAgo } from "@/utils/dateFormat";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface NewsState {
  homeNews: {
    articles: ArticleParams[];
    loading: boolean;
    isRefreshing: boolean;
    error: string | null;
  };

  searchResults: {
    articles: ArticleParams[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: NewsState = {
  homeNews: {
    articles: [],
    loading: true,
    isRefreshing: false,
    error: null,
  },
  searchResults: {
    articles: [],
    loading: true,
    error: null,
  },
};

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
    const formattedArticles = data.articles.map((article) => ({
      ...article,
      publishedAt: formatTimeAgo(article.publishedAt),
    }));

    return { articles: formattedArticles, isRefresh };
  }
);

export const fetchSearchNewsAsync = createAsyncThunk(
  "news/fetchSearchNews",
  async (searchTerm: string) => {
    const delay = Math.floor(Math.random() * (2500 - 1000 + 1) + 2000);

    // Simula delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Verifica se e categoria valida
    const category = getCategoryFromLabel(searchTerm);

    let data;
    if (category) {
      data = await fetchNewsAPI(searchTerm, key, category);
    } else {
      data = await fetchNewsAPI(searchTerm, key);
    }

    // Formata as data
    const formattedArticles = data.articles.map((article) => ({
      ...article,
      publishedAt: formatTimeAgo(article.publishedAt),
    }));

    return { articles: formattedArticles };
  }
);

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Home news reducers
    builder
      .addCase(fetchHomeNewsAsync.pending, (state, action) => {
        const isRefresh = action.meta.arg;
        if (isRefresh) {
          state.homeNews.isRefreshing = true;
        } else {
          state.homeNews.loading = true;
        }
        state.homeNews.error = null;
      })
      .addCase(fetchHomeNewsAsync.fulfilled, (state, action) => {
        const { articles } = action.payload;
        state.homeNews.articles = articles;
        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.error = null;
      })
      .addCase(fetchHomeNewsAsync.rejected, (state, action) => {
        state.homeNews.loading = false;
        state.homeNews.isRefreshing = false;
        state.homeNews.error =
          action.error.message ||
          "Erro ao buscar notícias. Carregando dados locais.";

        // Fallback temporario
        console.log("FALLBACK: Usando dados locais para a home");
        state.homeNews.articles = newsData.articles.map((article) => ({
          ...article,
          publishedAt: formatTimeAgo(article.publishedAt),
        }));
      })
      // Search news reducers
      .addCase(fetchSearchNewsAsync.pending, (state) => {
        state.searchResults.loading = true;
        state.searchResults.error = null;
      })
      .addCase(fetchSearchNewsAsync.fulfilled, (state, action) => {
        const { articles } = action.payload;
        state.searchResults.articles = articles;
        state.searchResults.loading = false;
        state.searchResults.error = null;
      })
      .addCase(fetchSearchNewsAsync.rejected, (state, action) => {
        state.searchResults.loading = false;
        state.searchResults.error =
          action.error.message ||
          "Erro ao buscar notícias. Tente novamente mais tarde.";
      });
  },
});

export default newsSlice.reducer;
