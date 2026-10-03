export type DiceSumDisplayProps = {
  label: string;
  value?: number | null;
  /** When true, value is shown above the label. */
  invertOrder?: boolean;
  /** When false, the component is not rendered. Defaults to true. */
  visible?: boolean;
};
