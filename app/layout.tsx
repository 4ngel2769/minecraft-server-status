import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const minecraftFont = localFont({
  src: "../MinecraftDefault-Regular.ttf",
  variable: "--font-minecraft",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Minecraft Server Status | Check Any MC Server",
  description: "Check the status, player count, MOTD, and version of any Minecraft server. Create custom MOTDs with our editor and export to multiple formats.",
  keywords: ["minecraft", "server status", "motd editor", "minecraft server checker", "server list"],
  authors: [{ name: "MC Status" }],
  openGraph: {
    title: "Minecraft Server Status Checker",
    description: "Check any Minecraft server status and create custom MOTDs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${minecraftFont.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
