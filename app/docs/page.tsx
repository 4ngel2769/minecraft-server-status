import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Server, 
  Palette, 
  Code, 
  HelpCircle, 
  Zap, 
  Shield, 
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Clock,
  AlertTriangle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation - Minecraft Server Status",
  description: "Complete guide to using MC Status - check server status, create custom MOTDs, and integrate our API.",
};

export default function DocsPage() {
  const quickLinks = [
    {
      title: "API Documentation",
      description: "Integrate our API into your applications",
      href: "/docs/api",
      icon: Code,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "MOTD Editor Guide",
      description: "Learn how to create custom server MOTDs",
      href: "#motd-editor",
      icon: Palette,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      href: "#faq",
      icon: HelpCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-emerald-400" />
            <h1 className="text-5xl font-bold">Documentation</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Everything you need to know about using MC Status to monitor Minecraft servers, 
            create custom MOTDs, and integrate our services into your applications.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all hover:scale-105 h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${link.bgColor} flex items-center justify-center mb-3`}>
                    <link.icon className={`w-6 h-6 ${link.color}`} />
                  </div>
                  <CardTitle className="text-xl">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Getting Started */}
        <Card className="bg-gray-800/50 border-gray-700" id="getting-started">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="w-6 h-6 text-yellow-400" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-200">Checking Server Status</h3>
              <p className="text-gray-300">
                MC Status makes it easy to monitor any Minecraft server in real-time. Here&apos;s how to get started:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Navigate to the Homepage</h4>
                    <p className="text-sm text-gray-400">
                      Visit the main page and you&apos;ll see the server status checker.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Enter Server Details</h4>
                    <p className="text-sm text-gray-400">
                      Input the server hostname/IP (e.g., &quot;mc.hypixel.net&quot;) and select the server type (Java or Bedrock).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Complete Verification</h4>
                    <p className="text-sm text-gray-400">
                      Complete the Cloudflare Turnstile verification to prevent abuse.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">View Server Status</h4>
                    <p className="text-sm text-gray-400">
                      Get real-time information including player count, version, MOTD, server icon, and response time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-300">Shareable URLs</p>
                  <p className="text-sm text-gray-300">
                    Each server check generates a unique URL (e.g., <code className="bg-gray-900 px-1 py-0.5 rounded">/server/mc-hypixel-net</code>) 
                    that you can bookmark or share with others.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MOTD Editor */}
        <Card className="bg-gray-800/50 border-gray-700" id="motd-editor">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Palette className="w-6 h-6 text-pink-400" />
              MOTD Editor Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              The MOTD (Message of the Day) editor allows you to create custom server messages with colors, 
              formatting, and special characters. Perfect for server owners who want to make their server stand out.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-200">Features</h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Color Picker</h4>
                    <p className="text-sm text-gray-400">
                      Choose from all 16 Minecraft colors including RGB/Hex colors (1.16+)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Text Formatting</h4>
                    <p className="text-sm text-gray-400">
                      Apply bold, italic, underline, strikethrough, and obfuscated effects
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Live Preview</h4>
                    <p className="text-sm text-gray-400">
                      See exactly how your MOTD will look in-game with authentic Minecraft font
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Pre-made Templates</h4>
                    <p className="text-sm text-gray-400">
                      Start with popular templates and customize them to your liking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Export Options</h4>
                    <p className="text-sm text-gray-400">
                      Copy as formatted JSON or plain code for server.properties
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200">Special Characters</h4>
                    <p className="text-sm text-gray-400">
                      Insert Unicode characters, symbols, and Minecraft-specific icons
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-200">How to Use</h3>
              <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Navigate to the <Link href="/motd-editor" className="text-emerald-400 hover:underline">MOTD Editor</Link></li>
                <li>Type your message in the text editor (supports up to 2 lines)</li>
                <li>Select text and apply colors/formatting using the toolbar</li>
                <li>Preview your MOTD in real-time</li>
                <li>Copy the generated code and paste it into your <code className="bg-gray-900 px-1 py-0.5 rounded">server.properties</code> file</li>
                <li>Restart your Minecraft server to apply changes</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-yellow-300">Server Version Compatibility</p>
                  <p className="text-sm text-gray-300">
                    RGB/Hex colors require Minecraft 1.16+. Legacy color codes (§) work on all versions. 
                    Make sure your server version supports the features you use.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-gray-800/50 border-gray-700" id="faq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <HelpCircle className="w-6 h-6 text-blue-400" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Why is there a 40-second cooldown between checks?
                </h3>
                <p className="text-gray-300">
                  The cooldown prevents abuse and reduces server load. Server status doesn&apos;t change frequently, 
                  so checking every 40 seconds provides up-to-date information while being respectful to Minecraft servers.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Can I check Bedrock Edition servers?
                </h3>
                <p className="text-gray-300">
                  Yes! Our checker supports both Java Edition and Bedrock Edition servers. 
                  Simply select &quot;Bedrock&quot; from the server type dropdown when checking status.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Why do I need to complete Turnstile verification?
                </h3>
                <p className="text-gray-300">
                  Cloudflare Turnstile helps us prevent automated abuse and bot attacks. 
                  It&apos;s a privacy-friendly alternative to traditional CAPTCHAs and only takes a second to complete.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  What does &quot;Server is offline or unreachable&quot; mean?
                </h3>
                <p className="text-gray-300">
                  This error can occur for several reasons:
                </p>
                <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                  <li>The server is actually offline or not running</li>
                  <li>The hostname/IP address is incorrect</li>
                  <li>The port number is wrong (default: 25565 for Java, 19132 for Bedrock)</li>
                  <li>Firewall or network issues preventing connection</li>
                  <li>The server has query disabled in server.properties</li>
                </ul>
              </div>

              {/* FAQ Item 5 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  How accurate is the player count?
                </h3>
                <p className="text-gray-300">
                  The player count is as accurate as the server reports it. Most servers report accurate numbers, 
                  but some may have modified their query response to show fake player counts.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Can I use this to monitor multiple servers?
                </h3>
                <p className="text-gray-300">
                  Yes! You can bookmark or save the URL for each server you check. Each server gets a unique URL 
                  that you can return to at any time. We&apos;re also working on a favorites feature for easier access.
                </p>
              </div>

              {/* FAQ Item 7 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Is there an API I can use?
                </h3>
                <p className="text-gray-300">
                  Yes! Check out our <Link href="/docs/api" className="text-emerald-400 hover:underline">API Documentation</Link> for 
                  details on integrating server status checks into your own applications.
                </p>
              </div>

              {/* FAQ Item 8 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  My MOTD colors don&apos;t show up in-game. Why?
                </h3>
                <p className="text-gray-300">
                  Make sure you&apos;re copying the code correctly into your <code className="bg-gray-900 px-1 py-0.5 rounded">server.properties</code> file. 
                  The MOTD should be on a single line. Also, check that your server version supports the color codes you&apos;re using 
                  (RGB/Hex requires 1.16+).
                </p>
              </div>

              {/* FAQ Item 9 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  Is this service free?
                </h3>
                <p className="text-gray-300">
                  Yes, completely free! This is an open-source project. You can even self-host it if you want. 
                  Check out our <a href="https://github.com/4ngel2769/minecraft-server-status" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">GitHub repository</a> for more information.
                </p>
              </div>

              {/* FAQ Item 10 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  How can I report bugs or request features?
                </h3>
                <p className="text-gray-300">
                  We welcome feedback! Please open an issue on our{' '}
                  <a href="https://github.com/4ngel2769/minecraft-server-status/issues" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">GitHub Issues page</a>. 
                  Include as much detail as possible to help us understand and address your concern.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-gray-800/50 border-gray-700" id="troubleshooting">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="w-6 h-6 text-orange-400" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-200">Common Issues</h3>
                
                {/* Issue 1 */}
                <div className="p-4 bg-gray-900/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-gray-200">Slow Response Times</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    If server checks are taking a long time, it could be due to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-400 ml-4 space-y-1">
                    <li>High latency to the target server (check from closer location)</li>
                    <li>Server is under heavy load</li>
                    <li>Network congestion or routing issues</li>
                    <li>Server firewall slowing down query responses</li>
                  </ul>
                </div>

                {/* Issue 2 */}
                <div className="p-4 bg-gray-900/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="font-semibold text-gray-200">Rate Limit Errors</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    If you&apos;re seeing rate limit errors:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-400 ml-4 space-y-1">
                    <li>Wait for the cooldown period to expire (shown in error message)</li>
                    <li>Don&apos;t spam the check button</li>
                    <li>Consider using our API with proper caching if you need frequent checks</li>
                  </ul>
                </div>

                {/* Issue 3 */}
                <div className="p-4 bg-gray-900/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-gray-200">Turnstile Verification Fails</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    If verification keeps failing:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-400 ml-4 space-y-1">
                    <li>Make sure JavaScript is enabled in your browser</li>
                    <li>Try a different browser or clear cache/cookies</li>
                    <li>Disable VPN or proxy temporarily</li>
                    <li>Check if your firewall is blocking Cloudflare services</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6 text-emerald-400" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="https://github.com/4ngel2769/minecraft-server-status/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">GitHub Issues</h4>
                    <p className="text-sm text-gray-400">Report bugs or request features</p>
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/4ngel2769/minecraft-server-status"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">GitHub Repository</h4>
                    <p className="text-sm text-gray-400">View source code and contribute</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
