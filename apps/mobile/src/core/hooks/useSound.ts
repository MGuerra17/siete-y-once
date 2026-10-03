import { useContext } from "react";
import { SoundContext } from "@/src/core/context/SoundContext";

/** Provides the global `soundEnabled` flag and its setter. Must be inside a `SoundProvider`. */
export const useSound = () => {
  const ctx = useContext(SoundContext);

  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return ctx;
};
