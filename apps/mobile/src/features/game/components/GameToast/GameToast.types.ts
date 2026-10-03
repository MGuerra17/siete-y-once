export type GameToastProps = {
  message: string | null;
  duration?: number;
  onDismiss?: () => void;
};
