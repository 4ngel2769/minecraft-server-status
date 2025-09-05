/**
 * MOTD Formatter Library
 * Comprehensive utilities for Minecraft server MOTD formatting, parsing, and conversion
 */

// Minecraft color mappings
export const MINECRAFT_COLORS: Record<string, string> = {
  '0': '#000000', // Black
  '1': '#0000AA', // Dark Blue
  '2': '#00AA00', // Dark Green
  '3': '#00AAAA', // Dark Aqua
  '4': '#AA0000', // Dark Red
  '5': '#AA00AA', // Dark Purple
  '6': '#FFAA00', // Gold
  '7': '#AAAAAA', // Gray
  '8': '#555555', // Dark Gray
  '9': '#5555FF', // Blue
  'a': '#55FF55', // Green
  'b': '#55FFFF', // Aqua
  'c': '#FF5555', // Red
  'd': '#FF55FF', // Light Purple
  'e': '#FFFF55', // Yellow
  'f': '#FFFFFF', // White
};

// Format codes
export const FORMAT_CODES: Record<string, string> = {
  'l': 'font-weight: bold',
  'o': 'font-style: italic',
  'n': 'text-decoration: underline',
  'm': 'text-decoration: line-through',
  'k': 'animation: obfuscate 0.1s infinite', // Note: Requires CSS animation
  'r': 'reset',
};

/**
 * Parse Minecraft color codes and convert to HTML with proper styling
 * Supports:
 * - Legacy codes (§ or &)
 * - Hex codes (§x§R§R§G§G§B§B or &#RRGGBB)
 * - Format codes (bold, italic, underline, strikethrough, obfuscated)
 * 
 * @param text - Raw Minecraft-formatted text
 * @returns HTML string with inline styles
 */
export function parseMinecraftColors(text: string): string {
  if (!text) return '';

  let html = '';
  let currentColor = '#FFFFFF';
  let currentStyles: string[] = [];
  let i = 0;

  // Replace & with § for consistent parsing
  text = text.replace(/&([0-9a-fk-orx])/gi, '§$1');

  while (i < text.length) {
    // Check for color/format codes
    if (text[i] === '§' && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();

      // Handle hex colors (§x§R§R§G§G§B§B)
      if (code === 'x' && i + 13 < text.length) {
        const hexParts = text.substring(i + 2, i + 14).split('§').filter(c => c);
        if (hexParts.length === 6) {
          const hexColor = '#' + hexParts.join('');
          if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
            currentColor = hexColor;
            i += 14;
            continue;
          }
        }
      }

      // Handle &#RRGGBB format
      if (code === '#' && i + 7 < text.length) {
        const hexColor = text.substring(i + 1, i + 8);
        if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
          currentColor = hexColor;
          i += 8;
          continue;
        }
      }

      // Handle legacy color codes
      if (MINECRAFT_COLORS[code]) {
        currentColor = MINECRAFT_COLORS[code];
        i += 2;
        continue;
      }

      // Handle format codes
      if (FORMAT_CODES[code]) {
        if (code === 'r') {
          // Reset all formatting
          currentColor = '#FFFFFF';
          currentStyles = [];
        } else {
          // Add format style
          const style = FORMAT_CODES[code];
          if (!currentStyles.includes(style)) {
            currentStyles.push(style);
          }
        }
        i += 2;
        continue;
      }

      // Unknown code, skip it
      i += 2;
      continue;
    }

    // Regular character - wrap in span with current styles
    let char = text[i];
    
    // Build style string
    const styles = [`color: ${currentColor}`, ...currentStyles].join('; ');
    html += `<span style="${styles}">${escapeHtml(char)}</span>`;
    
    i++;
  }

  return html;
}

/**
 * Convert MOTD text to specific server format
 * 
 * @param text - Minecraft-formatted text
 * @param format - Target server format
 * @returns Formatted text for the specified server type
 */
export function convertToFormat(
  text: string,
  format: 'vanilla' | 'spigot' | 'bungeecord' | 'serverlistplus'
): string {
  if (!text) return '';

  let result = '';
  let i = 0;

  // Normalize to § codes
  text = text.replace(/&([0-9a-fk-orx#])/gi, '§$1');

  while (i < text.length) {
    if (text[i] === '§' && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();

      // Handle hex colors (§x§R§R§G§G§B§B or &#RRGGBB)
      if (code === 'x' && i + 13 < text.length) {
        const hexParts = text.substring(i + 2, i + 14).split('§').filter(c => c);
        if (hexParts.length === 6) {
          const hexColor = hexParts.join('').toUpperCase();
          
          switch (format) {
            case 'vanilla':
              // Vanilla doesn't support RGB, convert to closest legacy color
              result += convertHexToLegacy('#' + hexColor);
              break;
            case 'spigot':
              // Spigot: \u00A7x\u00A7R\u00A7R\u00A7G\u00A7G\u00A7B\u00A7B
              result += '\\u00A7x' + hexColor.split('').map(c => `\\u00A7${c}`).join('');
              break;
            case 'bungeecord':
              // BungeeCord: &x&R&R&G&G&B&B
              result += '&x' + hexColor.split('').map(c => `&${c}`).join('');
              break;
            case 'serverlistplus':
              // ServerListPlus: &#RRGGBB
              result += '&#' + hexColor;
              break;
          }
          i += 14;
          continue;
        }
      }

      // Handle &#RRGGBB format
      if (code === '#' && i + 7 < text.length) {
        const hexColor = text.substring(i + 2, i + 8).toUpperCase();
        if (/^[0-9A-F]{6}$/i.test(hexColor)) {
          switch (format) {
            case 'vanilla':
              result += convertHexToLegacy('#' + hexColor);
              break;
            case 'spigot':
              result += '\\u00A7x' + hexColor.split('').map(c => `\\u00A7${c}`).join('');
              break;
            case 'bungeecord':
              result += '&x' + hexColor.split('').map(c => `&${c}`).join('');
              break;
            case 'serverlistplus':
              result += '&#' + hexColor;
              break;
          }
          i += 8;
          continue;
        }
      }

      // Handle legacy color and format codes
      if (MINECRAFT_COLORS[code] || FORMAT_CODES[code]) {
        switch (format) {
          case 'vanilla':
          case 'spigot':
            result += `\\u00A7${code}`;
            break;
          case 'bungeecord':
          case 'serverlistplus':
            result += `&${code}`;
            break;
        }
        i += 2;
        continue;
      }

      // Unknown code, skip it
      i += 2;
      continue;
    }

    // Regular character
    result += text[i];
    i++;
  }

  return result;
}

/**
 * Generate gradient text with color interpolation
 * 
 * @param text - Plain text to apply gradient to
 * @param startColor - Starting hex color (#RRGGBB)
 * @param endColor - Ending hex color (#RRGGBB)
 * @returns Minecraft-formatted text with gradient colors
 */
export function generateGradient(
  text: string,
  startColor: string,
  endColor: string
): string {
  if (!text || text.length === 0) return '';

  // Validate hex colors
  if (!/^#[0-9A-F]{6}$/i.test(startColor) || !/^#[0-9A-F]{6}$/i.test(endColor)) {
    throw new Error('Invalid hex color format. Use #RRGGBB');
  }

  let result = '';
  const textLength = text.length;

  for (let i = 0; i < textLength; i++) {
    const factor = textLength === 1 ? 0 : i / (textLength - 1);
    const color = interpolateColor(startColor, endColor, factor);
    const minecraftColor = convertHexToMinecraftFormat(color);
    result += minecraftColor + text[i];
  }

  return result;
}

/**
 * Encode MOTD text for URL sharing
 * 
 * @param text - Minecraft-formatted MOTD text
 * @returns URL-encoded string
 */
export function encodeForURL(text: string): string {
  return encodeURIComponent(text);
}

/**
 * Decode MOTD text from URL parameter
 * Handles both current and legacy URL formats
 * 
 * @param encoded - URL-encoded MOTD text
 * @returns Decoded Minecraft-formatted text
 */
export function decodeFromURL(encoded: string): string {
  try {
    // Try standard decoding first
    let decoded = decodeURIComponent(encoded);
    
    // Handle legacy formats that might use different encoding
    // Replace common URL-encoded section signs
    decoded = decoded.replace(/%C2%A7/g, '§');
    decoded = decoded.replace(/%26/g, '&');
    
    return decoded;
  } catch (error) {
    console.error('Failed to decode URL parameter:', error);
    return '';
  }
}

/**
 * Center text by adding appropriate spacing
 * Preserves formatting codes when calculating spacing
 * 
 * @param text - Minecraft-formatted text
 * @param lineLength - Target line length (default: 60)
 * @returns Centered text with spacing
 */
export function centerText(text: string, lineLength: number = 60): string {
  if (!text) return '';

  // Calculate visible character count (excluding format codes)
  const visibleLength = getVisibleLength(text);

  // Calculate padding needed
  const padding = Math.max(0, Math.floor((lineLength - visibleLength) / 2));

  // Add spaces at the beginning
  return ' '.repeat(padding) + text;
}

/**
 * Get the visible length of text (excluding format codes)
 * 
 * @param text - Minecraft-formatted text
 * @returns Number of visible characters
 */
export function getVisibleLength(text: string): number {
  // Remove all format codes to get visible length
  let cleaned = text.replace(/§[0-9a-fk-orx]/gi, '');
  
  // Handle hex codes (§x§R§R§G§G§B§B)
  cleaned = cleaned.replace(/§x(§[0-9a-f]){6}/gi, '');
  
  // Handle &#RRGGBB format
  cleaned = cleaned.replace(/§#[0-9a-f]{6}/gi, '');
  cleaned = cleaned.replace(/&#[0-9a-f]{6}/gi, '');
  
  return cleaned.length;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert hex color to Minecraft hex format (§x§R§R§G§G§B§B)
 */
function convertHexToMinecraftFormat(hex: string): string {
  const cleaned = hex.replace('#', '').toUpperCase();
  return '§x' + cleaned.split('').map(c => `§${c}`).join('');
}

/**
 * Convert hex color to closest legacy Minecraft color
 */
function convertHexToLegacy(hex: string): string {
  const closest = Object.entries(MINECRAFT_COLORS).reduce((prev, [code, color]) => {
    const prevDist = colorDistance(hex, prev[1]);
    const currDist = colorDistance(hex, color);
    return currDist < prevDist ? [code, color] : prev;
  });
  return `§${closest[0]}`;
}

/**
 * Calculate color distance using RGB components
 */
function colorDistance(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

// ============================================================================
// Additional Utility Functions
// ============================================================================

/**
 * Strip all formatting codes from text
 * 
 * @param text - Minecraft-formatted text
 * @returns Plain text without formatting
 */
export function stripFormatting(text: string): string {
  let result = text;
  
  // Remove legacy codes
  result = result.replace(/[§&][0-9a-fk-or]/gi, '');
  
  // Remove hex codes (§x§R§R§G§G§B§B)
  result = result.replace(/[§&]x([§&][0-9a-f]){6}/gi, '');
  
  // Remove &#RRGGBB format
  result = result.replace(/[§&]#[0-9a-f]{6}/gi, '');
  
  return result;
}

/**
 * Validate MOTD text format
 * 
 * @param text - Text to validate
 * @returns Object with validation result and any errors
 */
export function validateMOTD(text: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check line count
  const lines = text.split('\n');
  if (lines.length > 2) {
    errors.push('MOTD should have a maximum of 2 lines');
  }

  // Check line lengths
  lines.forEach((line, index) => {
    const visibleLength = getVisibleLength(line);
    if (visibleLength > 60) {
      errors.push(`Line ${index + 1} exceeds recommended 60 characters (${visibleLength} chars)`);
    }
  });

  // Check for unclosed format codes (basic validation)
  const formatCodeCount = (text.match(/[§&][0-9a-fk-or]/gi) || []).length;
  if (formatCodeCount > 100) {
    errors.push('Excessive format codes detected (may cause rendering issues)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert between different section sign formats
 * 
 * @param text - Text with format codes
 * @param toFormat - Target format ('§' or '&')
 * @returns Text with converted format codes
 */
export function convertSectionSign(text: string, toFormat: '§' | '&'): string {
  const fromFormat = toFormat === '§' ? '&' : '§';
  const regex = new RegExp(`${fromFormat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
  return text.replace(regex, toFormat);
}
