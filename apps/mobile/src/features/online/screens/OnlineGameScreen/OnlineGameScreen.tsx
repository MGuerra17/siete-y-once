import React, { useEffect, useState } from "react";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { OnlineCodeModal } from "@/src/features/online/components/OnlineCodeModal/OnlineCodeModal";
import { useOnlineGameScreen } from "@/src/features/online/hooks/useOnlineGameScreen";

export const OnlineGameScreen: React.FC = () => {
  const {
    screenProps,
    isOnline,
    isCreator,
    showCodeModal,
    shortCode,
    handleCopyCode,
    handleGoHome,
  } = useOnlineGameScreen();

  const showOverlay = isOnline && isCreator && showCodeModal && shortCode;

  const [copied, setCopied] = useState(false);

  const handleCopyWithFeedback = async () => {
    await handleCopyCode();
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <>
      <GameScreen {...screenProps} />
      {showOverlay && shortCode && (
        <OnlineCodeModal
          visible
          shortCode={shortCode}
          copied={copied}
          onCopy={handleCopyWithFeedback}
          onExit={handleGoHome}
        />
      )}
    </>
  );
};
