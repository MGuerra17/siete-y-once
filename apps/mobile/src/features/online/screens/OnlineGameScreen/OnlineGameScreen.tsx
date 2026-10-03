import React from "react";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { OnlineCodeModal } from "@/src/features/online/components/OnlineCodeModal/OnlineCodeModal";
import { useCopyCode } from "@/src/features/online/hooks/useCopyCode";
import { useOnlineGameScreen } from "@/src/features/online/hooks/useOnlineGameScreen";

export const OnlineGameScreen: React.FC = () => {
  const { screenProps, waitingCode, leave } = useOnlineGameScreen();
  const { copied, copy } = useCopyCode(waitingCode);

  if (!screenProps) return <ScreenContainer />;

  return (
    <>
      <GameScreen {...screenProps} />
      {waitingCode && (
        <OnlineCodeModal visible shortCode={waitingCode} copied={copied} onCopy={copy} onExit={leave} />
      )}
    </>
  );
};
