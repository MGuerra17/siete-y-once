import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  ReactNode,
} from "react";

type SoundContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

export const SoundContext = createContext<SoundContextValue | undefined>(
  undefined,
);

type SoundProviderProps = {
  children: ReactNode;
};

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState(true);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
  }, []);

  const value = useMemo(
    () => ({
      soundEnabled,
      setSoundEnabled,
    }),
    [soundEnabled, setSoundEnabled],
  );

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
