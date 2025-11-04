'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { getServerStatus, formatMOTD, type ServerStatus } from '@/lib/minecraft';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const [serverData, setServerData] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const serverAddress = decodeURIComponent(params.slug as string);

  const fetchServerStatus = async (manual: boolean = false) => {
    try {
      if (manual) setRefreshing(true);
      else setLoading(true);
      const data = await getServerStatus(serverAddress);
      setServerData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch server status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(() => fetchServerStatus(), 30000);
    return () => clearInterval(interval);
  }, [serverAddress]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
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
              onClick={() => fetchServerStatus(true)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Server Status
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-lg">
                      <Server className="w-5 h-5" />
                      {serverAddress}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
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
                        variant={serverData.online ? 'default' : 'destructive'}
                        className="text-sm px-4 py-2"
                      >
                        <Wifi className="w-3 h-3 mr-1" />
                        {serverData.online ? 'Online' : 'Offline'}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-24"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-primary opacity-20"></div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-destructive font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {serverData && !loading && (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg backdrop-blur-sm bg-background/95">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Players
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {serverData.players?.online || 0}{' '}
                      <span className="text-muted-foreground">/ {serverData.players?.max || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-purple-500/50 transition-all hover:shadow-lg backdrop-blur-sm bg-background/95">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-500" />
                      Version
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {serverData.version || 'Unknown'}
                    </div>
                    {serverData.software && (
                      <p className="text-sm text-muted-foreground mt-1">{serverData.software}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-pink-500/50 transition-all hover:shadow-lg backdrop-blur-sm bg-background/95">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-5 h-5 text-pink-500" />
                      Ping
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {serverData.ping || 0}
                      <span className="text-lg text-muted-foreground">ms</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-green-500/50 transition-all hover:shadow-lg backdrop-blur-sm bg-background/95">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-500" />
                      IP Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-mono">
                      {serverData.ip || 'N/A'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Port: {serverData.port}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* MOTD Card */}
              {serverData.motd && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-2 backdrop-blur-sm bg-background/95">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        Message of the Day
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="bg-secondary/50 p-6 rounded-md font-mono text-sm whitespace-pre-wrap border-2 border-primary/20"
                        dangerouslySetInnerHTML={{ __html: formatMOTD(serverData.motd) }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* DNS Info */}
              {serverData.dns && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Card className="border-2 backdrop-blur-sm bg-background/95">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        DNS Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Hostname</p>
                        <p className="font-mono">{serverData.dns.hostname}</p>
                      </div>
                      {serverData.dns.ip && (
                        <div>
                          <p className="text-sm text-muted-foreground">IP Address</p>
                          <p className="font-mono">{serverData.dns.ip}</p>
                        </div>
                      )}
                      {serverData.dns.srvRecord && (
                        <div>
                          <p className="text-sm text-muted-foreground">SRV Record</p>
                          <p className="font-mono">
                            {serverData.dns.srvRecord.host}:{serverData.dns.srvRecord.port}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Security Status */}
              {serverData.mojangBlocked !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className={`border-2 backdrop-blur-sm bg-background/95 ${serverData.mojangBlocked ? 'border-destructive/50' : 'border-green-500/50'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Badge variant={serverData.mojangBlocked ? 'destructive' : 'default'}>
                          {serverData.mojangBlocked ? 'Blocked by Mojang' : 'Not Blocked'}
                        </Badge>
                        {serverData.eula_blocked && (
                          <Badge variant="destructive">EULA Blocked</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Online Players */}
              {serverData.players?.list && serverData.players.list.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
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
                            transition={{ delay: 0.5 + index * 0.05 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-3 py-1.5 text-sm hover:scale-105 transition-transform"
                            >
                              {typeof player === 'string' ? player : player.name}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
