export interface ServerStatus {
  online: boolean;
  host?: string;
  port?: number;
  ip?: string;
  version?: string;
  motd?: string;
  ping?: number;
  players?: {
    online: number;
    max: number;
    list?: string[];
  };
  icon?: string;
}

/**
 * Fetches the status of a Minecraft server
 * @param address - Server address (IP:Port or domain)
 * @returns Server status information
 */
export async function getServerStatus(address: string): Promise<ServerStatus> {
  // Will create
  
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${address}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch server status');
    }
    
    const data = await response.json();
    
    return {
      online: data.online || false,
      host: data.hostname,
      port: data.port,
      ip: data.ip,
      version: data.version,
      motd: data.motd?.clean?.join('\n') || data.motd?.raw?.join('\n'),
      ping: data.debug?.ping ? Math.round(data.debug.ping) : undefined,
      players: data.players ? {
        online: data.players.online || 0,
        max: data.players.max || 0,
        list: data.players.list?.map((p: any) => p.name || p) || [],
      } : undefined,
      icon: data.icon,
    };
  } catch (error) {
    console.error('Error fetching server status:', error);
    throw new Error('Failed to fetch server status. Please check the server address and try again.');
  }
}

/**
 * Validates a Minecraft server address
 * @param address - Server address to validate
 * @returns Whether the address is valid
 */
export function validateServerAddress(address: string): boolean {
  if (!address || address.trim().length === 0) {
    return false;
  }
  
  // Basic validation for domain:port or IP:port format
  const pattern = /^[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:[\d]{1,5})?$/;
  return pattern.test(address);
}
