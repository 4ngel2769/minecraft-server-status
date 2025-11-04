import { discord } from '@/lib/config';

export interface DiscordEmbed {
  title: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp?: string;
}

export interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}

/**
 * Check if Discord webhook is configured and enabled
 */
export function isDiscordEnabled(): boolean {
  return discord.enabled;
}

/**
 * Send message to Discord webhook
 */
export async function sendDiscordMessage(message: DiscordMessage): Promise<boolean> {
  if (!discord.enabled) {
    console.log('Discord webhook not configured, skipping Discord notification');
    return false;
  }

  try {
    const response = await fetch(discord.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return false;
    }

    console.log('✅ Discord notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
    return false;
  }
}

/**
 * Send server status alert to Discord
 */
export async function sendServerStatusAlert(
  serverHost: string,
  serverPort: number,
  online: boolean,
  version?: string,
  players?: { online: number; max: number }
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: online ? '✅ Server Online' : '❌ Server Offline',
    description: `**${serverHost}:${serverPort}**`,
    color: online ? 0x00ff00 : 0xff0000, // Green for online, red for offline
    fields: [],
    timestamp: new Date().toISOString(),
  };

  if (online && version) {
    embed.fields?.push({
      name: 'Version',
      value: version,
      inline: true,
    });
  }

  if (online && players) {
    embed.fields?.push({
      name: 'Players',
      value: `${players.online}/${players.max}`,
      inline: true,
    });
  }

  return sendDiscordMessage({
    embeds: [embed],
  });
}

/**
 * Send new user registration alert to Discord
 */
export async function sendNewUserAlert(
  userEmail: string,
  userName?: string
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '🎉 New User Registered',
    color: 0x5865f2, // Discord blurple
    fields: [
      {
        name: 'Email',
        value: userEmail,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  if (userName) {
    embed.fields?.push({
      name: 'Name',
      value: userName,
      inline: true,
    });
  }

  return sendDiscordMessage({
    embeds: [embed],
  });
}

/**
 * Send error alert to Discord
 */
export async function sendErrorAlert(
  errorType: string,
  errorMessage: string,
  details?: Record<string, string>
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '⚠️ Error Alert',
    description: `**${errorType}**\n\`\`\`\n${errorMessage}\n\`\`\``,
    color: 0xffa500, // Orange
    fields: [],
    timestamp: new Date().toISOString(),
  };

  if (details) {
    for (const [key, value] of Object.entries(details)) {
      embed.fields?.push({
        name: key,
        value: value || 'N/A',
        inline: true,
      });
    }
  }

  return sendDiscordMessage({
    embeds: [embed],
  });
}
