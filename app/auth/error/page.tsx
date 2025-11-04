'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Server } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL.';
      case 'OAuthCallback':
        return 'Error in handling the response from the OAuth provider.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider user in the database.';
      case 'EmailCreateAccount':
        return 'Could not create email provider user in the database.';
      case 'Callback':
        return 'Error in the OAuth callback handler route.';
      case 'OAuthAccountNotLinked':
        return 'Email already exists with a different provider.';
      case 'EmailSignin':
        return 'The email address could not be sent.';
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo/Branding */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Server className="w-10 h-10 text-emerald-400 relative z-10" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MC Status
          </span>
        </Link>
      </div>

      {/* Error Card */}
      <Card className="bg-gray-800/50 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-red-400">
            <AlertCircle className="w-6 h-6" />
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-gray-300">{getErrorMessage()}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <Card className="bg-gray-800/50">
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
