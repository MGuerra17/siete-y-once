import { useContext } from "react";
import { LanguageContext } from "@/src/core/context/LanguageContext";

/** Provides the current language, setter, and `t()` translation helper. Must be inside a `LanguageProvider`. */
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return ctx;
};

