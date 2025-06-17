import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../favoritesCache";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage

describe("favoritesCache", () => {
  const mockArticle1 = {
    url: "https://example.com/article1",
    title: "Test Article 1",
    description: "Description 1",
    imageUrl: "https://example.com/image1.jpg",
    publishedAt: "2024-01-01T00:00:00Z",
    source: "Test Source 1",
  };

  const mockArticle2 = {
    url: "https://example.com/article2",
    title: "Test Article 2",
    description: "Description 2",
    imageUrl: "https://example.com/image2.jpg",
    publishedAt: "2024-01-02T00:00:00Z",
    source: "Test Source 2",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getFavorites", () => {
    it("should return favorites from AsyncStorage", async () => {
      const mockFavorites = [mockArticle1, mockArticle2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));

      const result = await getFavorites();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("favorites");
      expect(result).toEqual(mockFavorites);
    });

    it("should return empty array if no favorites exist", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getFavorites();

      expect(result).toEqual([]);
    });

    it("should return empty array if JSON parse fails", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockResolvedValue("invalid json");

      const result = await getFavorites();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao buscar favoritos:",
        expect.any(Error)
      );
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      const result = await getFavorites();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao buscar favoritos:",
        expect.any(Error)
      );
    });
  });

  describe("addFavorite", () => {
    it("should add a new favorite to empty list", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await addFavorite(mockArticle1);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockArticle1])
      );
    });

    it("should add a new favorite to existing list", async () => {
      const existingFavorites = [mockArticle2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      await addFavorite(mockArticle1);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockArticle1, mockArticle2])
      );
    });

    it("should not add duplicate favorites", async () => {
      const existingFavorites = [mockArticle1, mockArticle2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      await addFavorite(mockArticle1);

      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      await addFavorite(mockArticle1);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao buscar favoritos:",
        expect.any(Error)
      );
    });

    it("should handle setItem errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockRejectedValue(new Error("SetItem error"));

      await addFavorite(mockArticle1);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao adicionar favoritos:",
        expect.any(Error)
      );
    });
  });

  describe("removeFavorite", () => {
    it("should remove favorite from list", async () => {
      const existingFavorites = [mockArticle1, mockArticle2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      await removeFavorite(mockArticle1.url);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockArticle2])
      );
    });

    it("should handle removal of non-existent favorite", async () => {
      const existingFavorites = [mockArticle1];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      await removeFavorite("https://non-existent.com");

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([mockArticle1])
      );
    });

    it("should handle empty favorites list", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await removeFavorite(mockArticle1.url);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "favorites",
        JSON.stringify([])
      );
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      await removeFavorite(mockArticle1.url);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao remover favorito:",
        expect.any(Error)
      );
    });
  });

  describe("isFavorite", () => {
    it("should return true if article is in favorites", async () => {
      const existingFavorites = [mockArticle1, mockArticle2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      const result = await isFavorite(mockArticle1.url);

      expect(result).toBe(true);
    });

    it("should return false if article is not in favorites", async () => {
      const existingFavorites = [mockArticle1];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingFavorites));

      const result = await isFavorite(mockArticle2.url);

      expect(result).toBe(false);
    });

    it("should return false if no favorites exist", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await isFavorite(mockArticle1.url);

      expect(result).toBe(false);
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      const result = await isFavorite(mockArticle1.url);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao buscar favoritos:",
        expect.any(Error)
      );
    });
  });
});