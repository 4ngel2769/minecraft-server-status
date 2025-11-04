/**
 * Validation utilities for error handling and input sanitization
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorType?: 'format' | 'range' | 'network' | 'dns' | 'timeout' | 'invalid';
}

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize MongoDB query to prevent NoSQL injection
 */
export function sanitizeMongoQuery(query: any): any {
  if (typeof query !== 'object' || query === null) {
    return query;
  }
  
  const sanitized: any = {};
  
  for (const key in query) {
    if (!Object.prototype.hasOwnProperty.call(query, key)) {
      continue;
    }
    
    // Prevent MongoDB operators in keys
    if (key.startsWith('$')) {
      continue;
    }
    
    const value = query[key];
    
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMongoQuery(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Invalid email format',
      errorType: 'format',
    };
  }
  
  if (email.length > 254) {
    return {
      valid: false,
      error: 'Email is too long',
      errorType: 'range',
    };
  }
  
  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate name format
 */
export function validateName(name: string): ValidationResult {
  const sanitized = name.trim();
  
  if (sanitized.length === 0) {
    return {
      valid: false,
      error: 'Name cannot be empty',
      errorType: 'format',
    };
  }
  
  if (sanitized.length > 100) {
    return {
      valid: false,
      error: 'Name is too long (max 100 characters)',
      errorType: 'range',
    };
  }
  
  // Allow letters, numbers, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z0-9\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Name contains invalid characters',
      errorType: 'format',
    };
  }
  
  return { valid: true };
}

/**
 * Validate server alias (nickname for favorites)
 */
export function validateAlias(alias: string | undefined): ValidationResult {
  if (!alias || alias.trim().length === 0) {
    return { valid: true }; // Optional field
  }
  
  const sanitized = alias.trim();
  
  if (sanitized.length > 50) {
    return {
      valid: false,
      error: 'Alias is too long (max 50 characters)',
      errorType: 'range',
    };
  }
  
  if (!/^[a-zA-Z0-9\s'-]+$/.test(sanitized)) {
    return {
      valid: false,
      error: 'Alias contains invalid characters',
      errorType: 'format',
    };
  }
  
  return { valid: true };
}

/**
 * Validate server type
 */
export function validateServerType(type: string): ValidationResult {
  if (type !== 'java' && type !== 'bedrock') {
    return {
      valid: false,
      error: 'Server type must be either "java" or "bedrock"',
      errorType: 'invalid',
    };
  }
  
  return { valid: true };
}

/**
 * Validate turnstile token format
 */
export function validateTurnstileToken(token: string): ValidationResult {
  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      error: 'Turnstile token is required',
      errorType: 'format',
    };
  }
  
  // Turnstile tokens are long alphanumeric strings with dashes/underscores
  if (!/^[a-zA-Z0-9_-]{100,2000}$/.test(token)) {
    return {
      valid: false,
      error: 'Invalid turnstile token format',
      errorType: 'format',
    };
  }
  
  return { valid: true };
}

/**
 * Validate hostname format
 */
export function validateHostname(hostname: string): ValidationResult {
  if (!hostname || hostname.trim().length === 0) {
    return {
      valid: false,
      error: 'Hostname cannot be empty',
      errorType: 'format',
    };
  }

  const trimmed = hostname.trim();

  // Check for invalid characters
  const invalidChars = /[<>:"\/\\|?*\s]/;
  if (invalidChars.test(trimmed)) {
    return {
      valid: false,
      error: 'Hostname contains invalid characters',
      errorType: 'format',
    };
  }

  // Check length
  if (trimmed.length > 253) {
    return {
      valid: false,
      error: 'Hostname is too long (max 253 characters)',
      errorType: 'format',
    };
  }

  // Basic format check (allow domain names, IPs, localhost)
  const hostnameRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^localhost$/i;
  
  if (!hostnameRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid hostname format. Use a domain (e.g., mc.hypixel.net) or IP address (e.g., 192.168.1.1)',
      errorType: 'format',
    };
  }

  return { valid: true };
}

/**
 * Validate port number
 */
export function validatePort(port: number | string): ValidationResult {
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;

  if (isNaN(portNum)) {
    return {
      valid: false,
      error: 'Port must be a number',
      errorType: 'format',
    };
  }

  if (portNum < 1 || portNum > 65535) {
    return {
      valid: false,
      error: 'Port must be between 1 and 65535',
      errorType: 'range',
    };
  }

  return { valid: true };
}

/**
 * Validate Minecraft color code
 */
export function validateColorCode(code: string): ValidationResult {
  const validCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'k', 'l', 'm', 'n', 'o', 'r'];
  
  if (!code || code.length !== 1) {
    return {
      valid: false,
      error: 'Color code must be a single character',
      errorType: 'format',
    };
  }

  if (!validCodes.includes(code.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid color code '${code}'. Valid codes are: 0-9, a-f (colors), k-o (formatting), r (reset)`,
      errorType: 'invalid',
    };
  }

  return { valid: true };
}

/**
 * Validate MOTD text length
 */
export function validateMOTDLength(text: string): ValidationResult {
  const maxLength = 256; // Minecraft MOTD max length
  const warningLength = 200;

  if (text.length > maxLength) {
    return {
      valid: false,
      error: `MOTD is too long (${text.length}/${maxLength} characters). Some servers may truncate or reject it.`,
      errorType: 'range',
    };
  }

  if (text.length > warningLength) {
    return {
      valid: true,
      error: `MOTD is quite long (${text.length}/${maxLength} characters). Consider shortening it for better display.`,
      errorType: 'range',
    };
  }

  return { valid: true };
}

/**
 * Parse error from API response
 */
export function parseAPIError(error: unknown): {
  message: string;
  type: 'network' | 'server' | 'timeout' | 'ratelimit' | 'validation' | 'unknown';
  statusCode?: number;
  retryable: boolean;
} {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      retryable: true,
    };
  }

  // Timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return {
      message: 'Request timed out. The server may be offline or experiencing issues.',
      type: 'timeout',
      retryable: true,
    };
  }

  // API errors with status codes
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Rate limit
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return {
        message: error.message,
        type: 'ratelimit',
        statusCode: 429,
        retryable: false,
      };
    }

    // Validation errors
    if (message.includes('invalid') || message.includes('validation')) {
      return {
        message: error.message,
        type: 'validation',
        statusCode: 400,
        retryable: false,
      };
    }

    // Server errors
    if (message.includes('server error') || message.includes('500')) {
      return {
        message: 'Server error. Please try again later.',
        type: 'server',
        statusCode: 500,
        retryable: true,
      };
    }

    return {
      message: error.message,
      type: 'unknown',
      retryable: true,
    };
  }

  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
    retryable: true,
  };
}

/**
 * Validate URL parameters for MOTD sharing
 */
export function validateMOTDURLParams(params: URLSearchParams): ValidationResult {
  const motd = params.get('motd');
  const text = params.get('text');
  
  if (!motd && !text) {
    return { valid: true }; // No params is valid (empty state)
  }

  const content = motd || text || '';
  
  // Check if it's valid base64 or plain text
  if (motd) {
    try {
      atob(content);
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid MOTD URL parameter. The data appears to be corrupted.',
        errorType: 'format',
      };
    }
  }

  // Check length after decoding
  const lengthCheck = validateMOTDLength(content);
  if (!lengthCheck.valid) {
    return lengthCheck;
  }

  return { valid: true };
}

/**
 * Get user-friendly error message for server status errors
 */
export function getServerErrorMessage(error: string): {
  title: string;
  message: string;
  suggestion: string;
} {
  const lower = error.toLowerCase();

  // Offline/unreachable
  if (lower.includes('offline') || lower.includes('unreachable')) {
    return {
      title: 'Server Offline',
      message: 'Unable to reach the server',
      suggestion: 'The server may be down or the hostname/IP may be incorrect. Double-check the address and try again.',
    };
  }

  // Timeout
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return {
      title: 'Connection Timeout',
      message: 'Server did not respond in time',
      suggestion: 'The server may be slow, offline, or blocking connections. Try again in a few moments.',
    };
  }

  // DNS errors
  if (lower.includes('dns') || lower.includes('enotfound') || lower.includes('getaddrinfo')) {
    return {
      title: 'DNS Resolution Failed',
      message: 'Could not find the server',
      suggestion: 'The hostname could not be resolved. Check for typos or try using the IP address directly.',
    };
  }

  // Connection refused
  if (lower.includes('econnrefused') || lower.includes('connection refused')) {
    return {
      title: 'Connection Refused',
      message: 'Server refused the connection',
      suggestion: 'The server is online but refusing connections. Check if the port is correct or if the server is whitelisted.',
    };
  }

  // Invalid port
  if (lower.includes('port') && (lower.includes('invalid') || lower.includes('range'))) {
    return {
      title: 'Invalid Port',
      message: 'Port number is out of range',
      suggestion: 'Port must be between 1 and 65535. Default Java port is 25565, Bedrock is 19132.',
    };
  }

  // Rate limit
  if (lower.includes('rate limit') || lower.includes('too many')) {
    const match = error.match(/(\d+)\s*second/);
    const seconds = match ? match[1] : 'a few';
    return {
      title: 'Rate Limit Reached',
      message: `Please wait ${seconds} seconds`,
      suggestion: 'You are checking servers too quickly. Please wait before trying again.',
    };
  }

  // Generic network error
  if (lower.includes('network') || lower.includes('fetch')) {
    return {
      title: 'Network Error',
      message: 'Could not connect to the service',
      suggestion: 'Check your internet connection and try again.',
    };
  }

  // Default
  return {
    title: 'Request Failed',
    message: error,
    suggestion: 'Please try again. If the problem persists, the server may be experiencing issues.',
  };
}
