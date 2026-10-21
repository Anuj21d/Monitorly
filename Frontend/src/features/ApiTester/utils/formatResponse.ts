/**
 * Formats a raw JSON string with 2-space indentation.
 * Returns original string if invalid JSON.
 */
export function formatJsonString(raw: string): { formatted: string; isValid: boolean; error?: string } {
  if (!raw || !raw.trim()) {
    return { formatted: '', isValid: true };
  }

  try {
    const parsed = JSON.parse(raw);
    const formatted = JSON.stringify(parsed, null, 2);
    return { formatted, isValid: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON syntax';
    return { formatted: raw, isValid: false, error: message };
  }
}

/**
 * Validates JSON text and returns line/column or message if invalid.
 */
export function validateJson(raw: string): { isValid: boolean; error?: string } {
  if (!raw.trim()) return { isValid: true };
  try {
    JSON.parse(raw);
    return { isValid: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Syntax error in JSON';
    return { isValid: false, error: message };
  }
}

/**
 * Formats byte sizes into human readable units (B, KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const unitIndex = Math.min(i, units.length - 1);
  const size = (bytes / Math.pow(1024, unitIndex)).toFixed(unitIndex === 0 ? 0 : 2);
  return `${size} ${units[unitIndex]}`;
}

/**
 * Formats milliseconds into human readable duration.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Formats a timestamp into a friendly time string.
 */
export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
}
