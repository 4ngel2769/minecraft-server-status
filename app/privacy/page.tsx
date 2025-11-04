import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Mail, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Minecraft Server Status",
  description: "Learn how we collect, use, and protect your data when using our Minecraft server status checker.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: November 4, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to Minecraft Server Status ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
            <p>
              By using our service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>IP Address:</strong> Used for rate limiting and security purposes</li>
                <li><strong>Browser Type & Version:</strong> To ensure compatibility</li>
                <li><strong>Server Queries:</strong> The Minecraft servers you check</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, and features used</li>
                <li><strong>Device Information:</strong> Device type, operating system</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Voluntarily Provided Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Server Addresses:</strong> Minecraft servers you want to check</li>
                <li><strong>MOTD Designs:</strong> Custom MOTDs you create (stored locally in your browser)</li>
                <li><strong>Favorite Servers:</strong> Servers you save (if using this feature)</li>
                <li><strong>Email Address:</strong> If you opt-in for notifications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Cookies and Tracking</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for rate limiting and security</li>
                <li><strong>Preference Cookies:</strong> Remember your theme and settings</li>
                <li><strong>Analytics:</strong> We may use analytics to improve our service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Provision:</strong> To check Minecraft server status and display results</li>
              <li><strong>Rate Limiting:</strong> To prevent abuse and ensure fair usage</li>
              <li><strong>Security:</strong> To protect against spam, fraud, and malicious activity</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and improve our service</li>
              <li><strong>Notifications:</strong> To send alerts about server status (if opted-in)</li>
              <li><strong>Communication:</strong> To respond to your inquiries and support requests</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Data Sharing and Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We do not sell your personal data. We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cloudflare Turnstile:</strong> For captcha verification and bot protection</li>
              <li><strong>MongoDB Atlas:</strong> For storing user data and favorites (encrypted)</li>
              <li><strong>Analytics Providers:</strong> Google Analytics or similar (anonymized data)</li>
              <li><strong>Email Service:</strong> For sending notifications (if opted-in)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We implement security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Rate limiting and DDoS protection via Cloudflare</li>
              <li>Secure database connections with encryption</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You have the following rights regarding your data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from notifications</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Cookie Control:</strong> Manage cookies through browser settings</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our service does not knowingly collect information from children under 13 years of age. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> privacy@mcserverstatus.com</li>
              <li><strong>GitHub:</strong> Open an issue on our repository</li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>
            This privacy policy is effective as of November 4, 2025 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
          </p>
        </div>
      </div>
    </div>
  );
}
