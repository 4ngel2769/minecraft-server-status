/**
 * Tests for MOTD Formatter Library
 * Demonstrates usage of all formatting functions
 */

import {
  parseMinecraftColors,
  convertToFormat,
  generateGradient,
  encodeForURL,
  decodeFromURL,
  centerText,
  getVisibleLength,
  validateMOTD,
  stripFormatting,
  convertSectionSign,
} from '../motd-formatter';

// Test 1: Parse Minecraft Colors
console.log('=== Test 1: parseMinecraftColors ===');
const testText1 = '§6Welcome to §bMy Server§r\n§a§lHave fun playing!';
const html1 = parseMinecraftColors(testText1);
console.log('Input:', testText1);
console.log('HTML Output:', html1);
console.log('');

// Test 2: Parse Hex Colors
console.log('=== Test 2: Parse Hex Colors ===');
const testText2 = '§x§F§F§5§5§5§5Red §x§5§5§F§F§5§5Green';
const html2 = parseMinecraftColors(testText2);
console.log('Input:', testText2);
console.log('HTML Output:', html2);
console.log('');

// Test 3: Convert to Different Formats
console.log('=== Test 3: Convert to Different Formats ===');
const motd = '§6Welcome §x§F§F§5§5§5§5to §bMy Server';
console.log('Original MOTD:', motd);
console.log('Vanilla:', convertToFormat(motd, 'vanilla'));
console.log('Spigot:', convertToFormat(motd, 'spigot'));
console.log('BungeeCord:', convertToFormat(motd, 'bungeecord'));
console.log('ServerListPlus:', convertToFormat(motd, 'serverlistplus'));
console.log('');

// Test 4: Generate Gradient
console.log('=== Test 4: Generate Gradient ===');
const gradientText = 'RAINBOW SERVER';
const gradient = generateGradient(gradientText, '#FF5555', '#5555FF');
console.log('Text:', gradientText);
console.log('Start Color: #FF5555, End Color: #5555FF');
console.log('Gradient Result:', gradient);
console.log('');

// Test 5: URL Encoding/Decoding
console.log('=== Test 5: URL Encoding/Decoding ===');
const originalMOTD = '§6Welcome to §bMy Server§r\n§aHave fun!';
const encoded = encodeForURL(originalMOTD);
const decoded = decodeFromURL(encoded);
console.log('Original:', originalMOTD);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);
console.log('Match:', originalMOTD === decoded);
console.log('');

// Test 6: Center Text
console.log('=== Test 6: Center Text ===');
const shortText = '§6SHORT';
const centered = centerText(shortText, 60);
console.log('Original:', shortText);
console.log('Centered:', `"${centered}"`);
console.log('Visible Length:', getVisibleLength(shortText));
console.log('');

// Test 7: Get Visible Length
console.log('=== Test 7: Get Visible Length ===');
const formattedText = '§a§l§nBold Green Underlined Text';
console.log('Text:', formattedText);
console.log('Visible Length:', getVisibleLength(formattedText));
console.log('Actual Length:', formattedText.length);
console.log('');

// Test 8: Validate MOTD
console.log('=== Test 8: Validate MOTD ===');
const validMOTD = '§6Welcome\n§aEnjoy!';
const invalidMOTD = '§6This is a very long line that exceeds the recommended 60 characters limit for MOTD display\n§aLine 2\n§cLine 3';
console.log('Valid MOTD:', validMOTD);
console.log('Validation:', validateMOTD(validMOTD));
console.log('Invalid MOTD:', invalidMOTD);
console.log('Validation:', validateMOTD(invalidMOTD));
console.log('');

// Test 9: Strip Formatting
console.log('=== Test 9: Strip Formatting ===');
const formattedMOTD = '§6Welcome §x§F§F§5§5§5§5to §b§lMy Server';
const stripped = stripFormatting(formattedMOTD);
console.log('Formatted:', formattedMOTD);
console.log('Stripped:', stripped);
console.log('');

// Test 10: Convert Section Sign
console.log('=== Test 10: Convert Section Sign ===');
const ampersandMOTD = '&6Welcome &bto &l&aMy Server';
const sectionMOTD = convertSectionSign(ampersandMOTD, '§');
const backToAmpersand = convertSectionSign(sectionMOTD, '&');
console.log('Ampersand format:', ampersandMOTD);
console.log('Section format:', sectionMOTD);
console.log('Back to ampersand:', backToAmpersand);
console.log('');

// Test 11: Complex MOTD Example
console.log('=== Test 11: Complex MOTD Example ===');
const line1 = '§6§l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬§r';
const line2 = '    §x§F§F§5§5§5§5M§x§F§F§7§7§5§5Y §x§5§5§F§F§5§5S§x§5§5§F§F§F§FE§x§5§5§5§5§F§FR§x§F§F§5§5§F§FV§x§F§F§5§5§5§5E§x§F§F§F§F§5§5R';
const fullMOTD = `${line1}\n${line2}`;
console.log('Line 1:', line1);
console.log('Line 2:', line2);
console.log('Full MOTD:', fullMOTD);
console.log('Spigot Format:', convertToFormat(fullMOTD, 'spigot'));
console.log('Validation:', validateMOTD(fullMOTD));
