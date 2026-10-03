import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";

const COPIED_FEEDBACK_MS = 2_000;

/** Copies `code` to the clipboard and reports success for a short while. */
export const useCopyCode = (code: string | null) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = useCallback(async () => {
    if (!code) return;
    try {
      await Clipboard.setStringAsync(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return { copied, copy };
};
