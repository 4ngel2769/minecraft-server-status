'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MotdEditorPage() {
  const router = useRouter();
  const [motdText, setMotdText] = useState('');
  const [color, setColor] = useState('white');
  const [copied, setCopied] = useState(false);

  const colors = [
    { value: 'white', label: 'White', code: '§f' },
    { value: 'black', label: 'Black', code: '§0' },
    { value: 'dark_blue', label: 'Dark Blue', code: '§1' },
    { value: 'dark_green', label: 'Dark Green', code: '§2' },
    { value: 'dark_aqua', label: 'Dark Aqua', code: '§3' },
    { value: 'dark_red', label: 'Dark Red', code: '§4' },
    { value: 'dark_purple', label: 'Dark Purple', code: '§5' },
    { value: 'gold', label: 'Gold', code: '§6' },
    { value: 'gray', label: 'Gray', code: '§7' },
    { value: 'dark_gray', label: 'Dark Gray', code: '§8' },
    { value: 'blue', label: 'Blue', code: '§9' },
    { value: 'green', label: 'Green', code: '§a' },
    { value: 'aqua', label: 'Aqua', code: '§b' },
    { value: 'red', label: 'Red', code: '§c' },
    { value: 'light_purple', label: 'Light Purple', code: '§d' },
    { value: 'yellow', label: 'Yellow', code: '§e' },
  ];

  const formatCodes = [
    { value: 'bold', label: 'Bold', code: '§l' },
    { value: 'italic', label: 'Italic', code: '§o' },
    { value: 'underline', label: 'Underline', code: '§n' },
    { value: 'strikethrough', label: 'Strikethrough', code: '§m' },
    { value: 'obfuscated', label: 'Obfuscated', code: '§k' },
    { value: 'reset', label: 'Reset', code: '§r' },
  ];

  const insertCode = (code: string) => {
    setMotdText((prev) => prev + code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(motdText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const blob = new Blob([motdText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motd.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">MOTD Editor</h1>
            <p className="text-muted-foreground">
              Create and customize your Minecraft server Message of the Day
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Color Codes</CardTitle>
              <CardDescription>Click to insert color codes into your MOTD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <Button
                    key={c.value}
                    variant="outline"
                    size="sm"
                    onClick={() => insertCode(c.code)}
                  >
                    <span className="font-mono">{c.code}</span> {c.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format Codes</CardTitle>
              <CardDescription>Click to insert formatting codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formatCodes.map((f) => (
                  <Button
                    key={f.value}
                    variant="outline"
                    size="sm"
                    onClick={() => insertCode(f.code)}
                  >
                    <span className="font-mono">{f.code}</span> {f.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your MOTD</CardTitle>
              <CardDescription>
                Type your message and use the codes above to format it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motd">MOTD Text</Label>
                <Textarea
                  id="motd"
                  placeholder="§6Welcome to §bMy Server§r&#x0a;§aHave fun playing!"
                  value={motdText}
                  onChange={(e) => setMotdText(e.target.value)}
                  className="font-mono min-h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button onClick={downloadAsText} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              {motdText && (
                <div className="space-y-2">
                  <Label>Preview (Raw)</Label>
                  <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap break-all">
                    {motdText}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Use <code className="bg-secondary px-1 rounded">§</code> (section sign) before color/format codes</p>
              <p>• Use <code className="bg-secondary px-1 rounded">\n</code> or line breaks for multiple lines</p>
              <p>• Use <code className="bg-secondary px-1 rounded">§r</code> to reset formatting</p>
              <p>• Combine color and format codes for styled text</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
