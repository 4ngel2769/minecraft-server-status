'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  Share2,
  FileCode,
  ChevronDown,
  ChevronUp,
  Link,
  Upload,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { parseColorCodes } from '@/lib/minecraft';
import {
  parseMinecraftColors,
  convertToFormat,
  generateGradient as generateGradientText,
  encodeForURL,
  decodeFromURL,
  centerText as centerTextUtil,
  getVisibleLength,
  validateMOTD,
} from '@/lib/motd-formatter';
import { GradientBackground } from '@/components/animate-ui/components/backgrounds/gradient';
import { useToast } from '@/hooks/use-toast';
import { validateMOTDLength, validateMOTDURLParams, validateColorCode } from '@/lib/validation';

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

// MOTD Templates
const TEMPLATES = [
  {
    name: 'Simple Welcome',
    description: 'Clean and simple welcome message',
    line1: '§6Welcome to §bMy Server',
    line2: '§aHave fun playing!',
  },
  {
    name: 'Gradient Rainbow',
    description: 'Eye-catching rainbow gradient',
    line1: '§x§F§F§5§5§5§5R§x§F§F§8§8§5§5a§x§F§F§B§B§5§5i§x§F§F§E§E§5§5n§x§F§F§F§F§5§5b§x§5§5§F§F§5§5o§x§5§5§F§F§F§Fw §x§5§5§5§5§F§FS§x§8§8§5§5§F§Fe§x§B§B§5§5§F§Fr§x§E§E§5§5§F§Fv§x§F§F§5§5§F§Fe§x§F§F§5§5§8§8r',
    line2: '§7Version 1.20 §8• §aSurvival §8• §bCreative',
  },
  {
    name: 'Professional',
    description: 'Professional gaming server',
    line1: '§8[§6§lPREMIUM§8] §f§lMY SERVER §8[§6§lPREMIUM§8]',
    line2: '§7Join now for §a§l$5 OFF §7your first rank!',
  },
  {
    name: 'Minecraft Classic',
    description: 'Classic Minecraft style',
    line1: '§2§l-=- §a§lSurvival Server §2§l-=-',
    line2: '§7Now with §6Custom Enchants §7and §bCrates',
  },
  {
    name: 'Event Announcement',
    description: 'Special event promotion',
    line1: '§c§l⚡ §6§lDOUBLE XP WEEKEND §c§l⚡',
    line2: '§eNov 4-6 §8| §aJoin now and level up!',
  },
  {
    name: 'Seasonal Theme',
    description: 'Holiday or seasonal message',
    line1: '§x§F§F§D§7§0§0❄ §b§lWinter Update §x§F§F§D§7§0§0❄',
    line2: '§fNew snow biomes §8• §bIce dungeons §8• §aSki racing',
  },
];

function MotdEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [centerLines, setCenterLines] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  
  // Collapsible states
  const [exportExpanded, setExportExpanded] = useState<string[]>([]);
  const [shareExpanded, setShareExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  
  // Gradient tool state
  const [gradientStart, setGradientStart] = useState('#FF5555');
  const [gradientEnd, setGradientEnd] = useState('#FFFF55');
  const [gradientText, setGradientText] = useState('');
  
  // Custom hex color input
  const [customHex, setCustomHex] = useState('#FFFFFF');
  
  // Export format
  const [exportFormat, setExportFormat] = useState<'vanilla' | 'spigot' | 'bungeecord' | 'serverlistplus'>('spigot');

  // Validate URL parameters
  useEffect(() => {
    const validation = validateMOTDURLParams(searchParams);
    if (!validation.valid && validation.error) {
      toast({
        title: 'Invalid URL parameter',
        description: validation.error,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  // Load MOTD from URL query params if present
  useEffect(() => {
    const motd = searchParams.get('motd');
    const text = searchParams.get('text');
    const encodedMotd = motd || text;
    
    if (encodedMotd) {
      try {
        const decoded = decodeFromURL(encodedMotd);
        const lines = decoded.split('\n');
        setLine1(lines[0] || '');
        setLine2(lines[1] || '');
        
        toast({
          title: 'MOTD loaded',
          description: 'Successfully imported MOTD from URL',
        });
      } catch (error) {
        console.error('Failed to decode MOTD from URL:', error);
        toast({
          title: 'Import failed',
          description: 'Could not decode MOTD from URL. The data may be corrupted.',
          variant: 'destructive',
        });
      }
    }
  }, [searchParams, toast]);

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
    // Convert hex to Minecraft hex format §x§R§R§G§G§B§B
    const cleaned = hex.replace('#', '').toUpperCase();
    return '§x' + cleaned.split('').map(c => `§${c}`).join('');
  };

  const applyGradient = () => {
    if (!gradientText) return;
    
    try {
      const gradientResult = generateGradientText(gradientText, gradientStart, gradientEnd);
      setCurrentLine(getCurrentLine() + gradientResult);
      setGradientText('');
    } catch (error) {
      console.error('Gradient generation failed:', error);
    }
  };

  const centerLine = (text: string): string => {
    return centerLines ? centerTextUtil(text, 60) : text;
  };

  const getFullMOTD = () => {
    const l1 = centerLine(line1);
    const l2 = centerLine(line2);
    return `${l1}\n${l2}`;
  };
  
  const getFormattedMOTD = () => {
    return convertToFormat(getFullMOTD(), exportFormat);
  };

  const copyToClipboard = () => {
    const motd = getFormattedMOTD();
    navigator.clipboard.writeText(motd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Copied to clipboard',
      description: 'MOTD text has been copied',
    });
  };

  const downloadAsText = () => {
    try {
      const blob = new Blob([getFormattedMOTD()], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `motd-${exportFormat}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download started',
        description: `Downloading motd-${exportFormat}.txt`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download the file',
        variant: 'destructive',
      });
    }
  };
  
  const shareURL = () => {
    try {
      const encoded = encodeForURL(getFullMOTD());
      const url = `${window.location.origin}/motd-editor?text=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      
      toast({
        title: 'Link copied',
        description: 'Share URL has been copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy the share link',
        variant: 'destructive',
      });
    }
  };
  
  const getShareURL = () => {
    if (typeof window === 'undefined') return '';
    try {
      const encoded = encodeForURL(getFullMOTD());
      return `${window.location.origin}/motd-editor?text=${encoded}`;
    } catch (error) {
      toast({
        title: 'URL generation failed',
        description: 'Could not generate share URL',
        variant: 'destructive',
      });
      return '';
    }
  };
  
  const loadTemplate = (template: typeof TEMPLATES[0]) => {
    setLine1(template.line1);
    setLine2(template.line2);
    
    toast({
      title: 'Template loaded',
      description: `Applied "${template.name}" template`,
    });
  };
  
  const copyExportCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Code copied',
      description: 'Export code has been copied to clipboard',
    });
  };
  
  const toggleExportSection = (section: string) => {
    setExportExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  // Generate export formats
  const getVanillaFormat = () => {
    const motd = getFullMOTD();
    // Convert to unicode escape sequences
    return `motd=${motd.replace(/§/g, '\\u00A7')}`;
  };
  
  const getSpigotFormat = () => {
    return `motd=${convertToFormat(getFullMOTD(), 'spigot')}`;
  };
  
  const getBungeeCordFormat = () => {
    const motd = convertToFormat(getFullMOTD(), 'bungeecord');
    return `motd: "${motd}"`;
  };
  
  const getServerListPlusFormat = () => {
    const motd = convertToFormat(getFullMOTD(), 'serverlistplus');
    const lines = motd.split('\n');
    return `# ServerListPlus Configuration
Motd:
  - "${lines[0] || ''}"
  - "${lines[1] || ''}"`;
  };

  const getCharCount = (text: string) => {
    return getVisibleLength(text);
  };
  
  const validation = validateMOTD(getFullMOTD());
  const lengthValidation = validateMOTDLength(getFullMOTD());

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
              { label: 'MOTD Editor' }
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => router.push('/')} className="group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </motion.div>

        <TooltipProvider>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                MOTD Creator
              </h1>
              <p className="text-lg text-muted-foreground">
                Design your Minecraft server&apos;s Message of the Day
              </p>
              {searchParams.get('motd') || searchParams.get('text') ? (
                <Badge variant="secondary" className="gap-2">
                  <Upload className="w-3 h-3" />
                  Loaded from URL
                </Badge>
              ) : null}
            </motion.div>

            {/* Text Editor Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Text Editor
                  </CardTitle>
                  <CardDescription>
                    Create your two-line MOTD (recommended max ~60 characters per line)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Line Selector Tabs */}
                  <Tabs value={activeLine.toString()} onValueChange={(v) => setActiveLine(parseInt(v) as 1 | 2)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="1">Line 1</TabsTrigger>
                      <TabsTrigger value="2">Line 2</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="1" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="line1">Line 1</Label>
                          <Badge variant={getCharCount(line1) > 60 ? 'destructive' : 'secondary'}>
                            {getCharCount(line1)} / 60 chars
                          </Badge>
                        </div>
                        <Input
                          id="line1"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          placeholder="§6Welcome to §bMy Server"
                          className="font-mono text-base border-2"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="2" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="line2">Line 2</Label>
                          <Badge variant={getCharCount(line2) > 60 ? 'destructive' : 'secondary'}>
                            {getCharCount(line2)} / 60 chars
                          </Badge>
                        </div>
                        <Input
                          id="line2"
                          value={line2}
                          onChange={(e) => setLine2(e.target.value)}
                          placeholder="§aHave fun playing!"
                          className="font-mono text-base border-2"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Center Lines Option */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="center"
                      checked={centerLines}
                      onCheckedChange={(checked) => setCenterLines(checked as boolean)}
                    />
                    <Label htmlFor="center" className="flex items-center gap-2 cursor-pointer">
                      <AlignCenter className="w-4 h-4" />
                      Center the lines
                    </Label>
                  </div>

                  <Separator />

                  {/* Formatting Toolbar */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Formatting Toolbar</Label>
                    
                    {/* Color Picker Section */}
                    <div className="space-y-3">
                      <Label className="text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Colors
                      </Label>
                      
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                          <Tooltip key={color.code}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => insertColorAtCursor(color.code)}
                                className="w-10 h-10 p-0 border-2"
                                style={{ backgroundColor: color.hex }}
                              >
                                <span className="sr-only">{color.name}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{color.name} ({color.code})</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* Custom Hex Color */}
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="customHex" className="text-xs flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Custom Hex Color
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="customHex"
                              type="color"
                              value={customHex}
                              onChange={(e) => setCustomHex(e.target.value)}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customHex}
                              onChange={(e) => setCustomHex(e.target.value)}
                              placeholder="#FFFFFF"
                              className="font-mono flex-1"
                            />
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => insertColorAtCursor(hexToMinecraftColor(customHex))}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Format Buttons */}
                    <div className="space-y-3">
                      <Label className="text-sm">Format Options</Label>
                      <div className="flex flex-wrap gap-2">
                        {FORMATS.map((format) => (
                          <Tooltip key={format.code}>
                            <TooltipTrigger asChild>
                              <Toggle
                                variant="outline"
                                size="sm"
                                onClick={() => insertCode(format.code)}
                                className="gap-2"
                              >
                                <span className="font-bold">{format.icon}</span>
                                <span className="text-xs">{format.name}</span>
                              </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{format.description}</p>
                              <p className="text-xs text-muted-foreground font-mono">{format.code}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Gradient Tool */}
                    <div className="space-y-3">
                      <Label className="text-sm flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        Gradient Tool
                      </Label>
                      <div className="space-y-3 p-4 border-2 border-dashed rounded-lg">
                        <Input
                          placeholder="Enter text for gradient"
                          value={gradientText}
                          onChange={(e) => setGradientText(e.target.value)}
                          className="font-mono"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Start Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={gradientStart}
                                onChange={(e) => setGradientStart(e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                type="text"
                                value={gradientStart}
                                onChange={(e) => setGradientStart(e.target.value)}
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">End Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={gradientEnd}
                                onChange={(e) => setGradientEnd(e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                type="text"
                                value={gradientEnd}
                                onChange={(e) => setGradientEnd(e.target.value)}
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={applyGradient}
                          disabled={!gradientText}
                          className="w-full gap-2"
                          variant="secondary"
                        >
                          <Sparkles className="w-4 h-4" />
                          Apply Gradient to Line {activeLine}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Preview Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    Real-time preview of your MOTD as it will appear in Minecraft
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="bg-[#313233] p-8 rounded-md font-['Courier_New',_monospace] text-base whitespace-pre-wrap border-2 border-primary/20 min-h-32"
                    style={{
                      textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                      lineHeight: '1.8',
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: parseMinecraftColors(centerLine(line1)) || '<span style="color: #AAAAAA;">Line 1...</span>' }} />
                    <div dangerouslySetInnerHTML={{ __html: parseMinecraftColors(centerLine(line2)) || '<span style="color: #AAAAAA;">Line 2...</span>' }} />
                  </div>

                  {/* Validation Messages */}
                  {!validation.valid && (
                    <div className="bg-destructive/10 border-2 border-destructive/50 rounded-md p-3">
                      <p className="text-sm font-semibold text-destructive mb-2">⚠️ Validation Issues:</p>
                      <ul className="text-xs text-destructive space-y-1">
                        {validation.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Length Validation Warning */}
                  {lengthValidation.error && (
                    <div className={`border-2 rounded-md p-3 ${
                      lengthValidation.valid 
                        ? 'bg-yellow-500/10 border-yellow-500/50' 
                        : 'bg-destructive/10 border-destructive/50'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${
                          lengthValidation.valid ? 'text-yellow-500' : 'text-destructive'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold mb-1 ${
                            lengthValidation.valid ? 'text-yellow-500' : 'text-destructive'
                          }`}>
                            {lengthValidation.valid ? '⚠️ Length Warning' : '❌ Text Too Long'}
                          </p>
                          <p className={`text-xs ${
                            lengthValidation.valid ? 'text-yellow-600 dark:text-yellow-400' : 'text-destructive'
                          }`}>
                            {lengthValidation.error}
                          </p>
                          <p className={`text-xs mt-1 font-mono ${
                            lengthValidation.valid ? 'text-yellow-600 dark:text-yellow-400' : 'text-destructive'
                          }`}>
                            {getFullMOTD().length} / 256 characters
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Export Format Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
                      Export Format
                    </Label>
                    <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select server type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vanilla">Vanilla (Legacy codes only)</SelectItem>
                        <SelectItem value="spigot">Spigot/Paper (Unicode format)</SelectItem>
                        <SelectItem value="bungeecord">BungeeCord/Waterfall (& format)</SelectItem>
                        <SelectItem value="serverlistplus">ServerListPlus (&#RRGGBB)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Choose your server type for proper format code conversion
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={copyToClipboard} className="gap-2">
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy MOTD
                        </>
                      )}
                    </Button>
                    <Button onClick={downloadAsText} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setLine1('');
                        setLine2('');
                      }}
                      variant="outline"
                      className="gap-2 ml-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>

                  {/* Raw Output */}
                  <div className="space-y-2">
                    <Label className="text-sm">Formatted Output ({exportFormat})</Label>
                    <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap break-all border-2 border-muted">
                      {getFormattedMOTD() || 'Your MOTD will appear here...'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is the formatted code ready to paste into your server.properties or plugin config
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Templates Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <Collapsible open={templatesExpanded} onOpenChange={setTemplatesExpanded}>
                  <CardHeader className="pb-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full group">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          MOTD Templates
                        </CardTitle>
                        <CardDescription className="text-left">
                          Quick-start with pre-made designs
                        </CardDescription>
                      </div>
                      {templatesExpanded ? (
                        <ChevronUp className="w-5 h-5 group-hover:opacity-70 transition-opacity" />
                      ) : (
                        <ChevronDown className="w-5 h-5 group-hover:opacity-70 transition-opacity" />
                      )}
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TEMPLATES.map((template, index) => (
                          <Card
                            key={index}
                            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                            onClick={() => loadTemplate(template)}
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div
                                className="bg-[#313233] p-3 rounded-md font-['Courier_New',_monospace] text-xs border"
                                style={{
                                  textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
                                  lineHeight: '1.6',
                                }}
                              >
                                <div dangerouslySetInnerHTML={{ __html: parseMinecraftColors(template.line1) }} />
                                <div dangerouslySetInnerHTML={{ __html: parseMinecraftColors(template.line2) }} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>

            {/* Share Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <Collapsible open={shareExpanded} onOpenChange={setShareExpanded}>
                  <CardHeader className="pb-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full group">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Link className="w-5 h-5" />
                          Share Your MOTD
                        </CardTitle>
                        <CardDescription className="text-left">
                          Generate a shareable link to your design
                        </CardDescription>
                      </div>
                      {shareExpanded ? (
                        <ChevronUp className="w-5 h-5 group-hover:opacity-70 transition-opacity" />
                      ) : (
                        <ChevronDown className="w-5 h-5 group-hover:opacity-70 transition-opacity" />
                      )}
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shareUrl">Shareable URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="shareUrl"
                            value={getShareURL()}
                            readOnly
                            className="font-mono text-xs"
                          />
                          <Button
                            onClick={shareURL}
                            variant="secondary"
                            className="gap-2 shrink-0"
                          >
                            {copiedLink ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy Link
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Share this URL to let others view or edit your MOTD design
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>

            {/* Export Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Export to Server Configs
                  </CardTitle>
                  <CardDescription>
                    Copy formatted code for your server type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vanilla/Official */}
                  <Collapsible
                    open={exportExpanded.includes('vanilla')}
                    onOpenChange={() => toggleExportSection('vanilla')}
                  >
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              Vanilla/Official Server
                              <Badge variant="outline" className="text-xs">server.properties</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs text-left">
                              For official Minecraft servers
                            </CardDescription>
                          </div>
                          {exportExpanded.includes('vanilla') ? (
                            <ChevronUp className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          )}
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-3">
                          <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap break-all border relative group">
                            <Button
                              onClick={() => copyExportCode(getVanillaFormat())}
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <code>{getVanillaFormat()}</code>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-md p-3">
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                              ⚠️ Note: Does not support RGB/HEX colors
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Vanilla servers only support legacy color codes (§0-§f). HEX colors will not display correctly.
                            </p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Spigot/Paper */}
                  <Collapsible
                    open={exportExpanded.includes('spigot')}
                    onOpenChange={() => toggleExportSection('spigot')}
                  >
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              Spigot/Paper Server
                              <Badge variant="outline" className="text-xs">server.properties</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs text-left">
                              For Spigot, Paper, and forks
                            </CardDescription>
                          </div>
                          {exportExpanded.includes('spigot') ? (
                            <ChevronUp className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          )}
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-3">
                          <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap break-all border relative group">
                            <Button
                              onClick={() => copyExportCode(getSpigotFormat())}
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <code>{getSpigotFormat()}</code>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Supports HEX colors via §x§R§R§G§G§B§B format
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* BungeeCord */}
                  <Collapsible
                    open={exportExpanded.includes('bungeecord')}
                    onOpenChange={() => toggleExportSection('bungeecord')}
                  >
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              BungeeCord/Waterfall
                              <Badge variant="outline" className="text-xs">config.yml</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs text-left">
                              For proxy servers
                            </CardDescription>
                          </div>
                          {exportExpanded.includes('bungeecord') ? (
                            <ChevronUp className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          )}
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-3">
                          <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap break-all border relative group">
                            <Button
                              onClick={() => copyExportCode(getBungeeCordFormat())}
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <code>{getBungeeCordFormat()}</code>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uses & instead of § for color codes in YAML format
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* ServerListPlus */}
                  <Collapsible
                    open={exportExpanded.includes('serverlistplus')}
                    onOpenChange={() => toggleExportSection('serverlistplus')}
                  >
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              ServerListPlus
                              <Badge variant="outline" className="text-xs">Plugin Config</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs text-left">
                              For ServerListPlus plugin
                            </CardDescription>
                          </div>
                          {exportExpanded.includes('serverlistplus') ? (
                            <ChevronUp className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:opacity-70 transition-opacity" />
                          )}
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-3">
                          <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap break-all border relative group">
                            <Button
                              onClick={() => copyExportCode(getServerListPlusFormat())}
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <code>{getServerListPlusFormat()}</code>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Supports &#RRGGBB format for HEX colors
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setExportExpanded(['vanilla', 'spigot', 'bungeecord', 'serverlistplus'])}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Expand All
                    </Button>
                    <Button
                      onClick={() => setExportExpanded([])}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Collapse All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help & Tips */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 backdrop-blur-sm bg-background/95">
                <CardHeader>
                  <CardTitle>💡 Quick Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex gap-3">
                      <Badge className="h-fit">§</Badge>
                      <p className="text-sm">
                        The section sign (§) is used before all color and format codes
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="h-fit">📏</Badge>
                      <p className="text-sm">
                        Keep each line under 60 characters for best display
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="h-fit">🎨</Badge>
                      <p className="text-sm">
                        Colors persist until reset with §r or another color
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="h-fit">✨</Badge>
                      <p className="text-sm">
                        Combine formats: §a§lBold Green or §c§o§nItalic Underlined Red
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TooltipProvider>
      </div>
    </main>
  );
}

export default function MotdEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    }>
      <MotdEditorContent />
    </Suspense>
  );
}
