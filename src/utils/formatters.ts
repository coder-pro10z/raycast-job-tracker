/**
 * Formats URLs to display clean domain names
 * e.g., "https://www.google.com/careers/job123" -> "google.com"
 */
export function extractDomain(url: string): string {
  if (!url) return '';
  try {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(cleanUrl);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Ensures URL starts with http:// or https:// for external navigation
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Truncates long text smoothly with ellipsis
 */
export function truncateText(text: string, maxLength: number = 60): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Formats dates into readable relative or absolute strings
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Helper to check if a job matches a search query across multiple fields
 */
export function matchSearchQuery(text: string, query: string): boolean {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}
