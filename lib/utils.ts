/**
 * Fetches the page title from a URL using our API endpoint
 */
export async function fetchPageTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.title || null;
  } catch (error) {
    console.error('Error fetching page title:', error);
    return null;
  }
}

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function extractUrlFromDataTransfer(dataTransfer: DataTransfer): string | null {
  const uriList = dataTransfer.getData('text/uri-list');
  if (uriList) {
    const urls = uriList.split('\n').filter(line => !line.startsWith('#') && line.trim());
    if (urls.length > 0 && isValidUrl(urls[0].trim())) {
      return urls[0].trim();
    }
  }

  const plainText = dataTransfer.getData('text/plain');
  if (plainText && isValidUrl(plainText.trim())) {
    return plainText.trim();
  }

  return null;
}

export function formatUrlForDisplay(url: string): string {
  try {
    const urlObj = new URL(url);
    let formatted = urlObj.hostname + urlObj.pathname + urlObj.search + urlObj.hash;
    if (formatted.endsWith('/')) {
      formatted = formatted.slice(0, -1);
    }
    return formatted;
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return '';
  }
}

export function getNumberOfMonthsToKeep(): number {
  const monthsEnv = process.env.NEXT_PUBLIC_CLEANUP_MONTHS;
  const months = monthsEnv ? parseInt(monthsEnv, 10) : 12;
  return isNaN(months) || months <= 0 ? 12 : months;
}