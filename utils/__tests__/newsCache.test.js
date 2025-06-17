import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCache, getCache, HOME_NEWS_CACHE_KEY } from "../newsCache";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage

describe("newsCache", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("setCache", () => {
    it("should save data to cache with timestamp", async () => {
      const testData = ["item1", "item2"];
      const mockTimestamp = 1640995200000; // Fixed timestamp for testing
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      await setCache("testKey", testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify({
          data: testData,
          timeStamp: mockTimestamp,
        })
      );
    });

    it("should limit array data to MAX_CACHE_ITEMS (25 items)", async () => {
      const testData = Array.from({ length: 30 }, (_, i) => `item${i}`);
      const mockTimestamp = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      await setCache("testKey", testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify({
          data: testData.slice(0, 25),
          timeStamp: mockTimestamp,
        })
      );
    });

    it("should not limit non-array data", async () => {
      const testData = { key: "value" };
      const mockTimestamp = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      await setCache("testKey", testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify({
          data: testData,
          timeStamp: mockTimestamp,
        })
      );
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

      await setCache("testKey", ["data"]);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao salvar dados no cache: ",
        expect.any(Error)
      );
    });
  });

  describe("getCache", () => {
    it("should return cached data if not expired", async () => {
      const testData = ["item1", "item2"];
      const currentTime = 1640995200000;
      const cacheTime = currentTime - (3 * 60 * 60 * 1000); // 3 hours ago (not expired)
      
      jest.spyOn(Date, 'now').mockReturnValue(currentTime);
      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          data: testData,
          timeStamp: cacheTime,
        })
      );

      const result = await getCache("testKey");

      expect(result).toEqual(testData);
      expect(mockAsyncStorage.removeItem).not.toHaveBeenCalled();
    });

    it("should return null if cache is expired and remove item", async () => {
      const testData = ["item1", "item2"];
      const currentTime = 1640995200000;
      const cacheTime = currentTime - (7 * 60 * 60 * 1000); // 7 hours ago (expired)
      
      jest.spyOn(Date, 'now').mockReturnValue(currentTime);
      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          data: testData,
          timeStamp: cacheTime,
        })
      );

      const result = await getCache("testKey");

      expect(result).toBeNull();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith("testKey");
    });

    it("should return null if no cached item exists", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getCache("testKey");

      expect(result).toBeNull();
      expect(mockAsyncStorage.removeItem).not.toHaveBeenCalled();
    });

    it("should handle JSON parse errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockResolvedValue("invalid json");

      const result = await getCache("testKey");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao recuperar dados do cache: ",
        expect.any(Error)
      );
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      const result = await getCache("testKey");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Falha ao recuperar dados do cache: ",
        expect.any(Error)
      );
    });
  });

  describe("Constants", () => {
    it("should export HOME_NEWS_CACHE_KEY", () => {
      expect(HOME_NEWS_CACHE_KEY).toBe("homeNewsCache");
    });
  });
});