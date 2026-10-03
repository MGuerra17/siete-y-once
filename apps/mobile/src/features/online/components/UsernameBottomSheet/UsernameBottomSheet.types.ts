export type UsernameBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialValue?: string;
};
