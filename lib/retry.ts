/**
 * Retry Logic for Reliable API Calls
 * Implements exponential backoff for transient failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'timeout',
    'network',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    '5', // Any error starting with 5 (500 errors)
  ],
};

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (!error) {
    return false;
  }
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  return retryableErrors.some(pattern => 
    errorMessage.includes(pattern.toLowerCase())
  );
}

/**
 * Calculate delay with exponential backoff
 */
function getDelay(attempt: number, options: Required<RetryOptions>): number {
  const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts: Required<RetryOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      const result = await fn();
      
      if (attempt > 1) {
        console.log(`[Retry] Succeeded on attempt ${attempt}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      const shouldRetry = isRetryableError(error, opts.retryableErrors);
      
      if (!shouldRetry || attempt >= opts.maxAttempts) {
        console.error(`[Retry] Failed after ${attempt} attempts:`, error);
        throw error;
      }
      
      // Calculate delay
      const delay = getDelay(attempt, opts);
      
      console.log(
        `[Retry] Attempt ${attempt}/${opts.maxAttempts} failed. Retrying in ${delay}ms...`,
        error instanceof Error ? error.message : error
      );
      
      // Wait before retry
      await sleep(delay);
    }
  }
  
  // Should never reach here, but TypeScript needs it
  throw lastError;
}

/**
 * Retry with timeout
 * Combines retry logic with overall timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return Promise.race([
    retry(fn, retryOptions),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
}

/**
 * Retry fetch requests specifically
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retry(async () => {
    const response = await fetch(url, options);
    
    // Treat 5xx errors as retryable
    if (response.status >= 500) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  }, retryOptions);
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000 // 1 minute
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      
      if (timeSinceLastFailure >= this.timeout) {
        console.log('[CircuitBreaker] Moving to half-open state');
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open. Service temporarily unavailable.');
      }
    }
    
    try {
      const result = await fn();
      
      // Success - reset or close circuit
      if (this.state === 'half-open') {
        console.log('[CircuitBreaker] Closing circuit after successful call');
        this.state = 'closed';
        this.failureCount = 0;
      }
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.failureCount >= this.threshold) {
        console.error(`[CircuitBreaker] Opening circuit after ${this.failureCount} failures`);
        this.state = 'open';
      }
      
      throw error;
    }
  }
  
  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
  
  reset() {
    this.state = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}
