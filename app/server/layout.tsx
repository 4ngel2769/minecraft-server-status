import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Status | Minecraft Server Checker',
  description: 'View detailed status information for your Minecraft server including player count, version, MOTD, ping, and more.',
  openGraph: {
    title: 'Minecraft Server Status',
    description: 'Detailed server information and statistics',
    type: 'website',
  },
};

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
