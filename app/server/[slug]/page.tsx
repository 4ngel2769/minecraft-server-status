'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Wifi, Clock, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { getServerStatus, type ServerStatus } from '@/lib/minecraft';

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const [serverData, setServerData] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const serverAddress = decodeURIComponent(params.slug as string);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        setLoading(true);
        const data = await getServerStatus(serverAddress);
        setServerData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch server status');
      } finally {
        setLoading(false);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [serverAddress]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">Server Status</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-lg">
                    {serverAddress}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-6 w-6 p-0"
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
                  <Badge variant={serverData.online ? 'default' : 'destructive'} className="text-sm">
                    <Wifi className="w-3 h-3 mr-1" />
                    {serverData.online ? 'Online' : 'Offline'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive">{error}</p>
                </div>
              )}

              {serverData && !loading && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Players
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {serverData.players?.online || 0} / {serverData.players?.max || 0}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Version
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {serverData.version || 'Unknown'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Ping</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {serverData.ping || 0}ms
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {serverData.motd && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Message of the Day</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                          {serverData.motd}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {serverData.players?.list && serverData.players.list.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Online Players</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {serverData.players.list.map((player, index) => (
                            <Badge key={index} variant="secondary">
                              {player}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
