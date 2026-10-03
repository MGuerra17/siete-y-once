export type AvatarProps = {
  imageUri?: string | null;
  isActive?: boolean;
  size?: number;
  fallbackLabel?: string;
  /** 0 = full ring, 1 = ring gone. When set, shows a donut-style countdown ring instead of static border. */
  countdownProgress?: number | null;
};

