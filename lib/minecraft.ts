// Types and Interfaces
export interface MOTDData {
  raw: string[];
  html: string;
  json?: any;
  clean: string[];
}

export interface PlayerInfo {
  online: number;
  max: number;
  list?: Array<{
    name: string;
    uuid?: string;
  }>;
  sample?: Array<{
    name: string;
    id: string;
  }>;
}

export interface DNSInfo {
  hostname: string;
  ip?: string;
  aRecords?: string[];
  srvRecord?: {
    host: string;
    port: number;
    priority?: number;
    weight?: number;
  };
  error?: string;
}

export interface QueryData {
  hostname?: string;
  gametype?: string;
  game_id?: string;
  version?: string;
  plugins?: string[];
  map?: string;
  players?: PlayerInfo;
  hostip?: string;
  hostport?: number;
}

export interface ServerStatus {
  online: boolean;
  hostname: string;
  ip?: string;
  port: number;
  version?: string;
  protocol?: number;
  players?: PlayerInfo;
  motd?: MOTDData;
  ping?: number;
  query?: QueryData;
  dns?: DNSInfo;
  mojangBlocked?: boolean;
  cacheTime: number;
  icon?: string;
  software?: string;
  eula_blocked?: boolean;
}

// Rate limiting map
const rateLimitMap = new Map<string, number>();

/**
 * Rate limiting function
 */
function checkRateLimit(key: string, limitMs: number = 10000): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(key);
  if (lastRequest && now - lastRequest < limitMs) {
    return false;
  }
  rateLimitMap.set(key, now);
  return true;
}

/**
 * Parse server address into hostname and port
 */
function parseServerAddress(
  address: string,
  defaultPort: number = 25565
): { hostname: string; port: number } {
  const parts = address.trim().split(':');
  const hostname = parts[0];
  const port = parts[1] ? parseInt(parts[1], 10) : defaultPort;
  return { hostname, port };
}

/**
 * Get DNS information for a hostname
 */
export async function getDNSInfo(hostname: string): Promise<DNSInfo> {
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${hostname}`);
    const data = await response.json();
    return {
      hostname,
      ip: data.ip,
      aRecords: data.ip ? [data.ip] : undefined,
      srvRecord: data.srv_record
        ? {
            host: data.srv_record.host,
            port: data.srv_record.port,
          }
        : undefined,
    };
  } catch (error) {
    return {
      hostname,
      error: error instanceof Error ? error.message : 'DNS lookup failed',
    };
  }
}

/**
 * Check if an IP is blocked by Mojang
 */
export async function checkMojangBlocklist(ip: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://sessionserver.mojang.com/blockedservers'
    );
    await response.text();
    return false;
  } catch (error) {
    console.error('Error checking Mojang blocklist:', error);
    return false;
  }
}

/**
 * Check Java Edition Minecraft server status
 */
export async function checkJavaServer(
  hostname: string,
  port: number = 25565
): Promise<ServerStatus> {
  const startTime = Date.now();
  try {
    const response = await fetch(
      `https://api.mcstatus.io/v2/status/java/${hostname}:${port}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const latency = Date.now() - startTime;
    const dns = await getDNSInfo(hostname);
    const mojangBlocked = data.ip_address
      ? await checkMojangBlocklist(data.ip_address)
      : false;
    return {
      online: data.online || false,
      hostname,
      ip: data.ip_address,
      port,
      version: data.version?.name_clean || data.version?.name_raw,
      protocol: data.version?.protocol,
      players: data.players
        ? {
            online: data.players.online || 0,
            max: data.players.max || 0,
            list: data.players.list,
            sample: data.players.sample,
          }
        : undefined,
      motd: data.motd
        ? {
            raw: data.motd.raw || [],
            html: data.motd.html || '',
            clean: data.motd.clean || [],
          }
        : undefined,
      ping: latency,
      icon: data.icon,
      dns,
      mojangBlocked,
      cacheTime: Date.now(),
      eula_blocked: data.eula_blocked,
      software: data.software,
    };
  } catch (error) {
    console.error('Error checking Java server:', error);
    try {
      const fallbackResponse = await fetch(
        `https://api.mcsrvstat.us/3/${hostname}:${port}`
      );
      const fallbackData = await fallbackResponse.json();
      return {
        online: fallbackData.online || false,
        hostname,
        ip: fallbackData.ip,
        port: fallbackData.port || port,
        version: fallbackData.version,
        protocol: fallbackData.protocol,
        players: fallbackData.players
          ? {
              online: fallbackData.players.online || 0,
              max: fallbackData.players.max || 0,
              list: fallbackData.players.list?.map((p: any) => ({
                name: typeof p === 'string' ? p : p.name,
              })),
            }
          : undefined,
        motd: fallbackData.motd
          ? {
              raw: fallbackData.motd.raw || [],
              html: fallbackData.motd.html?.join('<br>') || '',
              clean: fallbackData.motd.clean || [],
            }
          : undefined,
        ping: Date.now() - startTime,
        icon: fallbackData.icon,
        cacheTime: Date.now(),
      };
    } catch (fallbackError) {
      throw new Error(
        'Failed to fetch server status. Server may be offline or unreachable.'
      );
    }
  }
}

/**
 * Check Bedrock Edition Minecraft server status
 */
export async function checkBedrockServer(
  hostname: string,
  port: number = 19132
): Promise<ServerStatus> {
  const startTime = Date.now();
  try {
    const response = await fetch(
      `https://api.mcstatus.io/v2/status/bedrock/${hostname}:${port}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const latency = Date.now() - startTime;
    const dns = await getDNSInfo(hostname);
    return {
      online: data.online || false,
      hostname,
      ip: data.ip_address,
      port,
      version: data.version?.name,
      protocol: data.version?.protocol,
      players: data.players
        ? {
            online: data.players.online || 0,
            max: data.players.max || 0,
          }
        : undefined,
      motd: data.motd
        ? {
            raw: data.motd.raw ? [data.motd.raw] : [],
            html: data.motd.html || '',
            clean: data.motd.clean ? [data.motd.clean] : [],
          }
        : undefined,
      ping: latency,
      dns,
      cacheTime: Date.now(),
      software: data.edition,
      query: data.gamemode
        ? {
            gametype: data.gamemode,
            map: data.map,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error checking Bedrock server:', error);
    throw new Error(
      'Failed to fetch Bedrock server status. Server may be offline or unreachable.'
    );
  }
}

/**
 * Fetches the status of a Minecraft server
 */
export async function getServerStatus(
  address: string,
  isBedrock: boolean = false,
  clientIp?: string
): Promise<ServerStatus> {
  if (clientIp && !checkRateLimit(clientIp)) {
    throw new Error(
      'Rate limit exceeded. Please wait 10 seconds before checking another server.'
    );
  }
  if (!validateServerAddress(address)) {
    throw new Error('Invalid server address format');
  }
  const defaultPort = isBedrock ? 19132 : 25565;
  const { hostname, port } = parseServerAddress(address, defaultPort);
  if (isBedrock) {
    return checkBedrockServer(hostname, port);
  } else {
    return checkJavaServer(hostname, port);
  }
}

/**
 * Validates a Minecraft server address
 */
export function validateServerAddress(address: string): boolean {
  if (!address || address.trim().length === 0) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.[a-zA-Z]{2,})?(:[\d]{1,5})?$|^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?$/;
  return pattern.test(address.trim());
}

/**
 * Format MOTD for display
 */
export function formatMOTD(motd?: MOTDData): string {
  if (!motd) return '';
  return motd.html || motd.clean.join('<br>') || motd.raw.join('<br>');
}

/**
 * Parse Minecraft color codes to HTML
 */
export function parseColorCodes(text: string): string {
  const colorMap: Record<string, string> = {
    '§0': '<span style="color: #000000">',
    '§1': '<span style="color: #0000AA">',
    '§2': '<span style="color: #00AA00">',
    '§3': '<span style="color: #00AAAA">',
    '§4': '<span style="color: #AA0000">',
    '§5': '<span style="color: #AA00AA">',
    '§6': '<span style="color: #FFAA00">',
    '§7': '<span style="color: #AAAAAA">',
    '§8': '<span style="color: #555555">',
    '§9': '<span style="color: #5555FF">',
    '§a': '<span style="color: #55FF55">',
    '§b': '<span style="color: #55FFFF">',
    '§c': '<span style="color: #FF5555">',
    '§d': '<span style="color: #FF55FF">',
    '§e': '<span style="color: #FFFF55">',
    '§f': '<span style="color: #FFFFFF">',
    '§l': '<span style="font-weight: bold">',
    '§m': '<span style="text-decoration: line-through">',
    '§n': '<span style="text-decoration: underline">',
    '§o': '<span style="font-style: italic">',
    '§r': '</span>',
  };
  let html = text;
  for (const [code, tag] of Object.entries(colorMap)) {
    html = html.replace(new RegExp(code, 'g'), tag);
  }
  return html;
}
