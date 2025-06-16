const IMAGE_PROXY_URL = "https://wsrv.nl/?url=";

/**
 * Otimiza uma URL de imagem para um tamanho e formato específicos.
 * @param originalUrl A URL da imagem original.
 * @param options Opções de otimização.
 * @param options.width A largura desejada da imagem em pixels.
 * @returns A nova URL da imagem otimizada.
 */

export function getOptimizedImageUrl(
  originalUrl: string,
  options: { width: number }
): string {
  if (!originalUrl || !originalUrl.startsWith("http")) {
    return originalUrl;
  }
  const optimizedUrl = `${IMAGE_PROXY_URL}${encodeURIComponent(
    originalUrl
  )}&w=${options.width}&output=webp&q=100&default=1`;

  return optimizedUrl;
}