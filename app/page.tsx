'use client';

import { useState, useEffect } from 'react';
import { Search, Server, Zap, Eye, Code, Clock, Activity, Users, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Turnstile } from '@marsidev/react-turnstile';
import { ClientCooldown } from '@/lib/rate-limit';
import { useToast } from '@/hooks/use-toast';
import { validateHostname, validatePort } from '@/lib/validation';

interface RecentServer {
  address: string;
  timestamp: number;
  isBedrock: boolean;
}

// Get environment configuration
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const ENABLE_TURNSTILE = process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === 'true';

export default function Home() {
  const [serverAddress, setServerAddress] = useState('');
  const [isBedrock, setIsBedrock] = useState(false);
  const [recentServers, setRecentServers] = useState<RecentServer[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load recent servers from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentServers');
    if (stored) {
      setRecentServers(JSON.parse(stored));
    }
  }, []);

  // Check cooldown when server address changes
  useEffect(() => {
    if (serverAddress.trim()) {
      const remaining = ClientCooldown.getRemainingTime(serverAddress);
      setCooldownTime(remaining);
      
      // Show Turnstile only after cooldown expires (if enabled)
      if (remaining === 0 && ENABLE_TURNSTILE) {
        setShowTurnstile(true);
      } else {
        setShowTurnstile(false);
        setTurnstileToken(null);
      }
    }
  }, [serverAddress]);

  // Countdown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        const remaining = ClientCooldown.getRemainingTime(serverAddress);
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
  }, [cooldownTime, serverAddress]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverAddress.trim()) {
      // Check if Turnstile is required
      if (ENABLE_TURNSTILE && !turnstileToken) {
        // Show Turnstile if not already shown
        setShowTurnstile(true);
        return;
      }

      // Record cooldown
      ClientCooldown.recordCheck(serverAddress);
      
      // Save to recent servers
      const newRecent: RecentServer = {
        address: serverAddress,
        timestamp: Date.now(),
        isBedrock,
      };
      const updated = [newRecent, ...recentServers.filter(s => s.address !== serverAddress)].slice(0, 5);
      setRecentServers(updated);
      localStorage.setItem('recentServers', JSON.stringify(updated));

      // Navigate to server page with turnstile token if needed
      const slug = encodeURIComponent(serverAddress);
      const params = new URLSearchParams({
        bedrock: isBedrock.toString(),
        ...(turnstileToken && { token: turnstileToken }),
      });
      router.push(`/server/${slug}?${params.toString()}`);
    }
  };

  const canSubmit = () => {
    if (cooldownTime > 0) return false;
    if (ENABLE_TURNSTILE && !turnstileToken) return false;
    return serverAddress.trim().length > 0;
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Status',
      description: 'Get instant updates on server status, player count, and performance metrics.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Eye,
      title: 'MOTD Preview',
      description: 'View server messages with full formatting support including colors and styles.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Users,
      title: 'Player Information',
      description: 'See who\'s online, max capacity, and detailed player statistics.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Code,
      title: 'MOTD Editor',
      description: 'Create stunning server messages with our visual editor and color picker.',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <GradientBackground 
          className="opacity-20 dark:opacity-10"
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Minecraft Server
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
                Status Checker
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Monitor any Minecraft server in real-time. Check player counts, server status, and MOTD with ease.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 border-2 shadow-2xl">
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="mc.hypixel.net"
                      value={serverAddress}
                      onChange={(e) => setServerAddress(e.target.value)}
                      className="h-14 text-lg rounded-xl border-2 focus-visible:ring-4"
                      required
                    />
                    
                    <div className="flex items-center space-x-3 px-2">
                      <Checkbox
                        id="bedrock"
                        checked={isBedrock}
                        onCheckedChange={(checked) => setIsBedrock(checked as boolean)}
                      />
                      <Label
                        htmlFor="bedrock"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Is this a Bedrock server?
                      </Label>
                    </div>

                    {/* Turnstile Widget */}
                    {showTurnstile && ENABLE_TURNSTILE && TURNSTILE_SITE_KEY && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex justify-center"
                      >
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={(token) => setTurnstileToken(token)}
                          onError={() => setTurnstileToken(null)}
                          onExpire={() => setTurnstileToken(null)}
                        />
                      </motion.div>
                    )}

                    {/* Cooldown Message */}
                    {cooldownTime > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 text-center"
                      >
                        <Clock className="w-5 h-5 inline-block mr-2 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          You can check again in {cooldownTime} second{cooldownTime !== 1 ? 's' : ''}
                        </span>
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={!canSubmit()}
                      className="w-full h-14 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      {cooldownTime > 0 
                        ? `Wait ${cooldownTime}s...` 
                        : ENABLE_TURNSTILE && !turnstileToken && showTurnstile
                          ? 'Complete verification above'
                          : 'Check Server Status'
                      }
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Default ports: Java (25565), Bedrock (19132)
                      {ENABLE_TURNSTILE && (
                        <>
                          {' • '}
                          <Shield className="w-3 h-3 inline mr-1" />
                          Protected by Cloudflare Turnstile
                        </>
                      )}
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to monitor Minecraft servers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full backdrop-blur-sm bg-card/60 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
                    feature.gradient
                  )}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Checks Section */}
      {recentServers.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Recent Checks</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {recentServers.map((server, index) => (
                <motion.div
                  key={`${server.address}-${server.timestamp}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Card
                    className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-card/60"
                    onClick={() => router.push(`/server/${encodeURIComponent(server.address)}?bedrock=${server.isBedrock}`)}
                  >
                    <CardContent className="py-4 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            server.isBedrock ? "bg-orange-500" : "bg-green-500"
                          )} />
                          <span className="font-medium">{server.address}</span>
                          <span className="text-xs text-muted-foreground">
                            {server.isBedrock ? 'Bedrock' : 'Java'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(server.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/20">
            <CardContent className="py-12 px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Create Custom MOTD Messages
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Design beautiful server messages with our visual editor
              </p>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-xl font-semibold border-2 hover:bg-primary hover:text-primary-foreground"
                onClick={() => router.push('/motd-editor')}
              >
                <Code className="w-5 h-5 mr-2" />
                Try MOTD Editor
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
