'use client';

import { useState } from 'react';
import { Search, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Turnstile } from '@marsidev/react-turnstile';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [serverAddress, setServerAddress] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverAddress && turnstileToken) {
      const slug = encodeURIComponent(serverAddress);
      router.push(`/server/${slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Server className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Minecraft Server Status
              </h1>
              <p className="text-muted-foreground text-lg">
                Check the status of any Minecraft server in real-time
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search for a Server</CardTitle>
                <CardDescription>
                  Enter the server address (IP:Port or domain)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="play.hypixel.net"
                      value={serverAddress}
                      onChange={(e) => setServerAddress(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!turnstileToken}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="flex justify-center">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || 'your-site-key'}
                      onSuccess={(token) => setTurnstileToken(token)}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push('/motd-editor')}
              >
                Or try the MOTD Editor →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
