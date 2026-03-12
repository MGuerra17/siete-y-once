export type Language = "en" | "es";

type TranslationKeys =
  | "home.welcomeTitle"
  | "home.startGame"
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
  | "home.comingSoon"
  | "game.player1DefaultName"
  | "game.player2DefaultName"
  | "game.currentMoney"
  | "game.currentRole"
  | "game.winningNumbers"
  | "game.betRoleLabel"
  | "game.rollRoleLabel"
  | "game.pointLabel"
  | "game.lastRollSumPlayer1Label"
  | "game.lastRollSumPlayer2Label"
  | "game.rollDiceCta"
  | "game.betSheet.title"
  | "game.betSheet.currentBetLabel"
  | "game.betSheet.newTotalBetLabel"
  | "game.betSheet.firstBetCta"
  | "game.betSheet.keepCta"
  | "game.betSheet.increaseCta"
  | "game.endModal.title"
  | "game.endModal.subtitle"
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
  | "game.toast.comparingRolls"
  | "game.keepBetLabel"
  | "game.exitModal.title"
  | "game.exitModal.message"
  | "game.exitModal.cancelCta"
  | "game.exitModal.exitCta"
  | "game.a11y.exitButton"
  | "game.a11y.rollDice"
  | "game.a11y.keepBetToggle"
  | "game.toast.opponentDisconnected"
  | "game.toast.opponentReconnected"
  | "game.toast.gameOverAbandonment"
  | "game.toast.waitingForOpponent"
  | "online.lobby.title"
  | "online.lobby.createGame"
  | "online.lobby.joinGame"
  | "online.lobby.enterCode"
  | "online.lobby.codePlaceholder"
  | "online.lobby.join"
  | "online.waiting.title"
  | "online.waiting.waitingForOpponent"
  | "online.waiting.shareCodeLabel"
  | "online.waiting.copyCode"
  | "online.waiting.codeCopied"
  | "online.waiting.connecting"
  | "online.waiting.cancel"
  | "online.username.title"
  | "online.username.placeholder"
  | "online.username.continue"
  | "online.error.connectionFailed"
  | "online.error.invalidCode"
  | "online.error.gameFull"
  | "online.claimAbandonment";

type TranslationRecord = Record<Language, Record<TranslationKeys, string>>;

export const translations: TranslationRecord = {
  en: {
    "home.welcomeTitle": "Welcome to Dice Duel",
    "home.startGame": "Start game",
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
    "home.comingSoon": "Coming soon",
    "game.player1DefaultName": "Player 1",
    "game.player2DefaultName": "Player 2",
    "game.currentMoney": "Money",
    "game.currentRole": "Role",
    "game.winningNumbers": "Winning numbers",
    "game.betRoleLabel": "Bet",
    "game.rollRoleLabel": "Roll",
    "game.pointLabel": "Point",
    "game.lastRollSumPlayer1Label": "Player 1 last roll",
    "game.lastRollSumPlayer2Label": "Player 2 last roll",
    "game.rollDiceCta": "Roll dices",
    "game.betSheet.title": "It's time for bet",
    "game.betSheet.currentBetLabel": "Current bet",
    "game.betSheet.newTotalBetLabel": "New bet",
    "game.betSheet.firstBetCta": "Bet",
    "game.betSheet.keepCta": "Keep",
    "game.betSheet.increaseCta": "Increase",
    "game.endModal.title": "Game over",
    "game.endModal.subtitle": "Congrats!",
    "game.endModal.roundsLabel": "Rounds played",
    "game.endModal.goHomeCta": "Finish",
    "game.endModal.shareCta": "Share",
    "game.endModal.shareMessage":
      "{winner} won against {loser} in {totalRounds} rounds! Play Dice Duel with me!",
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
    "game.toast.comparingRolls": "{name} rolled {sum}! Comparing...",
    "game.keepBetLabel": "Keep bet",
    "game.exitModal.title": "Exit game?",
    "game.exitModal.message": "Your progress will be lost.",
    "game.exitModal.cancelCta": "Cancel",
    "game.exitModal.exitCta": "Exit",
    "game.a11y.exitButton": "Exit game",
    "game.a11y.rollDice": "Roll dice",
    "game.a11y.keepBetToggle": "Keep bet locked",
    "game.toast.opponentDisconnected": "Opponent disconnected",
    "game.toast.opponentReconnected": "Opponent reconnected",
    "game.toast.gameOverAbandonment": "You win! Opponent abandoned the game.",
    "game.toast.waitingForOpponent": "Waiting for opponent...",
    "online.lobby.title": "Online Game",
    "online.lobby.createGame": "Create Game",
    "online.lobby.joinGame": "Join Game",
    "online.lobby.enterCode": "Enter room code",
    "online.lobby.codePlaceholder": "ABCDEF",
    "online.lobby.join": "Join",
    "online.waiting.title": "Waiting Room",
    "online.waiting.waitingForOpponent": "Waiting for opponent to join...",
    "online.waiting.shareCodeLabel": "Share this code with the other player",
    "online.waiting.copyCode": "Tap to copy code",
    "online.waiting.codeCopied": "Code copied!",
    "online.waiting.connecting": "Connecting...",
    "online.waiting.cancel": "Cancel",
    "online.username.title": "Choose your name",
    "online.username.placeholder": "Enter your name",
    "online.username.continue": "Continue",
    "online.error.connectionFailed": "Connection failed. Please try again.",
    "online.error.invalidCode": "Invalid or expired code",
    "online.error.gameFull": "Game not found or already full",
    "online.claimAbandonment": "Claim Win",
  },
  es: {
    "home.welcomeTitle": "Bienvenido a Duelo de Dados",
    "home.startGame": "Comenzar juego",
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
    "home.comingSoon": "Próximamente",
    "game.player1DefaultName": "Jugador 1",
    "game.player2DefaultName": "Jugador 2",
    "game.currentMoney": "Dinero",
    "game.currentRole": "Rol",
    "game.winningNumbers": "Números ganadores",
    "game.betRoleLabel": "Apostar",
    "game.rollRoleLabel": "Lanzar",
    "game.pointLabel": "Punto",
    "game.lastRollSumPlayer1Label": "Último lanzamiento jugador 1",
    "game.lastRollSumPlayer2Label": "Último lanzamiento jugador 2",
    "game.rollDiceCta": "Lanzar dados",
    "game.betSheet.title": "Es momento de apostar",
    "game.betSheet.currentBetLabel": "Apuesta actual",
    "game.betSheet.newTotalBetLabel": "Nueva apuesta",
    "game.betSheet.firstBetCta": "Apostar",
    "game.betSheet.keepCta": "Mantener",
    "game.betSheet.increaseCta": "Aumentar",
    "game.endModal.title": "Fin de la partida",
    "game.endModal.subtitle": "¡Felicidades!",
    "game.endModal.roundsLabel": "Rondas jugadas",
    "game.endModal.goHomeCta": "Finalizar",
    "game.endModal.shareCta": "Compartir",
    "game.endModal.shareMessage":
      "{winner} ganó contra {loser} en {totalRounds} rondas! ¡Juega Duelo de Dados conmigo!",
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
    "game.toast.pointSet": "¡El punto es {point}! Igualalo para ganar.",
    "game.toast.shooterWinsPoint": "¡Punto igualado! ¡{name} gana!",
    "game.toast.bettorWinsSeven": "¡Seven out! ¡{name} gana!",
    "game.toast.continueRolling": "Sacaste {sum}. ¡Sigue lanzando!",
    "game.toast.comparingRolls": "{name} sacó {sum}. Comparando...",
    "game.keepBetLabel": "Mantener apuesta",
    "game.exitModal.title": "¿Salir del juego?",
    "game.exitModal.message": "Se perderá tu progreso.",
    "game.exitModal.cancelCta": "Cancelar",
    "game.exitModal.exitCta": "Salir",
    "game.a11y.exitButton": "Salir del juego",
    "game.a11y.rollDice": "Lanzar dados",
    "game.a11y.keepBetToggle": "Mantener apuesta bloqueada",
    "game.toast.opponentDisconnected": "Oponente desconectado",
    "game.toast.opponentReconnected": "Oponente reconectado",
    "game.toast.gameOverAbandonment":
      "¡Ganaste! El oponente abandonó la partida.",
    "game.toast.waitingForOpponent": "Esperando al oponente...",
    "online.lobby.title": "Juego en línea",
    "online.lobby.createGame": "Crear partida",
    "online.lobby.joinGame": "Unirse a partida",
    "online.lobby.enterCode": "Ingresa el código de sala",
    "online.lobby.codePlaceholder": "ABCDEF",
    "online.lobby.join": "Unirse",
    "online.waiting.title": "Sala de espera",
    "online.waiting.waitingForOpponent":
      "Esperando a que se una un oponente...",
    "online.waiting.shareCodeLabel": "Comparte este código con el otro jugador",
    "online.waiting.copyCode": "Toca para copiar el código",
    "online.waiting.codeCopied": "¡Código copiado!",
    "online.waiting.connecting": "Conectando...",
    "online.waiting.cancel": "Cancelar",
    "online.username.title": "Elige tu nombre",
    "online.username.placeholder": "Ingresa tu nombre",
    "online.username.continue": "Continuar",
    "online.error.connectionFailed": "Error de conexión. Intenta de nuevo.",
    "online.error.invalidCode": "Código inválido o expirado",
    "online.error.gameFull": "Partida no encontrada o llena",
    "online.claimAbandonment": "Reclamar victoria",
  },
};

export type TranslationKey = TranslationKeys;
