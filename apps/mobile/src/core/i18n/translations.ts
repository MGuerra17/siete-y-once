export type Language = "en" | "es";

type TranslationKeys =
  | "home.languageEnglish"
  | "home.languageSpanish"
  | "home.configTitle"
  | "home.languageLabel"
  | "home.soundLabel"
  | "home.soundOn"
  | "home.soundOff"
  | "home.modeOnline"
  | "home.modeOffline"
  | "home.modeOfflineDescription"
  | "home.modeOnlineDescription"
  | "game.player1DefaultName"
  | "game.player2DefaultName"
  | "game.betRoleLabel"
  | "game.rollRoleLabel"
  | "game.pointLabel"
  | "game.betSheet.title"
  | "game.betSheet.currentBetLabel"
  | "game.betSheet.newTotalBetLabel"
  | "game.betSheet.firstBetCta"
  | "game.betSheet.keepCta"
  | "game.betSheet.increaseCta"
  | "game.endModal.title"
  | "game.endModal.titleLoserOnline"
  | "game.endModal.subtitle"
  | "game.endModal.subtitleLoserOnline"
  | "game.endModal.roundsLabel"
  | "game.endModal.goHomeCta"
  | "game.endModal.shareCta"
  | "game.endModal.shareMessage"
  | "game.endModal.winnerLabel"
  | "game.endModal.loserLabel"
  | "game.toast.rollToDetermineShooter"
  | "game.toast.playerRolled"
  | "game.toast.tie"
  | "game.toast.shooterDetermined"
  | "game.toast.placeBet"
  | "game.toast.shooterRoll"
  | "game.toast.shooterWinsNatural"
  | "game.toast.bettorWinsCraps"
  | "game.toast.pointSet"
  | "game.toast.shooterWinsPoint"
  | "game.toast.bettorWinsSeven"
  | "game.toast.continueRolling"
  | "game.exitModal.title"
  | "game.exitModal.message"
  | "game.exitModal.cancelCta"
  | "game.exitModal.exitCta"
  | "game.a11y.exitButton"
  | "game.a11y.rollDice"
  | "game.a11y.keepBetToggle"
  | "game.toast.opponentReconnected"
  | "game.toast.gameOverAbandonment"
  | "online.lobby.heroTitle"
  | "online.lobby.heroSubtitle"
  | "online.lobby.createGame"
  | "online.lobby.codePlaceholder"
  | "online.lobby.join"
  | "online.lobby.joinCodeModal.title"
  | "online.lobby.betPerGame"
  | "online.lobby.haveCodeQuestion"
  | "online.lobby.joinCta"
  | "online.lobby.pasteCode"
  | "online.lobby.playerCount"
  | "online.waiting.gameCodeTitle"
  | "online.waiting.copyCodeCta"
  | "online.waiting.codeCopied"
  | "online.waiting.cancel"
  | "online.waiting.exitCta"
  | "online.waiting.shareCta"
  | "online.waiting.shareCodeMessage"
  | "online.username.title"
  | "online.username.placeholder"
  | "online.username.continue"
  | "online.error.connectionFailed"
  | "online.error.invalidCode"
  | "online.error.gameFull"
  | "game.banner.reconnecting"
  | "game.banner.opponentDisconnected"
  | "game.toast.opponentLeft"
  | "online.error.generic"
  | "online.error.notYourTurn"
  | "online.error.invalidBet"
  | "online.error.rejoinFailed";

type TranslationRecord = Record<Language, Record<TranslationKeys, string>>;

export const translations: TranslationRecord = {
  en: {
    "home.languageEnglish": "English",
    "home.languageSpanish": "Spanish",
    "home.configTitle": "Settings",
    "home.languageLabel": "Language",
    "home.soundLabel": "Sound",
    "home.soundOn": "On",
    "home.soundOff": "Off",
    "home.modeOnline": "Online",
    "home.modeOffline": "Offline",
    "home.modeOfflineDescription": "Play with friends on the same device",
    "home.modeOnlineDescription": "Challenge players worldwide",
    "game.player1DefaultName": "Player 1",
    "game.player2DefaultName": "Player 2",
    "game.betRoleLabel": "Bet",
    "game.rollRoleLabel": "Roll",
    "game.pointLabel": "Point",
    "game.betSheet.title": "It's time for bet",
    "game.betSheet.currentBetLabel": "Current bet",
    "game.betSheet.newTotalBetLabel": "New bet",
    "game.betSheet.firstBetCta": "Bet",
    "game.betSheet.keepCta": "Keep",
    "game.betSheet.increaseCta": "Increase",
    "game.endModal.title": "Game over",
    "game.endModal.titleLoserOnline": "You lost",
    "game.endModal.subtitle": "Congrats!",
    "game.endModal.subtitleLoserOnline": "Better luck next time!",
    "game.endModal.roundsLabel": "Rounds played",
    "game.endModal.goHomeCta": "Finish",
    "game.endModal.shareCta": "Share",
    "game.endModal.shareMessage":
      "{winner} won against {loser} in {totalRounds} rounds! Play Siete y Once with me!",
    "game.endModal.winnerLabel": "Winner",
    "game.endModal.loserLabel": "Loser",
    "game.toast.rollToDetermineShooter": "Roll to determine the Shooter!",
    "game.toast.playerRolled": "{name} rolled {sum}! {next}'s turn.",
    "game.toast.tie": "It's a tie! Roll again.",
    "game.toast.shooterDetermined": "{name} is the Shooter!",
    "game.toast.placeBet": "{name}, place your bet!",
    "game.toast.shooterRoll": "{name}, roll the dice!",
    "game.toast.shooterWinsNatural": "7 or 11! {name} wins!",
    "game.toast.bettorWinsCraps": "Craps! {name} wins!",
    "game.toast.pointSet": "Point is {point}! Roll to match it.",
    "game.toast.shooterWinsPoint": "Point matched! {name} wins!",
    "game.toast.bettorWinsSeven": "Seven out! {name} wins!",
    "game.toast.continueRolling": "Rolled {sum}. Keep rolling!",
    "game.exitModal.title": "Exit game?",
    "game.exitModal.message": "Your progress will be lost.",
    "game.exitModal.cancelCta": "Cancel",
    "game.exitModal.exitCta": "Exit",
    "game.a11y.exitButton": "Exit game",
    "game.a11y.rollDice": "Roll dice",
    "game.a11y.keepBetToggle": "Keep bet locked",
    "game.toast.opponentReconnected": "Opponent reconnected",
    "game.toast.gameOverAbandonment": "You win! Opponent abandoned the game.",
    "online.lobby.heroTitle": "Play with friends",
    "online.lobby.heroSubtitle": "Create a game or join with a code",
    "online.lobby.createGame": "Create Game",
    "online.lobby.codePlaceholder": "ABCDEF",
    "online.lobby.join": "Join",
    "online.lobby.joinCodeModal.title": "Enter room code",
    "online.lobby.betPerGame": "Total money",
    "online.lobby.haveCodeQuestion": "Do you have a game code?",
    "online.lobby.joinCta": "Join",
    "online.lobby.pasteCode": "Paste",
    "online.lobby.playerCount": "Players",
    "online.waiting.gameCodeTitle": "Game code",
    "online.waiting.copyCodeCta": "Copy code",
    "online.waiting.codeCopied": "Code copied!",
    "online.waiting.cancel": "Cancel",
    "online.waiting.exitCta": "Exit",
    "online.waiting.shareCta": "Share",
    "online.waiting.shareCodeMessage": "Join my game with this code: {code}",
    "online.username.title": "Choose your name",
    "online.username.placeholder": "Enter your name",
    "online.username.continue": "Continue",
    "online.error.connectionFailed": "Connection failed. Please try again.",
    "online.error.invalidCode": "Invalid or expired code",
    "online.error.gameFull": "Game not found or already full",
    "game.banner.reconnecting": "Reconnecting…",
    "game.banner.opponentDisconnected": "{name} disconnected · {seconds}s to return",
    "game.toast.opponentLeft": "{name} left the game. You win!",
    "online.error.generic": "Something went wrong. Please try again.",
    "online.error.notYourTurn": "It's not your turn",
    "online.error.invalidBet": "Invalid bet amount",
    "online.error.rejoinFailed": "Your previous game is no longer available",
  },
  es: {
    "home.languageEnglish": "Inglés",
    "home.languageSpanish": "Español",
    "home.configTitle": "Configuración",
    "home.languageLabel": "Idioma",
    "home.soundLabel": "Sonido",
    "home.soundOn": "Activado",
    "home.soundOff": "Desactivado",
    "home.modeOnline": "En línea",
    "home.modeOffline": "Sin conexión",
    "home.modeOfflineDescription": "Juega con amigos en el mismo dispositivo",
    "home.modeOnlineDescription": "Desafía a jugadores de todo el mundo",
    "game.player1DefaultName": "Jugador 1",
    "game.player2DefaultName": "Jugador 2",
    "game.betRoleLabel": "Apostar",
    "game.rollRoleLabel": "Lanzar",
    "game.pointLabel": "Punto",
    "game.betSheet.title": "Es momento de apostar",
    "game.betSheet.currentBetLabel": "Apuesta actual",
    "game.betSheet.newTotalBetLabel": "Nueva apuesta",
    "game.betSheet.firstBetCta": "Apostar",
    "game.betSheet.keepCta": "Mantener",
    "game.betSheet.increaseCta": "Aumentar",
    "game.endModal.title": "Fin de la partida",
    "game.endModal.titleLoserOnline": "Has perdido",
    "game.endModal.subtitle": "¡Felicidades!",
    "game.endModal.subtitleLoserOnline": "¡Más suerte la próxima!",
    "game.endModal.roundsLabel": "Rondas jugadas",
    "game.endModal.goHomeCta": "Finalizar",
    "game.endModal.shareCta": "Compartir",
    "game.endModal.shareMessage":
      "{winner} ganó contra {loser} en {totalRounds} rondas! ¡Juega Siete y Once conmigo!",
    "game.endModal.winnerLabel": "Ganador",
    "game.endModal.loserLabel": "Perdedor",
    "game.toast.rollToDetermineShooter": "¡Lanza para determinar al Lanzador!",
    "game.toast.playerRolled": "{name} sacó {sum}. Turno de {next}.",
    "game.toast.tie": "¡Empate! Lanza de nuevo.",
    "game.toast.shooterDetermined": "¡{name} es el Lanzador!",
    "game.toast.placeBet": "{name}, ¡haz tu apuesta!",
    "game.toast.shooterRoll": "{name}, ¡lanza los dados!",
    "game.toast.shooterWinsNatural": "¡7 u 11! ¡{name} gana!",
    "game.toast.bettorWinsCraps": "¡Craps! ¡{name} gana!",
    "game.toast.pointSet": "¡El punto es {point}! Iguálalo para ganar.",
    "game.toast.shooterWinsPoint": "¡Punto igualado! ¡{name} gana!",
    "game.toast.bettorWinsSeven": "¡Sacó 7! ¡{name} gana!",
    "game.toast.continueRolling": "Sacaste {sum}. ¡Sigue lanzando!",
    "game.exitModal.title": "¿Salir del juego?",
    "game.exitModal.message": "Se perderá tu progreso.",
    "game.exitModal.cancelCta": "Cancelar",
    "game.exitModal.exitCta": "Salir",
    "game.a11y.exitButton": "Salir del juego",
    "game.a11y.rollDice": "Lanzar dados",
    "game.a11y.keepBetToggle": "Mantener apuesta bloqueada",
    "game.toast.opponentReconnected": "Oponente reconectado",
    "game.toast.gameOverAbandonment":
      "¡Ganaste! El oponente abandonó la partida.",
    "online.lobby.heroTitle": "Juega con amigos",
    "online.lobby.heroSubtitle": "Crea una partida o únete con un código",
    "online.lobby.createGame": "Crear partida",
    "online.lobby.codePlaceholder": "ABCDEF",
    "online.lobby.join": "Unirse",
    "online.lobby.joinCodeModal.title": "Ingresa el código de la partida",
    "online.lobby.betPerGame": "Dinero total",
    "online.lobby.haveCodeQuestion": "¿Tienes un código de partida?",
    "online.lobby.joinCta": "Unirme",
    "online.lobby.pasteCode": "Pegar",
    "online.lobby.playerCount": "Jugadores",
    "online.waiting.gameCodeTitle": "Código de partida",
    "online.waiting.copyCodeCta": "Copiar código",
    "online.waiting.codeCopied": "¡Código copiado!",
    "online.waiting.cancel": "Cancelar",
    "online.waiting.exitCta": "Salir",
    "online.waiting.shareCta": "Compartir",
    "online.waiting.shareCodeMessage": "Únete a mi partida con este código: {code}",
    "online.username.title": "Elige tu nombre",
    "online.username.placeholder": "Ingresa tu nombre",
    "online.username.continue": "Continuar",
    "online.error.connectionFailed": "Error de conexión. Intenta de nuevo.",
    "online.error.invalidCode": "Código inválido o expirado",
    "online.error.gameFull": "Partida no encontrada o llena",
    "game.banner.reconnecting": "Reconectando…",
    "game.banner.opponentDisconnected": "{name} se desconectó · {seconds}s para volver",
    "game.toast.opponentLeft": "{name} abandonó la partida. ¡Ganaste!",
    "online.error.generic": "Algo salió mal. Intenta de nuevo.",
    "online.error.notYourTurn": "No es tu turno",
    "online.error.invalidBet": "Monto de apuesta inválido",
    "online.error.rejoinFailed": "Tu partida anterior ya no está disponible",
  },
};

export type TranslationKey = TranslationKeys;

/** Looks up a translation, falling back to the key itself so a missing string is visible. */
export const translate = (language: Language, key: TranslationKey): string =>
  translations[language][key] ?? key;
