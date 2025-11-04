import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Ban, AlertCircle, Shield, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Minecraft Server Status",
  description: "Terms and conditions for using our Minecraft server status checker service.",
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Scale className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: November 4, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to Minecraft Server Status. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Minecraft Server Status provides the following services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Check the status of Minecraft servers (Java & Bedrock Edition)</li>
              <li>View server information (players, version, MOTD, latency)</li>
              <li>Create and export custom MOTDs</li>
              <li>Save favorite servers for quick access</li>
              <li>Receive notifications about server status changes</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>User Accounts (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you create an account with us:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You are responsible for all activities under your account</li>
              <li>You must immediately notify us of any unauthorized access</li>
              <li>You must be at least 13 years old to create an account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Acceptable Use Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Abuse the Service:</strong> Excessive requests, DDoS attacks, or attempting to bypass rate limits</li>
              <li><strong>Violate Laws:</strong> Use the service for any illegal purpose</li>
              <li><strong>Harm Others:</strong> Harass, abuse, or harm other users</li>
              <li><strong>Spam:</strong> Send unsolicited messages or engage in spamming</li>
              <li><strong>Reverse Engineer:</strong> Attempt to decompile or reverse engineer any part of the service</li>
              <li><strong>Automated Access:</strong> Use bots or scrapers without permission</li>
              <li><strong>Interfere:</strong> Disrupt or interfere with service security or operation</li>
              <li><strong>Impersonate:</strong> Pretend to be someone else or misrepresent affiliation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Rate Limits and Fair Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">To ensure fair usage for all users, we implement rate limits:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Server Checks:</strong> Limited to one request per server every 40 seconds</li>
              <li><strong>Captcha Verification:</strong> Required after rate limit is reached</li>
              <li><strong>API Access:</strong> Public API has its own rate limits (see API documentation)</li>
              <li><strong>Automated Tools:</strong> Require prior approval for high-volume usage</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Violation of rate limits may result in temporary or permanent suspension of access.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Our Property</h3>
                <p>
                  The service and its original content, features, and functionality are owned by Minecraft Server Status and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p>
                  Any MOTD designs, server lists, or other content you create remain your property. By using our service, you grant us a limited license to display and process your content for the purpose of providing the service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Minecraft</h3>
                <p className="text-sm text-muted-foreground">
                  Minecraft is a trademark of Mojang AB. This service is not affiliated with or endorsed by Mojang AB or Microsoft Corporation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle>Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service "As Is"</h3>
                <p>
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Accuracy of server information</li>
                  <li>Service availability or uptime</li>
                  <li>Compatibility with all devices</li>
                  <li>Freedom from errors or interruptions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Third-Party Servers</h3>
                <p>
                  We are not responsible for the content, policies, or practices of third-party Minecraft servers. You access them at your own risk.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p>
                  In no event shall Minecraft Server Status be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data and Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your use of the service is also governed by our{" "}
              <a href="/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </a>
              . By using the service, you consent to our data practices as described in the Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We may terminate or suspend your access immediately, without prior notice or liability, for any reason, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Abusive or fraudulent behavior</li>
              <li>At our sole discretion</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the service will immediately cease. Data associated with your account may be deleted.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice before any new terms take effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mt-4">
              By continuing to access or use our service after revisions become effective, you agree to be bound by the revised terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
            <p className="mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> legal@mcserverstatus.com</li>
              <li><strong>GitHub:</strong> Open an issue on our repository</li>
            </ul>
          </CardContent>
        </Card>

        {/* Severability */}
        <Card>
          <CardHeader>
            <CardTitle>Severability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will continue in full force and effect.
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>
            By using Minecraft Server Status, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <p className="mt-2">
            Effective Date: November 4, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
