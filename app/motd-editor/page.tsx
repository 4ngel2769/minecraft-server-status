'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Download,
  Palette,
  Type,
  Sparkles,
  AlignCenter,
  RotateCcw,
  Hash,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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

// Minecraft color palette
const COLORS = [
  { name: 'Black', code: '§0', hex: '#000000' },
  { name: 'Dark Blue', code: '§1', hex: '#0000AA' },
  { name: 'Dark Green', code: '§2', hex: '#00AA00' },
  { name: 'Dark Aqua', code: '§3', hex: '#00AAAA' },
  { name: 'Dark Red', code: '§4', hex: '#AA0000' },
  { name: 'Dark Purple', code: '§5', hex: '#AA00AA' },
  { name: 'Gold', code: '§6', hex: '#FFAA00' },
  { name: 'Gray', code: '§7', hex: '#AAAAAA' },
  { name: 'Dark Gray', code: '§8', hex: '#555555' },
  { name: 'Blue', code: '§9', hex: '#5555FF' },
  { name: 'Green', code: '§a', hex: '#55FF55' },
  { name: 'Aqua', code: '§b', hex: '#55FFFF' },
  { name: 'Red', code: '§c', hex: '#FF5555' },
  { name: 'Light Purple', code: '§d', hex: '#FF55FF' },
  { name: 'Yellow', code: '§e', hex: '#FFFF55' },
  { name: 'White', code: '§f', hex: '#FFFFFF' },
];

// Format codes
const FORMATS = [
  { name: 'Bold', code: '§l', icon: 'B', description: 'Make text bold' },
  { name: 'Italic', code: '§o', icon: 'I', description: 'Make text italic' },
  { name: 'Underline', code: '§n', icon: 'U', description: 'Underline text' },
  { name: 'Strikethrough', code: '§m', icon: 'S', description: 'Strike through text' },
  { name: 'Obfuscated', code: '§k', icon: '✨', description: 'Random characters effect' },
  { name: 'Reset', code: '§r', icon: '↺', description: 'Reset all formatting' },
];

export default function MotdEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [centerLines, setCenterLines] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  
  // Gradient tool state
  const [gradientStart, setGradientStart] = useState('#FF5555');
  const [gradientEnd, setGradientEnd] = useState('#FFFF55');
  const [gradientText, setGradientText] = useState('');
  
  // Custom hex color input
  const [customHex, setCustomHex] = useState('#FFFFFF');

  // Load MOTD from URL query params if present
  useEffect(() => {
    const motd = searchParams.get('motd');
    if (motd) {
      const lines = motd.split('\n');
      setLine1(lines[0] || '');
      setLine2(lines[1] || '');
    }
  }, [searchParams]);

  const getCurrentLine = () => activeLine === 1 ? line1 : line2;
  const setCurrentLine = (value: string) => {
    if (activeLine === 1) setLine1(value);
    else setLine2(value);
  };

  const insertCode = (code: string) => {
    const currentText = getCurrentLine();
    setCurrentLine(currentText + code);
  };

  const insertColorAtCursor = (code: string) => {
    insertCode(code);
  };

  const hexToMinecraftColor = (hex: string): string => {
    // Find closest Minecraft color or return the hex as RGB format
    const closest = COLORS.reduce((prev, curr) => {
      const prevDist = colorDistance(hex, prev.hex);
      const currDist = colorDistance(hex, curr.hex);
      return currDist < prevDist ? curr : prev;
    });
    return closest.code;
  };

  const colorDistance = (hex1: string, hex2: string): number => {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);
    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
  };

  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const applyGradient = () => {
    if (!gradientText) return;
    
    let result = '';
    for (let i = 0; i < gradientText.length; i++) {
      const factor = i / (gradientText.length - 1 || 1);
      const color = interpolateColor(gradientStart, gradientEnd, factor);
      const minecraftColor = hexToMinecraftColor(color);
      result += minecraftColor + gradientText[i];
    }
    
    setCurrentLine(getCurrentLine() + result);
    setGradientText('');
  };

  const centerText = (text: string): string => {
    const maxLength = 60;
    const stripped = text.replace(/§[0-9a-fk-or]/gi, '');
    const spaces = Math.max(0, Math.floor((maxLength - stripped.length) / 2));
    return ' '.repeat(spaces) + text;
  };

  const getFullMOTD = () => {
    const l1 = centerLines ? centerText(line1) : line1;
    const l2 = centerLines ? centerText(line2) : line2;
    return `${l1}\n${l2}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFullMOTD());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const blob = new Blob([getFullMOTD()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motd.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCharCount = (text: string) => {
    return text.replace(/§[0-9a-fk-or]/gi, '').length;
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
