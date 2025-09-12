import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, Clock, Shield, AlertTriangle, CheckCircle2, Key, BookOpen } from "lucide-react";
import { GradientBackground } from "@/components/animate-ui/components/backgrounds/gradient";
import { auth } from "@/lib/config";

export const metadata: Metadata = {
  title: "API Documentation - Minecraft Server Status",
  description: "Public API documentation for developers. Learn how to integrate our Minecraft server status checker into your applications.",
};

const APP_URL = auth.appUrl;

export default function APIDocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-8 py-12 px-4">{/* Header */}
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Code className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold">API Documentation</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Integrate Minecraft server status checking into your applications with our public API.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Our API allows you to fetch real-time status information for any Minecraft server. 
              No API key required for basic usage, but rate limits apply.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Base URL</span>
              </div>
              <code className="text-sm text-gray-300">
                {APP_URL}/api/server
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GET /api/server */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-sm font-semibold">
                  GET
                </span>
                <code className="text-gray-300">/api/server</code>
              </div>
              
              <p className="text-gray-300">
                Fetch the status of a Minecraft server (Java Edition or Bedrock Edition).
              </p>

              {/* Query Parameters */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-200">Query Parameters</h4>
                <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-emerald-400">host</code>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">required</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      The server hostname or IP address (e.g., &quot;mc.hypixel.net&quot;)
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-emerald-400">port</code>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">optional</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      The server port (default: 25565 for Java, 19132 for Bedrock)
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-emerald-400">type</code>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">optional</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Server type: &quot;java&quot; or &quot;bedrock&quot; (default: &quot;java&quot;)
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Request */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-200">Example Request</h4>
                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-300">
{`GET /api/server?host=mc.hypixel.net&type=java

# With cURL
curl "${APP_URL}/api/server?host=mc.hypixel.net&type=java"

# With JavaScript (fetch)
fetch('${APP_URL}/api/server?host=mc.hypixel.net&type=java')
  .then(res => res.json())
  .then(data => console.log(data));

# With Python (requests)
import requests
response = requests.get(
    '${APP_URL}/api/server',
    params={'host': 'mc.hypixel.net', 'type': 'java'}
)
data = response.json()`}
                  </pre>
                </div>
              </div>

              {/* Success Response */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-200">Success Response (200 OK)</h4>
                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-300">
{`{
  "online": true,
  "host": "mc.hypixel.net",
  "port": 25565,
  "players": {
    "online": 45123,
    "max": 200000
  },
  "version": "Requires MC 1.8 / 1.21",
  "motd": {
    "raw": "§aHypixel Network §c[1.8-1.21]",
    "clean": "Hypixel Network [1.8-1.21]",
    "html": "<span style='color:#55ff55'>Hypixel Network</span>..."
  },
  "favicon": "data:image/png;base64,iVBORw0KGgo...",
  "ping": 45,
  "lastUpdated": "2024-01-15T12:34:56.789Z"
}`}
                  </pre>
                </div>
              </div>

              {/* Error Response */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-200">Error Response (Offline Server)</h4>
                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-300">
{`{
  "online": false,
  "host": "offline.server.net",
  "port": 25565,
  "error": "Server is offline or unreachable"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-300">Turnstile Verification Required</p>
                <p className="text-sm text-gray-300">
                  To prevent abuse, all API requests must include a valid Cloudflare Turnstile token. 
                  This is automatically handled when using our website, but external API consumers 
                  must implement Turnstile verification.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-200">Request Headers</h4>
              <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`Content-Type: application/json
X-Turnstile-Token: <your-turnstile-token>`}
                </pre>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Learn more about implementing Cloudflare Turnstile: 
              <a 
                href="https://developers.cloudflare.com/turnstile/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline ml-1"
              >
                Cloudflare Turnstile Docs
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              To ensure fair usage and prevent abuse, the following rate limits are enforced:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-semibold text-emerald-400">Per Server</h4>
                </div>
                <p className="text-2xl font-bold">40 seconds</p>
                <p className="text-sm text-gray-400">
                  Minimum cooldown between requests for the same server
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <h4 className="font-semibold text-yellow-400">Per IP Address</h4>
                </div>
                <p className="text-2xl font-bold">60 req/hour</p>
                <p className="text-sm text-gray-400">
                  Maximum requests per IP address per hour
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-yellow-300">Rate Limit Response</p>
                <p className="text-sm text-gray-300">
                  When rate limited, you&apos;ll receive a <code className="bg-gray-900 px-1 py-0.5 rounded">429 Too Many Requests</code> response 
                  with a <code className="bg-gray-900 px-1 py-0.5 rounded">Retry-After</code> header indicating when you can retry.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-200 mb-2">Example Rate Limit Response</p>
              <pre className="text-sm text-gray-300">
{`HTTP/1.1 429 Too Many Requests
Retry-After: 35

{
  "error": "Rate limit exceeded. Please wait 35 seconds.",
  "retryAfter": 35
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Response Fields */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Response Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-900 p-4 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-300">Field</th>
                      <th className="text-left py-2 text-gray-300">Type</th>
                      <th className="text-left py-2 text-gray-300">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">online</code></td>
                      <td className="py-2 text-gray-400">boolean</td>
                      <td className="py-2 text-gray-300">Whether the server is online</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">host</code></td>
                      <td className="py-2 text-gray-400">string</td>
                      <td className="py-2 text-gray-300">Server hostname or IP</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">port</code></td>
                      <td className="py-2 text-gray-400">number</td>
                      <td className="py-2 text-gray-300">Server port</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">players</code></td>
                      <td className="py-2 text-gray-400">object</td>
                      <td className="py-2 text-gray-300">Player count (online/max)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">version</code></td>
                      <td className="py-2 text-gray-400">string</td>
                      <td className="py-2 text-gray-300">Server version</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">motd</code></td>
                      <td className="py-2 text-gray-400">object</td>
                      <td className="py-2 text-gray-300">MOTD in various formats (raw/clean/html)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">favicon</code></td>
                      <td className="py-2 text-gray-400">string</td>
                      <td className="py-2 text-gray-300">Base64 server icon (if available)</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">ping</code></td>
                      <td className="py-2 text-gray-400">number</td>
                      <td className="py-2 text-gray-300">Response time in milliseconds</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">lastUpdated</code></td>
                      <td className="py-2 text-gray-400">string</td>
                      <td className="py-2 text-gray-300">ISO 8601 timestamp</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-emerald-400">error</code></td>
                      <td className="py-2 text-gray-400">string</td>
                      <td className="py-2 text-gray-300">Error message (if offline)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Error Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-900 p-4 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-300">Code</th>
                      <th className="text-left py-2 text-gray-300">Status</th>
                      <th className="text-left py-2 text-gray-300">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="py-2"><code className="text-red-400">400</code></td>
                      <td className="py-2 text-gray-400">Bad Request</td>
                      <td className="py-2 text-gray-300">Missing or invalid parameters</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-red-400">403</code></td>
                      <td className="py-2 text-gray-400">Forbidden</td>
                      <td className="py-2 text-gray-300">Invalid or missing Turnstile token</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-red-400">429</code></td>
                      <td className="py-2 text-gray-400">Too Many Requests</td>
                      <td className="py-2 text-gray-300">Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-red-400">500</code></td>
                      <td className="py-2 text-gray-400">Internal Server Error</td>
                      <td className="py-2 text-gray-300">Server error occurred</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code className="text-red-400">503</code></td>
                      <td className="py-2 text-gray-400">Service Unavailable</td>
                      <td className="py-2 text-gray-300">API temporarily unavailable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Cache responses</strong> for at least 40 seconds to respect rate limits</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Handle errors gracefully</strong> with proper retry logic and exponential backoff</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Implement Turnstile</strong> correctly to avoid authentication errors</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Monitor rate limits</strong> and respect the Retry-After header</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Use connection pooling</strong> for better performance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Set appropriate timeouts</strong> (recommended: 10-15 seconds)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              If you encounter any issues or have questions about the API, please:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Open an issue on our GitHub repository
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Check the general documentation for more information
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Review our Terms of Service and Privacy Policy
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
