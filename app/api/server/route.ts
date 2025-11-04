import { NextRequest, NextResponse } from 'next/server';
import {
  getServerStatus,
  validateServerAddress,
  type ServerStatus,
} from '@/lib/minecraft';
import { 
  checkRateLimit as checkCombinedRateLimit,
  checkIpHourlyRateLimit,
  isTurnstileEnabled 
} from '@/lib/rate-limit';
import { getCachedStatus, cacheStatus, isCacheEnabled } from '@/lib/server-cache';

// Remove old rate limiting code - now handled by rate-limit.ts

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  // If Turnstile is disabled, skip verification
  if (!isTurnstileEnabled()) {
    return true;
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured but ENABLE_TURNSTILE is true');
    return true; // Allow in development if not configured
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Check common headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (for development)
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      hostname,
      port,
      isBedrock = false,
      turnstileToken,
    } = body;

    // Validate required fields
    if (!hostname || typeof hostname !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Hostname is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Verify Turnstile token (only if enabled)
    if (isTurnstileEnabled()) {
      if (!turnstileToken || typeof turnstileToken !== 'string') {
        return NextResponse.json(
          {
            error: 'Invalid request',
            message: 'Turnstile verification required',
          },
          { status: 400 }
        );
      }

      const isTokenValid = await verifyTurnstileToken(turnstileToken);
      if (!isTokenValid) {
        return NextResponse.json(
          {
            error: 'Verification failed',
            message: 'Invalid or expired captcha token. Please try again.',
          },
          { status: 403 }
        );
      }
    }

    // Validate server address format
    const serverAddress = port ? `${hostname}:${port}` : hostname;
    if (!validateServerAddress(serverAddress)) {
      return NextResponse.json(
        {
          error: 'Invalid hostname',
          message: 'The provided hostname or IP address is invalid. Please check and try again.',
        },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check hourly rate limit first
    const hourlyLimit = checkIpHourlyRateLimit(clientIp);
    if (!hourlyLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Hourly rate limit exceeded',
          message: `Too many requests this hour. Please try again in ${Math.ceil((hourlyLimit.remainingTime || 0) / 60)} minutes.`,
          remainingTime: hourlyLimit.remainingTime,
        },
        { status: 429 }
      );
    }

    // Check combined rate limit (IP + hostname)
    const rateLimitCheck = checkCombinedRateLimit(clientIp, hostname);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: rateLimitCheck.message || 'Too many requests. Please try again later.',
          remainingTime: rateLimitCheck.remainingTime,
          reason: rateLimitCheck.reason,
        },
        { status: 429 }
      );
    }

    // Check cache first (if enabled)
    const cachedStatus = getCachedStatus(hostname, port, isBedrock);
    if (cachedStatus) {
      return NextResponse.json({
        ...cachedStatus,
        cached: true,
        cacheEnabled: isCacheEnabled(),
      });
    }

    // Fetch server status
    let serverStatus: ServerStatus;
    try {
      serverStatus = await getServerStatus(serverAddress, isBedrock, clientIp);
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // DNS failure
        if (errorMessage.includes('dns') || errorMessage.includes('enotfound')) {
          return NextResponse.json(
            {
              error: 'DNS resolution failed',
              message: 'Could not resolve the hostname. Please check the address and try again.',
              hostname,
            },
            { status: 404 }
          );
        }

        // Timeout
        if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
          return NextResponse.json(
            {
              error: 'Request timeout',
              message: 'The server took too long to respond. It may be offline or experiencing issues.',
              hostname,
            },
            { status: 504 }
          );
        }

        // Rate limit from the minecraft.ts function
        if (errorMessage.includes('rate limit')) {
          return NextResponse.json(
            {
              error: 'Rate limit exceeded',
              message: error.message,
            },
            { status: 429 }
          );
        }

        // Server offline or unreachable
        if (errorMessage.includes('offline') || errorMessage.includes('unreachable')) {
          return NextResponse.json(
            {
              error: 'Server offline',
              message: 'The server appears to be offline or unreachable.',
              hostname,
              online: false,
            },
            { status: 200 } // Still return 200 with offline status
          );
        }
      }

      // Generic error
      throw error;
    }

    // Prepare debug information
    const debugInfo = {
      cacheTime: serverStatus.cacheTime,
      timestamp: new Date(serverStatus.cacheTime).toISOString(),
      dns: serverStatus.dns
        ? {
            hostname: serverStatus.dns.hostname,
            ip: serverStatus.dns.ip,
            hasARecords: !!serverStatus.dns.aRecords,
            hasSrvRecord: !!serverStatus.dns.srvRecord,
            srvRecord: serverStatus.dns.srvRecord,
          }
        : null,
      protocol: {
        version: serverStatus.protocol,
        versionName: serverStatus.version,
      },
      connectivity: {
        ping: serverStatus.ping,
        hasQuery: !!serverStatus.query,
        hasPlayers: !!serverStatus.players,
      },
      security: {
        mojangBlocked: serverStatus.mojangBlocked,
        eulaBlocked: serverStatus.eula_blocked,
      },
      serverType: isBedrock ? 'bedrock' : 'java',
    };

    // Cache the successful response (if caching is enabled)
    cacheStatus(hostname, port, isBedrock, serverStatus);

    // Format response
    const response = {
      success: true,
      server: {
        online: serverStatus.online,
        hostname: serverStatus.hostname,
        ip: serverStatus.ip,
        port: serverStatus.port,
        version: serverStatus.version,
        protocol: serverStatus.protocol,
        software: serverStatus.software,
      },
      players: serverStatus.players
        ? {
            online: serverStatus.players.online,
            max: serverStatus.players.max,
            list: serverStatus.players.list?.map((p) =>
              typeof p === 'string' ? p : p.name
            ),
            sample: serverStatus.players.sample,
          }
        : null,
      motd: serverStatus.motd
        ? {
            raw: serverStatus.motd.raw,
            html: serverStatus.motd.html,
            clean: serverStatus.motd.clean,
          }
        : null,
      performance: {
        ping: serverStatus.ping,
      },
      query: serverStatus.query || null,
      icon: serverStatus.icon || null,
      debug: debugInfo,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Server status API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while checking the server status.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}
