'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, CheckCircle2, Download, Palette, Type, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { parseColorCodes } from '@/lib/minecraft';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MotdEditorPage() {
  const router = useRouter();
  const [motdText, setMotdText] = useState('');
  const [copied, setCopied] = useState(false);

  const colors = [
    { value: 'black', label: 'Black', code: '§0', hex: '#000000' },
    { value: 'dark_blue', label: 'Dark Blue', code: '§1', hex: '#0000AA' },
    { value: 'dark_green', label: 'Dark Green', code: '§2', hex: '#00AA00' },
    { value: 'dark_aqua', label: 'Dark Aqua', code: '§3', hex: '#00AAAA' },
    { value: 'dark_red', label: 'Dark Red', code: '§4', hex: '#AA0000' },
    { value: 'dark_purple', label: 'Dark Purple', code: '§5', hex: '#AA00AA' },
    { value: 'gold', label: 'Gold', code: '§6', hex: '#FFAA00' },
    { value: 'gray', label: 'Gray', code: '§7', hex: '#AAAAAA' },
    { value: 'dark_gray', label: 'Dark Gray', code: '§8', hex: '#555555' },
    { value: 'blue', label: 'Blue', code: '§9', hex: '#5555FF' },
    { value: 'green', label: 'Green', code: '§a', hex: '#55FF55' },
    { value: 'aqua', label: 'Aqua', code: '§b', hex: '#55FFFF' },
    { value: 'red', label: 'Red', code: '§c', hex: '#FF5555' },
    { value: 'light_purple', label: 'Light Purple', code: '§d', hex: '#FF55FF' },
    { value: 'yellow', label: 'Yellow', code: '§e', hex: '#FFFF55' },
    { value: 'white', label: 'White', code: '§f', hex: '#FFFFFF' },
  ];

  const formatCodes = [
    { value: 'bold', label: 'Bold', code: '§l', icon: '𝐁' },
    { value: 'italic', label: 'Italic', code: '§o', icon: '𝐼' },
    { value: 'underline', label: 'Underline', code: '§n', icon: 'U̲' },
    { value: 'strikethrough', label: 'Strike', code: '§m', icon: 'S̶' },
    { value: 'obfuscated', label: 'Magic', code: '§k', icon: '✨' },
    { value: 'reset', label: 'Reset', code: '§r', icon: '↺' },
  ];

  const templates = [
    {
      name: 'Classic Welcome',
      text: '§6Welcome to §bMy Server§r\n§aHave fun playing!',
    },
    {
      name: 'Premium Server',
      text: '§l§d✦ §5PREMIUM SERVER §d✦§r\n§f§oJoin the adventure!',
    },
    {
      name: 'Survival',
      text: '§a§l⚔ SURVIVAL SERVER ⚔§r\n§7Version §e1.20 §7| §bOnline §724/7',
    },
    {
      name: 'Mini Games',
      text: '§c§l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬§r\n§6§l  MINI GAMES  §r\n§c§l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    },
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
            Back to Home
          </Button>
          <ThemeToggle />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              MOTD Editor
            </h1>
            <p className="text-lg text-muted-foreground">
              Create stunning Minecraft server Messages of the Day with color codes and formatting
            </p>
          </motion.div>

          {/* Templates */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Templates
                </CardTitle>
                <CardDescription>Start with a pre-made template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((template, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:border-primary/50"
                        onClick={() => setMotdText(template.text)}
                      >
                        <span className="font-semibold">{template.name}</span>
                        <span className="text-xs font-mono text-muted-foreground whitespace-pre-wrap text-left">
                          {template.text.split('\n')[0].substring(0, 40)}...
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Color Codes */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Codes
                </CardTitle>
                <CardDescription>Click to insert color codes into your MOTD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {colors.map((c) => (
                    <motion.div key={c.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertCode(c.code)}
                        className="w-full justify-start gap-2 hover:border-primary/50"
                        style={{ borderLeftColor: c.hex, borderLeftWidth: '4px' }}
                      >
                        <span className="font-mono text-xs">{c.code}</span>
                        <span className="text-xs">{c.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Format Codes */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Format Codes
                </CardTitle>
                <CardDescription>Add styling to your text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formatCodes.map((f) => (
                    <motion.div key={f.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertCode(f.code)}
                        className="w-full justify-start gap-2 hover:border-purple-500/50"
                      >
                        <span className="text-lg">{f.icon}</span>
                        <span className="font-mono text-xs">{f.code}</span>
                        <span className="text-xs">{f.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Editor */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <CardTitle>Your MOTD</CardTitle>
                <CardDescription>
                  Type your message and use the codes above to format it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motd" className="text-base">MOTD Text</Label>
                  <Textarea
                    id="motd"
                    placeholder="§6Welcome to §bMy Server§r&#x0a;§aHave fun playing!"
                    value={motdText}
                    onChange={(e) => setMotdText(e.target.value)}
                    className="font-mono min-h-32 text-base border-2 focus:border-primary/50"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="gap-2">
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button onClick={downloadAsText} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download .txt
                  </Button>
                  <Button
                    onClick={() => setMotdText('')}
                    variant="outline"
                    className="gap-2 ml-auto"
                  >
                    Clear
                  </Button>
                </div>

                {motdText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-base">Live Preview</Label>
                    <div
                      className="bg-black/90 p-6 rounded-md font-mono text-base whitespace-pre-wrap border-2 border-primary/20 min-h-24"
                      dangerouslySetInnerHTML={{ __html: parseColorCodes(motdText) }}
                    />
                    <Label className="text-base">Raw Output</Label>
                    <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap break-all border-2 border-muted">
                      {motdText}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 backdrop-blur-sm bg-background/95">
              <CardHeader>
                <CardTitle>💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-3">
                    <Badge className="h-fit">1</Badge>
                    <p className="text-sm">
                      Use <code className="bg-secondary px-2 py-0.5 rounded font-mono">§</code> (section sign) before color/format codes
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="h-fit">2</Badge>
                    <p className="text-sm">
                      Use <code className="bg-secondary px-2 py-0.5 rounded font-mono">\n</code> for new lines in your MOTD
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="h-fit">3</Badge>
                    <p className="text-sm">
                      Use <code className="bg-secondary px-2 py-0.5 rounded font-mono">§r</code> to reset all formatting
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="h-fit">4</Badge>
                    <p className="text-sm">
                      Combine color and format codes for styled text like <code className="bg-secondary px-2 py-0.5 rounded font-mono">§a§lBold Green</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
