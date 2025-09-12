'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Wifi,
  Clock,
  Copy,
  CheckCircle2,
  Globe,
  Activity,
  Shield,
  RefreshCw,
  Server,
  Database,
  ChevronDown,
  ChevronUp,
  Edit,
  Bug,
  AlertTriangle,
  Heart,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';
import { Turnstile } from '@marsidev/react-turnstile';
import { ClientCooldown } from '@/lib/rate-limit';
import { useToast } from '@/hooks/use-toast';
import { validateHostname, validatePort, getServerErrorMessage, parseAPIError } from '@/lib/validation';

// Server response type from API
interface ServerResponse {
  success: boolean;
  server: {
    online: boolean;
    hostname: string;
    ip?: string;
    port: number;
    version?: string;
    protocol?: number;
    software?: string;
  };
  players?: {
    online: number;
    max: number;
    list?: string[];
    sample?: Array<{ name: string; id: string }>;
  };
  motd?: {
    raw: string[];
    html: string;
    clean: string[];
  };
  performance: {
    ping: number;
  };
  query?: any;
  icon?: string;
  debug: {
    cacheTime: number;
    timestamp: string;
    dns?: {
      hostname: string;
      ip?: string;
      hasARecords: boolean;
      hasSrvRecord: boolean;
      srvRecord?: {
        host: string;
        port: number;
      };
    };
    protocol: {
      version?: number;
      versionName?: string;
    };
    connectivity: {
      ping: number;
      hasQuery: boolean;
      hasPlayers: boolean;
    };
    security: {
      mojangBlocked: boolean;
      eulaBlocked: boolean;
    };
    serverType: 'java' | 'bedrock';
  };
}

// Get environment configuration
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const ENABLE_TURNSTILE = process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === 'true';

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [serverData, setServerData] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ title: string; message: string; suggestion: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const { toast } = useToast();

  // Parse slug: "hostname" or "hostname:port"
  const slug = decodeURIComponent(params.slug as string);
  const [hostname, port] = slug.includes(':')
    ? slug.split(':')
    : [slug, ''];

  // Validate inputs on load
  useEffect(() => {
    const hostnameValidation = validateHostname(hostname);
    if (!hostnameValidation.valid) {
      setError(hostnameValidation.error || 'Invalid hostname');
      setErrorDetails(getServerErrorMessage(hostnameValidation.error || 'Invalid hostname'));
      setLoading(false);
      toast({
        title: 'Invalid hostname',
        description: hostnameValidation.error,
        variant: 'destructive',
      });
      return;
    }

    if (port) {
      const portValidation = validatePort(port);
      if (!portValidation.valid) {
        setError(portValidation.error || 'Invalid port');
        setErrorDetails(getServerErrorMessage(portValidation.error || 'Invalid port'));
        setLoading(false);
        toast({
          title: 'Invalid port',
          description: portValidation.error,
          variant: 'destructive',
        });
        return;
      }
    }
  }, [hostname, port, toast]);

  // Determine if Bedrock based on port
  const isBedrock = port ? parseInt(port) === 19132 : false;
  const defaultPort = isBedrock ? 19132 : 25565;
  const actualPort = port ? parseInt(port) : defaultPort;

  // Check cooldown on load and when hostname changes
  useEffect(() => {
    const remaining = ClientCooldown.getRemainingTime(hostname);
    setCooldownTime(remaining);
    
    // Show Turnstile only after cooldown expires (if enabled)
    if (remaining === 0 && ENABLE_TURNSTILE) {
      setShowTurnstile(true);
    }
  }, [hostname]);

  // Countdown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        const remaining = ClientCooldown.getRemainingTime(hostname);
        setCooldownTime(remaining);
        
        if (remaining === 0) {
          if (ENABLE_TURNSTILE) {
            setShowTurnstile(true);
          }
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [cooldownTime, hostname]);

  // Check for token in URL params (from home page navigation)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setTurnstileToken(token);
    }
  }, [searchParams]);

  const fetchServerStatus = useCallback(async (manual: boolean = false, token?: string) => {
    try {
      // Check cooldown before making request
      const currentCooldown = ClientCooldown.getRemainingTime(hostname);
      if (currentCooldown > 0) {
        if (manual) {
          setError(`Please wait ${currentCooldown} seconds before checking again`);
        }
        // Don't record check or proceed if in cooldown
        return;
      }

      // Check for Turnstile requirement
      const requiredToken = token || turnstileToken;
      if (ENABLE_TURNSTILE && !requiredToken && manual) {
        setShowTurnstile(true);
        setError('Please complete the verification below');
        return;
      }

      if (manual) setRefreshing(true);
      else setLoading(true);

      // Clear previous errors
      setError(null);
      setErrorDetails(null);

      const response = await fetch('/api/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostname,
          port: actualPort,
          isBedrock,
          turnstileToken: requiredToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limit errors
        if (response.status === 429) {
          const remaining = data.remainingTime || ClientCooldown.getCooldownSeconds();
          setCooldownTime(remaining);
          setShowTurnstile(false);
          
          // Record check only on actual API response (server-side rate limit hit)
          ClientCooldown.recordCheck(hostname);
          
          const errorMsg = data.message || `Rate limited. Please wait ${remaining} seconds.`;
          const errorInfo = getServerErrorMessage(errorMsg);
          setErrorDetails(errorInfo);
          
          toast({
            title: 'Rate limit exceeded',
            description: `Please wait ${remaining} second${remaining !== 1 ? 's' : ''} before trying again`,
            variant: 'destructive',
          });
          
          throw new Error(errorMsg);
        }

        // Handle other errors - don't record check on error
        const errorMsg = data.message || 'Failed to fetch server status';
        const errorInfo = getServerErrorMessage(errorMsg);
        setErrorDetails(errorInfo);
        
        toast({
          title: errorInfo.title,
          description: errorInfo.message,
          variant: 'destructive',
        });
        
        throw new Error(errorMsg);
      }

      // Only record check time on successful request
      ClientCooldown.recordCheck(hostname);
      
      setServerData(data);
      setError(null);
      setErrorDetails(null);
      setShowTurnstile(false);
      
      // Show success toast for manual checks
      if (manual) {
        toast({
          title: 'Server status updated',
          description: data.server.online ? `${hostname} is online` : `${hostname} appears to be offline`,
        });
      }
      
      // Reset turnstile for next check
      setTurnstileToken(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch server status';
      setError(errorMsg);
      
      // Parse and set error details if not already set
      if (!errorDetails) {
        const parsedError = parseAPIError(err);
        const errorInfo = getServerErrorMessage(parsedError.message);
        setErrorDetails(errorInfo);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hostname, actualPort, isBedrock, turnstileToken, toast, errorDetails]);

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(() => {
      // Only auto-refresh if not in cooldown
      const remaining = ClientCooldown.getRemainingTime(hostname);
      if (remaining === 0) {
        fetchServerStatus();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchServerStatus, hostname]);

  // Check if server is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const favorites = await response.json();
          const inFavorites = favorites.some(
            (fav: any) => fav.host === hostname && fav.port === actualPort
          );
          setIsFavorite(inFavorites);
        }
      } catch (error) {
        console.error('Failed to check favorites:', error);
      }
    };
    
    checkFavorite();
  }, [session, hostname, actualPort]);

  const toggleFavorite = async () => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add favorites',
        variant: 'destructive',
      });
      router.push('/auth/signin');
      return;
    }

    setFavoritesLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host: hostname, port: actualPort }),
        });

        if (response.ok) {
          setIsFavorite(false);
          toast({
            title: 'Removed from favorites',
            description: `${hostname}:${actualPort} has been removed`,
          });
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host: hostname, port: actualPort }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast({
            title: 'Added to favorites',
            description: `${hostname}:${actualPort} has been saved`,
          });
        } else {
          const data = await response.json();
          toast({
            title: 'Error',
            description: data.message || 'Failed to add to favorites',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    } finally {
      setFavoritesLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Copied to clipboard',
      description: text,
    });
  };

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    fetchServerStatus(true, token);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Card className="border-2 backdrop-blur-sm bg-background/95">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-10 w-64 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-2 backdrop-blur-sm bg-background/95">
            <CardHeader className="pb-3">
              <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 backdrop-blur-sm bg-background/95">
        <CardHeader>
          <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Breadcrumbs
            items={[
              { label: 'Server Status', href: `#${hostname}` }
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <Button variant="ghost" onClick={() => router.push('/')} className="group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              disabled={favoritesLoading}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchServerStatus(true)}
              disabled={refreshing || cooldownTime > 0 || (ENABLE_TURNSTILE && !turnstileToken && cooldownTime === 0)}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {cooldownTime > 0 
                ? `Wait ${cooldownTime}s` 
                : refreshing 
                  ? 'Checking...' 
                  : 'Check Again'
              }
            </Button>
            {/* <ThemeToggle /> */}
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {hostname}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-lg">
                      <Server className="w-5 h-5" />
                      {hostname}:{actualPort}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${hostname}:${actualPort}`)}
                        className="h-6 w-6 p-0 hover:scale-110 transition-transform"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </CardDescription>
                  </div>
                  {serverData && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Badge
                        variant={serverData.server.online ? 'default' : 'destructive'}
                        className="text-sm px-4 py-2"
                      >
                        <Wifi className="w-3 h-3 mr-1" />
                        {serverData.server.online ? 'Online' : 'Offline'}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardHeader>

              {/* Cooldown Message */}
              {cooldownTime > 0 && (
                <CardContent className="pt-0">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t pt-4"
                  >
                    <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-4 text-center">
                      <Clock className="w-5 h-5 inline-block mr-2 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        You can check this server again in {cooldownTime} second{cooldownTime !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </motion.div>
                </CardContent>
              )}

              {/* Turnstile Widget */}
              {showTurnstile && ENABLE_TURNSTILE && TURNSTILE_SITE_KEY && cooldownTime === 0 && (
                <CardContent className="pt-0">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t pt-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Please complete the verification to continue:</span>
                      </div>
                      <div className="flex justify-center">
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={(token) => {
                            setTurnstileToken(token);
                            fetchServerStatus(true, token);
                          }}
                          onError={() => setTurnstileToken(null)}
                          onExpire={() => setTurnstileToken(null)}
                        />
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-2 border-destructive/50 bg-destructive/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Error Icon and Title */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
                          <AlertTriangle className="w-12 h-12 text-destructive relative z-10" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-bold text-destructive">
                          {errorDetails?.title || 'Error'}
                        </h3>
                        <p className="text-lg font-medium text-foreground">
                          {errorDetails?.message || error}
                        </p>
                        {errorDetails?.suggestion && (
                          <p className="text-sm text-muted-foreground border-l-4 border-muted pl-4 py-2">
                            <strong>Suggestion:</strong> {errorDetails.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Show Turnstile if needed */}
                    {showTurnstile && ENABLE_TURNSTILE && TURNSTILE_SITE_KEY && cooldownTime === 0 && (
                      <div className="border-t pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            <span>Please complete the verification to continue:</span>
                          </div>
                          <div className="flex justify-center">
                            <Turnstile
                              siteKey={TURNSTILE_SITE_KEY}
                              onSuccess={(token) => {
                                setTurnstileToken(token);
                                setError(null);
                                setErrorDetails(null);
                                fetchServerStatus(true, token);
                              }}
                              onError={() => setTurnstileToken(null)}
                              onExpire={() => setTurnstileToken(null)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center border-t pt-6">
                      <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                      </Button>
                      <Button
                        onClick={() => fetchServerStatus(true)}
                        disabled={cooldownTime > 0 || (ENABLE_TURNSTILE && !turnstileToken && showTurnstile)}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {cooldownTime > 0 ? `Wait ${cooldownTime}s...` : 'Try Again'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {serverData && !loading && !error && (
            <>
              {/* Server Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 backdrop-blur-sm bg-background/95">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      Server Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Players */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium">Players Online</span>
                        </div>
                        <div className="text-3xl font-bold">
                          {serverData.players?.online || 0} / {serverData.players?.max || 0}
                        </div>
                        <Progress
                          value={serverData.players?.max ? (serverData.players.online / serverData.players.max) * 100 : 0}
                          className="h-2"
                        />
                      </div>

                      {/* Version */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">Version</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {serverData.server.version || 'Unknown'}
                        </div>
                        {serverData.server.protocol && (
                          <p className="text-sm text-muted-foreground">
                            Protocol: {serverData.server.protocol}
                          </p>
                        )}
                        {serverData.server.software && (
                          <p className="text-sm text-muted-foreground">
                            Software: {serverData.server.software}
                          </p>
                        )}
                      </div>

                      {/* Latency */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-pink-500" />
                          <span className="font-medium">Latency</span>
                        </div>
                        <div className="text-3xl font-bold">
                          {serverData.performance.ping || 0}
                          <span className="text-lg text-muted-foreground ml-1">ms</span>
                        </div>
                      </div>

                      {/* IP & Port */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Network</span>
                        </div>
                        <div className="font-mono text-lg">
                          {serverData.server.ip || 'N/A'}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Port: {serverData.server.port}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* MOTD Display Card */}
              {serverData.motd && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-2 backdrop-blur-sm bg-background/95">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Server className="w-5 h-5" />
                          Message of the Day
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(serverData.motd!.raw.join('\n'))}
                            className="gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy MOTD
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/motd-editor?motd=${encodeURIComponent(serverData.motd!.raw.join('\n'))}`)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit MOTD
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="bg-black/90 p-6 rounded-md font-minecraft text-base whitespace-pre-wrap border-2 border-primary/20 min-h-24"
                        dangerouslySetInnerHTML={{ __html: serverData.motd.html }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Online Players */}
              {serverData.players?.list && serverData.players.list.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Card className="border-2 backdrop-blur-sm bg-background/95">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Online Players ({serverData.players.list.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {serverData.players.list.map((player, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-3 py-1.5 text-sm hover:scale-105 transition-transform"
                            >
                              {player}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Debug Information (Collapsible) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
                  <Card className="border-2 backdrop-blur-sm bg-background/95">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Bug className="w-5 h-5" />
                            Debug Information
                          </span>
                          {debugOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          Technical details about the server check
                        </CardDescription>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-6">
                        {/* Cache & Timing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Cache Time</p>
                            <p className="font-mono">{new Date(serverData.debug.cacheTime).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Server Type</p>
                            <Badge variant="outline" className="capitalize">
                              {serverData.debug.serverType}
                            </Badge>
                          </div>
                        </div>

                        {/* Hostname & IP */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Network Information</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Hostname: </span>
                              <span className="font-mono">{serverData.debug.dns?.hostname || serverData.server.hostname}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">IP Address: </span>
                              <span className="font-mono">{serverData.server.ip || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Port: </span>
                              <span className="font-mono">{serverData.server.port}</span>
                            </div>
                          </div>
                        </div>

                        {/* Protocol & Version */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Protocol Information</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Protocol Version: </span>
                              <span className="font-mono">{serverData.debug.protocol.version || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Version Name: </span>
                              <span className="font-mono">{serverData.debug.protocol.versionName || serverData.server.version || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Security Status */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Security Status</p>
                          <div className="flex gap-2">
                            <Badge variant={serverData.debug.security.mojangBlocked ? 'destructive' : 'default'}>
                              {serverData.debug.security.mojangBlocked ? 'Blocked by Mojang' : 'Not Blocked'}
                            </Badge>
                            {serverData.debug.security.eulaBlocked && (
                              <Badge variant="destructive">EULA Blocked</Badge>
                            )}
                          </div>
                        </div>

                        {/* SRV Record */}
                        {serverData.debug.dns?.srvRecord && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">SRV Record</p>
                            <div className="font-mono text-sm">
                              {serverData.debug.dns.srvRecord.host}:{serverData.debug.dns.srvRecord.port}
                            </div>
                          </div>
                        )}

                        {/* Connectivity Status */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Connectivity Status</p>
                          <div className="flex gap-2">
                            <Badge variant={serverData.debug.connectivity.hasQuery ? 'default' : 'secondary'}>
                              Query: {serverData.debug.connectivity.hasQuery ? 'Available' : 'Unavailable'}
                            </Badge>
                            <Badge variant={serverData.debug.connectivity.hasPlayers ? 'default' : 'secondary'}>
                              Players: {serverData.debug.connectivity.hasPlayers ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </div>

                        {/* Ping Status */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Ping Information</p>
                          <div className="font-mono">
                            {serverData.debug.connectivity.ping}ms
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Turnstile Script */}
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.onTurnstileVerify = function(token) {
              window.dispatchEvent(new CustomEvent('turnstile-verify', { detail: token }));
            };
          `,
        }}
      />

      {/* Listen for Turnstile events */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('turnstile-verify', function(e) {
              // This will be handled by the component
            });
          `,
        }}
      />
    </main>
  );
}
