/**
 * Server Configuration
 * Centralized configuration management for all environment variables
 */

export const config = {
  // Database
  database: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mcsrv_dev',
  },

  // Authentication
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    appUrl: process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Admin Account (Optional)
  admin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || '',
    password: process.env.DEFAULT_ADMIN_PASSWORD || '',
    name: process.env.DEFAULT_ADMIN_NAME || '',
    enabled: !!(process.env.DEFAULT_ADMIN_EMAIL && process.env.DEFAULT_ADMIN_PASSWORD),
  },

  // Cloudflare Turnstile
  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    secretKey: process.env.TURNSTILE_SECRET_KEY || '',
    enabled: process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === 'true',
  },

  // Rate Limiting
  rateLimit: {
    cooldownSeconds: parseInt(process.env.NEXT_PUBLIC_COOLDOWN_SECONDS || '40', 10),
    requestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '6', 10),
    requestsPerHour: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_HOUR || '60', 10),
  },

  // Server Configuration
  server: {
    queryTimeout: parseInt(process.env.SERVER_QUERY_TIMEOUT || '10000', 10),
    maxFavoritesPerUser: parseInt(process.env.MAX_FAVORITES_PER_USER || '50', 10),
    cacheEnabled: process.env.ENABLE_SERVER_CACHE === 'true',
    cacheDuration: parseInt(process.env.SERVER_CACHE_DURATION || '60', 10),
  },

  // Feature Flags
  features: {
    userRegistration: process.env.ENABLE_USER_REGISTRATION !== 'false', // Default true
    favorites: process.env.ENABLE_FAVORITES !== 'false', // Default true
    communityFeatures: process.env.ENABLE_COMMUNITY_FEATURES === 'true',
    notifications: process.env.ENABLE_NOTIFICATIONS === 'true',
  },

  // Email Configuration (Optional)
  email: {
    enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.SMTP_FROM_NAME || 'MC Status',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@mcsrv.local',
  },

  // Discord Webhook (Optional)
  discord: {
    enabled: !!process.env.DISCORD_WEBHOOK_URL,
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  },

  // Analytics & Monitoring (Optional)
  analytics: {
    googleAnalytics: {
      enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    },
    sentry: {
      enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    },
  },

  // Development
  development: {
    debugMode: process.env.DEBUG_MODE === 'true',
    logApiRequests: process.env.LOG_API_REQUESTS === 'true',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;

// Export individual configs for convenience
export const { database, auth, admin, turnstile, rateLimit, server, features, email, discord, analytics, development } = config;
