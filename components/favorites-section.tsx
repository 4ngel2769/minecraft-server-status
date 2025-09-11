'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Server, Trash2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface Favorite {
  _id: string;
  serverHost: string;
  serverPort: number;
  serverType: 'java' | 'bedrock';
  alias?: string;
  addedAt: string;
}

export function FavoritesSection() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites?id=${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
        toast({
          title: 'Favorite removed',
          description: 'Server removed from favorites',
        });
      } else {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove favorite',
        variant: 'destructive',
      });
    }
  };

  const getServerSlug = (host: string, port: number) => {
    const slug = `${host.replace(/\./g, '-')}-${port}`;
    return `/server/${slug}`;
  };

  // Don't show section if user is not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <section id="favorites" className="w-full py-8">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Your Favorite Servers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Server className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">No favorite servers yet</p>
              <p className="text-sm text-muted-foreground">
                Check a server and click the heart icon to add it to your favorites
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {favorites.map((favorite) => (
                  <motion.div
                    key={favorite._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-background/50 hover:bg-background transition-colors">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {favorite.alias || favorite.serverHost}
                              </h3>
                              {favorite.alias && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {favorite.serverHost}:{favorite.serverPort}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {favorite.serverType}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              asChild
                              size="sm"
                              className="flex-1"
                            >
                              <Link href={getServerSlug(favorite.serverHost, favorite.serverPort)}>
                                <ExternalLink className="w-3 h-3 mr-2" />
                                View Status
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFavorite(favorite._id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
