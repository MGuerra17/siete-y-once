export type AvatarProps = {
  /** Name whose first letter is shown. */
  name: string;
  background: string;
  foreground: string;
  size?: number;
  /** Highlight ring for the player who must act. */
  isActive?: boolean;
  ringColor?: string;
  /** 0 = full ring, 1 = ring gone. When set, the ring becomes a turn countdown. */
  countdownProgress?: number | null;
};
