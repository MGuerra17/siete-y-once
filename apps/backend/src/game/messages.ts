import { z } from "zod";
import {
  DISPLAY_NAME_MAX_LENGTH,
  SHORT_CODE_LENGTH,
  type ClientMessage,
} from "@seven/protocol";

const displayName = z
  .string()
  .trim()
  .min(1)
  .transform((name) => name.slice(0, DISPLAY_NAME_MAX_LENGTH));

const clientMessageSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("ping") }),
  z.object({ action: z.literal("createGame"), payload: z.object({ displayName }) }),
  z.object({
    action: z.literal("joinGame"),
    payload: z.object({
      displayName,
      shortCode: z.string().trim().toUpperCase().length(SHORT_CODE_LENGTH),
    }),
  }),
  z.object({
    action: z.literal("rejoinGame"),
    payload: z.object({ gameId: z.uuid(), rejoinToken: z.string().min(16).max(128) }),
  }),
  z.object({ action: z.literal("leaveGame") }),
  z.object({ action: z.literal("initialRoll") }),
  z.object({ action: z.literal("placeBet"), payload: z.object({ amount: z.number().int() }) }),
  z.object({
    action: z.literal("keepBet"),
    payload: z.object({ lock: z.boolean().optional() }).optional(),
  }),
  z.object({ action: z.literal("setBetLock"), payload: z.object({ locked: z.boolean() }) }),
  z.object({ action: z.literal("rollDice") }),
  z.object({ action: z.literal("turnTimeout") }),
  z.object({ action: z.literal("claimAbandonment") }),
]) satisfies z.ZodType<ClientMessage>;

/** Parses a raw WebSocket frame. Returns null for malformed JSON or unknown/invalid messages. */
export function parseClientMessage(body: string | undefined): ClientMessage | null {
  if (!body) return null;
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return null;
  }
  const result = clientMessageSchema.safeParse(json);
  return result.success ? result.data : null;
}
