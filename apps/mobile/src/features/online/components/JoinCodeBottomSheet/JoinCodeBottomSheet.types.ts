export type JoinCodeBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  loading?: boolean;
  errorMessage?: string | null;
};
