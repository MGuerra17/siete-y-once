import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import { SHORT_CODE_ALPHABET, SHORT_CODE_LENGTH } from "@seven/protocol";
import type { Ids, Random } from "../game/ports";

export const cryptoIds: Ids = {
  gameId: () => randomUUID(),
  rejoinToken: () => randomBytes(24).toString("base64url"),
  shortCode: () =>
    Array.from(
      { length: SHORT_CODE_LENGTH },
      () => SHORT_CODE_ALPHABET[randomInt(SHORT_CODE_ALPHABET.length)],
    ).join(""),
  hash: (value) => createHash("sha256").update(value).digest("hex"),
};

/** Dice randomness from the OS CSPRNG so rolls cannot be predicted from previous ones. */
export const cryptoRandom: Random = {
  next: () => randomInt(2 ** 47) / 2 ** 47,
};
