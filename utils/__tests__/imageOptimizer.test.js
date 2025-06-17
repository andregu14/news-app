import { getOptimizedImageUrl } from "../imageOptimizer";

describe("imageOptimizer", () => {
  describe("getOptimizedImageUrl", () => {
    it("should return optimized URL for valid HTTP URL", () => {
      const originalUrl = "https://example.com/image.jpg";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      const expectedUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=300&output=webp&q=100&default=1`;
      expect(result).toBe(expectedUrl);
    });

    it("should return optimized URL for valid HTTPS URL", () => {
      const originalUrl = "https://example.com/image.png";
      const options = { width: 500 };

      const result = getOptimizedImageUrl(originalUrl, options);

      const expectedUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=500&output=webp&q=100&default=1`;
      expect(result).toBe(expectedUrl);
    });

    it("should handle URLs with special characters", () => {
      const originalUrl = "https://example.com/path/image with spaces.jpg?param=value&other=test";
      const options = { width: 200 };

      const result = getOptimizedImageUrl(originalUrl, options);

      const expectedUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=200&output=webp&q=100&default=1`;
      expect(result).toBe(expectedUrl);
    });

    it("should return original URL if it doesn't start with http", () => {
      const originalUrl = "ftp://example.com/image.jpg";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });

    it("should return original URL if it's empty", () => {
      const originalUrl = "";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });

    it("should return original URL if it's null", () => {
      const originalUrl = null;
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });

    it("should return original URL if it's undefined", () => {
      const originalUrl = undefined;
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });

    it("should handle different width values", () => {
      const originalUrl = "https://example.com/image.jpg";
      
      const result1 = getOptimizedImageUrl(originalUrl, { width: 100 });
      const result2 = getOptimizedImageUrl(originalUrl, { width: 1000 });

      expect(result1).toContain("&w=100&");
      expect(result2).toContain("&w=1000&");
    });

    it("should always use webp format and quality 100", () => {
      const originalUrl = "https://example.com/image.jpg";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toContain("&output=webp&");
      expect(result).toContain("&q=100&");
      expect(result).toContain("&default=1");
    });

    it("should handle relative URLs (non-http)", () => {
      const originalUrl = "/assets/image.jpg";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });

    it("should handle data URLs", () => {
      const originalUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...";
      const options = { width: 300 };

      const result = getOptimizedImageUrl(originalUrl, options);

      expect(result).toBe(originalUrl);
    });
  });
});