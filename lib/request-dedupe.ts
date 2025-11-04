/**
 * Request Deduplication
 * Prevents duplicate simultaneous requests to the same resource
 * Improves performance and reduces load on external APIs
 */

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

// Store pending requests by key
const pendingRequests = new Map<string, PendingRequest<any>>();

// Cleanup interval
const CLEANUP_INTERVAL = 60000; // 1 minute
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Execute a function with deduplication
 * If the same request is already in progress, return the existing promise
 */
export async function deduplicateRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // Check if request is already pending
  const existing = pendingRequests.get(key);
  
  if (existing) {
    const age = Date.now() - existing.timestamp;
    
    // If request is still fresh, reuse it
    if (age < REQUEST_TIMEOUT) {
      console.log(`[Dedupe] Reusing pending request: ${key}`);
      return existing.promise;
    } else {
      // Request timed out, remove it
      pendingRequests.delete(key);
    }
  }
  
  // Create new request
  console.log(`[Dedupe] Creating new request: ${key}`);
  const promise = fn();
  
  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
  });
  
  // Clean up after completion
  promise
    .then(() => {
      pendingRequests.delete(key);
    })
    .catch(() => {
      pendingRequests.delete(key);
    });
  
  return promise;
}

/**
 * Generate cache key for server status requests
 */
export function getServerRequestKey(
  hostname: string,
  port: number | undefined,
  isBedrock: boolean
): string {
  return `server:${isBedrock ? 'bedrock' : 'java'}:${hostname}:${port || (isBedrock ? 19132 : 25565)}`;
}

/**
 * Clean up old pending requests
 */
function cleanup() {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  const entries = Array.from(pendingRequests.entries());
  for (const [key, request] of entries) {
    const age = now - request.timestamp;
    if (age > REQUEST_TIMEOUT) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => pendingRequests.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`[Dedupe] Cleaned up ${keysToDelete.length} stale requests`);
  }
}

/**
 * Get deduplication statistics
 */
export function getDedupeStats() {
  return {
    pendingRequests: pendingRequests.size,
    oldestRequest: Math.max(
      0,
      ...Array.from(pendingRequests.values()).map(r => Date.now() - r.timestamp)
    ),
  };
}

/**
 * Clear all pending requests (for testing)
 */
export function clearPendingRequests() {
  pendingRequests.clear();
}

// Start cleanup interval
if (typeof window === 'undefined') {
  // Server-side only
  setInterval(cleanup, CLEANUP_INTERVAL);
}
