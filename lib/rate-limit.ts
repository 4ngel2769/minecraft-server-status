/**
 * Rate Limiting System for Server Status Checks
 * 
 * Implements dual rate limiting:
 * 1. Per-IP rate limiting (configurable requests per minute)
 * 2. Per-hostname rate limiting (cooldown between checks)
 */

// Types
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface HostnameCooldown {
  lastCheck: number;
  hostname: string;
}

// Configuration from environment variables
const COOLDOWN_SECONDS = parseInt(process.env.NEXT_PUBLIC_COOLDOWN_SECONDS || '10', 10);
const REQUESTS_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '6', 10);
const ENABLE_TURNSTILE = process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === 'true';

// In-memory storage (use Redis for production multi-instance deployments)
const ipRateLimitMap = new Map<string, RateLimitEntry>();
const hostnameRateLimitMap = new Map<string, number>(); // hostname -> last check timestamp

/**
 * Check if IP has exceeded rate limit
 * @param ip - Client IP address
 * @returns Object with allowed status and remaining time
 */
export function checkIpRateLimit(ip: string): {
  allowed: boolean;
  remainingTime?: number;
  requestsRemaining?: number;
} {
  // If REQUESTS_PER_MINUTE is 0, unlimited requests allowed
  if (REQUESTS_PER_MINUTE === 0) {
    return { allowed: true };
  }

  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  // No previous requests from this IP
  if (!entry) {
    ipRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60000, // 1 minute from now
    });
    return { allowed: true, requestsRemaining: REQUESTS_PER_MINUTE - 1 };
  }

  // Check if reset time has passed
  if (now >= entry.resetTime) {
    ipRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60000,
    });
    return { allowed: true, requestsRemaining: REQUESTS_PER_MINUTE - 1 };
  }

  // Within rate limit window
  if (entry.count < REQUESTS_PER_MINUTE) {
    entry.count++;
    return { 
      allowed: true, 
      requestsRemaining: REQUESTS_PER_MINUTE - entry.count 
    };
  }

  // Rate limit exceeded
  const remainingTime = Math.ceil((entry.resetTime - now) / 1000);
  return { 
    allowed: false, 
    remainingTime,
    requestsRemaining: 0
  };
}

/**
 * Check hostname cooldown (per-hostname rate limiting)
 * @param hostname - Server hostname
 * @returns Object with allowed status and remaining time
 */
export function checkHostnameCooldown(hostname: string): {
  allowed: boolean;
  remainingTime?: number;
  cooldownSeconds?: number;
} {
  const now = Date.now();
  const lastCheck = hostnameRateLimitMap.get(hostname);
  const cooldownMs = COOLDOWN_SECONDS * 1000;

  if (!lastCheck) {
    hostnameRateLimitMap.set(hostname, now);
    return { allowed: true, cooldownSeconds: COOLDOWN_SECONDS };
  }

  const timeSinceLastCheck = now - lastCheck;
  
  if (timeSinceLastCheck >= cooldownMs) {
    hostnameRateLimitMap.set(hostname, now);
    return { allowed: true, cooldownSeconds: COOLDOWN_SECONDS };
  }

  const remainingTime = Math.ceil((cooldownMs - timeSinceLastCheck) / 1000);
  return { 
    allowed: false, 
    remainingTime,
    cooldownSeconds: COOLDOWN_SECONDS
  };
}

/**
 * Combined rate limit check (IP + Hostname)
 * @param ip - Client IP address
 * @param hostname - Server hostname
 * @returns Combined rate limit result
 */
export function checkRateLimit(ip: string, hostname: string): {
  allowed: boolean;
  reason?: 'ip' | 'hostname';
  remainingTime?: number;
  message?: string;
} {
  // Check IP rate limit first
  const ipCheck = checkIpRateLimit(ip);
  if (!ipCheck.allowed) {
    return {
      allowed: false,
      reason: 'ip',
      remainingTime: ipCheck.remainingTime,
      message: `Too many requests. Please wait ${ipCheck.remainingTime} seconds before trying again.`,
    };
  }

  // Check hostname cooldown
  const hostnameCheck = checkHostnameCooldown(hostname);
  if (!hostnameCheck.allowed) {
    return {
      allowed: false,
      reason: 'hostname',
      remainingTime: hostnameCheck.remainingTime,
      message: `This server was checked recently. Please wait ${hostnameCheck.remainingTime} seconds before checking again.`,
    };
  }

  return { allowed: true };
}

/**
 * Get remaining cooldown time for a hostname
 * @param hostname - Server hostname
 * @returns Remaining seconds until next check is allowed
 */
export function getRemainingCooldown(hostname: string): number {
  const now = Date.now();
  const lastCheck = hostnameRateLimitMap.get(hostname);
  
  if (!lastCheck) return 0;
  
  const cooldownMs = COOLDOWN_SECONDS * 1000;
  const timeSinceLastCheck = now - lastCheck;
  
  if (timeSinceLastCheck >= cooldownMs) return 0;
  
  return Math.ceil((cooldownMs - timeSinceLastCheck) / 1000);
}

/**
 * Clean up expired entries from rate limit maps
 * Should be called periodically (e.g., every minute)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  
  // Clean up IP rate limits
  const ipKeysToDelete: string[] = [];
  ipRateLimitMap.forEach((entry, ip) => {
    if (now >= entry.resetTime) {
      ipKeysToDelete.push(ip);
    }
  });
  ipKeysToDelete.forEach(ip => ipRateLimitMap.delete(ip));

  // Clean up hostname cooldowns (older than 1 hour)
  const hostnameKeysToDelete: string[] = [];
  const hourInMs = 3600000;
  hostnameRateLimitMap.forEach((timestamp, hostname) => {
    if (now - timestamp > hourInMs) {
      hostnameKeysToDelete.push(hostname);
    }
  });
  hostnameKeysToDelete.forEach(hostname => hostnameRateLimitMap.delete(hostname));

  // Log cleanup stats in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Rate Limit] Cleaned up ${ipKeysToDelete.length} IP entries and ${hostnameKeysToDelete.length} hostname entries`);
  }
}

/**
 * Get configuration values
 */
export function getRateLimitConfig() {
  return {
    cooldownSeconds: COOLDOWN_SECONDS,
    requestsPerMinute: REQUESTS_PER_MINUTE,
    enableTurnstile: ENABLE_TURNSTILE,
  };
}

/**
 * Check if Turnstile is enabled
 */
export function isTurnstileEnabled(): boolean {
  return ENABLE_TURNSTILE;
}

// Start cleanup interval (runs every minute)
if (typeof window === 'undefined') {
  // Only run on server-side
  setInterval(cleanupRateLimits, 60000);
}

// Client-side cooldown tracking (localStorage)
export const ClientCooldown = {
  /**
   * Get remaining cooldown time for a hostname (client-side)
   */
  getRemainingTime(hostname: string): number {
    if (typeof window === 'undefined') return 0;
    
    const key = `cooldown_${hostname}`;
    const lastCheckStr = localStorage.getItem(key);
    
    if (!lastCheckStr) return 0;
    
    const lastCheck = parseInt(lastCheckStr, 10);
    const now = Date.now();
    const cooldownMs = COOLDOWN_SECONDS * 1000;
    const timeSinceLastCheck = now - lastCheck;
    
    if (timeSinceLastCheck >= cooldownMs) {
      localStorage.removeItem(key);
      return 0;
    }
    
    return Math.ceil((cooldownMs - timeSinceLastCheck) / 1000);
  },

  /**
   * Record a check for a hostname (client-side)
   */
  recordCheck(hostname: string): void {
    if (typeof window === 'undefined') return;
    
    const key = `cooldown_${hostname}`;
    localStorage.setItem(key, Date.now().toString());
  },

  /**
   * Clear all cooldowns (client-side)
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cooldown_')) {
        localStorage.removeItem(key);
      }
    });
  },

  /**
   * Get cooldown duration in seconds
   */
  getCooldownSeconds(): number {
    return COOLDOWN_SECONDS;
  },
};
