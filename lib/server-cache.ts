import { server } from '@/lib/config';
import type { ServerStatus } from '@/lib/minecraft';

interface CacheEntry {
  status: ServerStatus;
  timestamp: number;
}

// In-memory cache for server status
const serverCache = new Map<string, CacheEntry>();

/**
 * Generate cache key from server details
 */
function getCacheKey(hostname: string, port: number | undefined, isBedrock: boolean): string {
  return `${isBedrock ? 'bedrock' : 'java'}:${hostname}:${port || 25565}`;
}

/**
 * Check if cache is enabled
 */
export function isCacheEnabled(): boolean {
  return server.cacheEnabled;
}

/**
 * Get cached server status if available and not expired
 */
export function getCachedStatus(
  hostname: string,
  port: number | undefined,
  isBedrock: boolean
): ServerStatus | null {
  if (!server.cacheEnabled) {
    return null;
  }

  const key = getCacheKey(hostname, port, isBedrock);
  const entry = serverCache.get(key);

  if (!entry) {
    return null;
  }

  // Check if cache entry is still valid
  const now = Date.now();
  const age = now - entry.timestamp;
  const maxAge = server.cacheDuration * 1000; // Convert seconds to milliseconds

  if (age > maxAge) {
    // Cache expired, remove it
    serverCache.delete(key);
    return null;
  }

  return entry.status;
}

/**
 * Cache server status
 */
export function cacheStatus(
  hostname: string,
  port: number | undefined,
  isBedrock: boolean,
  status: ServerStatus
): void {
  if (!server.cacheEnabled) {
    return;
  }

  const key = getCacheKey(hostname, port, isBedrock);
  serverCache.set(key, {
    status,
    timestamp: Date.now(),
  });

  // Clean up old cache entries periodically
  cleanupCache();
}

/**
 * Remove old cache entries to prevent memory leaks
 */
function cleanupCache(): void {
  const now = Date.now();
  const maxAge = server.cacheDuration * 1000;

  const entries = Array.from(serverCache.entries());
  for (const [key, entry] of entries) {
    const age = now - entry.timestamp;
    if (age > maxAge) {
      serverCache.delete(key);
    }
  }
}

/**
 * Clear all cached entries
 */
export function clearCache(): void {
  serverCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    enabled: server.cacheEnabled,
    size: serverCache.size,
    duration: server.cacheDuration,
  };
}
