import { SHORT_CODE_CHARS, SHORT_CODE_LENGTH } from "../constants/game.constants";

/**
 * Generates a random short code for sharing (e.g. "K7XN2P").
 * Uses a character set that avoids ambiguous characters (0/O, 1/I/L).
 */
export function generateShortCode(): string {
  let code = "";
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    code += SHORT_CODE_CHARS[Math.floor(Math.random() * SHORT_CODE_CHARS.length)];
  }
  return code;
}

/** Normalizes a user-entered code to uppercase for lookup. */
export function normalizeShortCode(input: string): string {
  return input.trim().toUpperCase();
}
