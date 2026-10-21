import type { KeyValueRow } from '../types/apiTester.types';

/**
 * Builds a valid query string from enabled key-value rows.
 * Skips empty keys. Encodes keys and values properly.
 */
export function buildQueryString(rows: KeyValueRow[]): string {
  const activeRows = rows.filter((r) => r.enabled && r.key.trim().length > 0);
  if (activeRows.length === 0) return '';

  const params = new URLSearchParams();
  for (const row of activeRows) {
    params.append(row.key.trim(), row.value);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Strips existing query parameters from a URL string, returning [baseUrl, existingQueryRows].
 */
export function parseUrlQuery(rawUrl: string): { baseUrl: string; params: KeyValueRow[] } {
  if (!rawUrl) return { baseUrl: '', params: [] };

  const qIndex = rawUrl.indexOf('?');
  if (qIndex === -1) {
    return { baseUrl: rawUrl, params: [] };
  }

  const baseUrl = rawUrl.substring(0, qIndex);
  const queryString = rawUrl.substring(qIndex + 1);

  const parsedParams: KeyValueRow[] = [];
  try {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      parsedParams.push({
        id: `param-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        key,
        value,
        description: '',
        enabled: true,
      });
    });
  } catch {
    // If malformed query string, fallback to empty
  }

  return { baseUrl, params: parsedParams };
}

/**
 * Applies the enabled KeyValueRow parameters to a base URL without duplication.
 */
export function applyParamsToUrl(baseUrl: string, rows: KeyValueRow[]): string {
  // Strip any existing query params from the base URL first
  const cleanBase = baseUrl.split('?')[0] || '';
  const qs = buildQueryString(rows);
  return `${cleanBase}${qs}`;
}

/**
 * Validates a URL input.
 * Supports absolute URLs (http, https) and relative endpoints (/api/v1/...).
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Relative paths like /api/... or api/...
  if (trimmed.startsWith('/') || trimmed.startsWith('localhost:')) {
    return { isValid: true };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format (e.g. https://api.example.com/v1/users)' };
  }
}
