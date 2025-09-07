import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MOTD Editor | Minecraft Server Status',
  description: 'Create beautiful custom MOTDs for your Minecraft server with our powerful editor. Features color codes, gradients, formatting, templates, and export to multiple server formats.',
  keywords: [
    'minecraft motd',
    'motd editor',
    'minecraft message of the day',
    'server motd',
    'motd creator',
    'minecraft server customization',
    'color codes',
    'motd templates',
  ],
  openGraph: {
    title: 'Minecraft MOTD Editor - Create Custom Server Messages',
    description: 'Professional MOTD creator with templates, gradients, and export options',
    type: 'website',
  },
};

export default function MOTDEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
