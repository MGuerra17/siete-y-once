import { getOpponentId, type PlayerId } from "@seven/game-core";
import type { PublicGame } from "@seven/protocol";
import { useEffect, useEffectEvent, useState } from "react";
import { secondsLeft } from "@/src/features/game/model/countdown";

/**
 * While the opponent is disconnected, returns the seconds left for them to come back
 * (null otherwise) and calls `onExpired` once their reconnect window closes.
 */
export const useOpponentAway = (
  game: PublicGame | null,
  localPlayerId: PlayerId,
  serverOffsetMs: number,
  onExpired: () => void,
): number | null => {
  const opponent = game?.players[getOpponentId(localPlayerId)];
  const serverDeadline =
    game?.status === "IN_PROGRESS" && opponent && !opponent.connected
      ? opponent.reconnectDeadline
      : null;
  const deadline = serverDeadline === null ? null : serverDeadline - serverOffsetMs;
  const [now, setNow] = useState(() => Date.now());
  const expire = useEffectEvent(onExpired);

  useEffect(() => {
    if (deadline === null) return;
    const interval = setInterval(() => setNow(Date.now()), 1_000);
    const timeout = setTimeout(() => expire(), Math.max(0, deadline - Date.now()));
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [deadline]);

  return deadline === null ? null : secondsLeft(deadline, now);
};
