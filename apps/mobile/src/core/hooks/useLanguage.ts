import { useContext } from "react";
import { LanguageContext } from "@/src/core/context/LanguageContext";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return ctx;
};

