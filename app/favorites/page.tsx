'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, Server, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface FavoriteServer {
  host: string;
  port: number;
  nickname?: string;
  addedAt: string;
}

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  loading?: boolean;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteServer[]>([]);
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/favorites');
    } else if (status === 'authenticated') {
      loadFavorites();
    }
  }, [status, router]);

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        // Load status for each server
        data.forEach((server: FavoriteServer) => {
          loadServerStatus(server);
        });
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServerStatus = async (server: FavoriteServer) => {
    const key = `${server.host}:${server.port}`;
    
    // Set loading state
    setServerStatuses(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, online: false },
    }));

    try {
      const response = await fetch(
        `/api/server?host=${encodeURIComponent(server.host)}&port=${server.port}&type=java`
      );
      
      if (response.ok) {
        const data = await response.json();
        setServerStatuses(prev => ({
          ...prev,
          [key]: {
            online: data.online,
            players: data.players,
            version: data.version,
            loading: false,
          },
        }));
      } else {
        setServerStatuses(prev => ({
          ...prev,
          [key]: { online: false, loading: false },
        }));
      }
    } catch (error) {
      setServerStatuses(prev => ({
        ...prev,
        [key]: { online: false, loading: false },
      }));
    }
  };

  const removeFavorite = async (host: string, port: number) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port }),
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(s => !(s.host === host && s.port === port)));
        const key = `${host}:${port}`;
        setServerStatuses(prev => {
          const newStatuses = { ...prev };
          delete newStatuses[key];
          return newStatuses;
        });
        toast({
          title: 'Success',
          description: 'Server removed from favorites',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove server',
        variant: 'destructive',
      });
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    for (const server of favorites) {
      await loadServerStatus(server);
    }
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'All server statuses updated',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <GradientBackground />
        <div className="relative z-10 text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Favorite Servers
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage and monitor your favorite Minecraft servers in one place
          </p>
        </div>

        {/* Actions */}
        {favorites.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Button
              onClick={refreshAll}
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card className="backdrop-blur-sm bg-background/95 border-primary/20">
            <CardContent className="py-12">
              <div className="text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding your favorite Minecraft servers to keep track of them
                </p>
                <Button asChild>
                  <Link href="/">
                    <Server className="w-4 h-4 mr-2" />
                    Check a Server
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((server) => {
              const key = `${server.host}:${server.port}`;
              const status = serverStatuses[key] || { online: false, loading: true };
              
              return (
                <Card
                  key={key}
                  className="backdrop-blur-sm bg-background/95 border-primary/20 hover:border-primary/40 transition-all"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status.loading
                              ? 'bg-gray-400 animate-pulse'
                              : status.online
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <p className="text-lg font-semibold">
                            {server.nickname || server.host}
                          </p>
                          {server.nickname && (
                            <p className="text-sm text-muted-foreground font-normal">
                              {server.host}:{server.port}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFavorite(server.host, server.port)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Server Info */}
                    {status.loading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading status...
                      </div>
                    ) : status.online ? (
                      <div className="space-y-2">
                        {status.players && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Players:</span>
                            <span className="font-medium">
                              {status.players.online} / {status.players.max}
                            </span>
                          </div>
                        )}
                        {status.version && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Version:</span>
                            <span className="font-medium">{status.version}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        Server offline or unreachable
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/server/${encodeURIComponent(`${server.host}:${server.port}`)}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadServerStatus(server)}
                        disabled={status.loading}
                      >
                        <RefreshCw className={`w-4 h-4 ${status.loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
