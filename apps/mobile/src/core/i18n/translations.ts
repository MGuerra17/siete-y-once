export type Language = "en" | "es";

type TranslationKeys =
  | "home.welcomeTitle"
  | "home.startGame"
  | "home.languageEnglish"
  | "home.languageSpanish"
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
  | "game.endModal.winnerLabel"
  | "game.endModal.loserLabel";

type TranslationRecord = Record<Language, Record<TranslationKeys, string>>;

export const translations: TranslationRecord = {
  en: {
    "home.welcomeTitle": "Welcome to Dice Duel",
    "home.startGame": "Start game",
    "home.languageEnglish": "English",
    "home.languageSpanish": "Spanish",
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
    "game.betSheet.newTotalBetLabel": "New total bet",
    "game.betSheet.firstBetCta": "Bet",
    "game.betSheet.keepCta": "Keep",
    "game.betSheet.increaseCta": "Increase",
    "game.endModal.title": "Game over",
    "game.endModal.subtitle": "Congrats, {winnerName}!",
    "game.endModal.roundsLabel": "Rounds played",
    "game.endModal.goHomeCta": "Finish",
    "game.endModal.shareCta": "Share",
    "game.endModal.winnerLabel": "Winner",
    "game.endModal.loserLabel": "Loser",
  },
  es: {
    "home.welcomeTitle": "Bienvenido a Duelo de Dados",
    "home.startGame": "Comenzar juego",
    "home.languageEnglish": "Inglés",
    "home.languageSpanish": "Español",
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
    "game.betSheet.newTotalBetLabel": "Nueva apuesta total",
    "game.betSheet.firstBetCta": "Apostar",
    "game.betSheet.keepCta": "Mantener",
    "game.betSheet.increaseCta": "Aumentar",
    "game.endModal.title": "Fin de la partida",
    "game.endModal.subtitle": "¡Felicidades, {winnerName}!",
    "game.endModal.roundsLabel": "Rondas jugadas",
    "game.endModal.goHomeCta": "Finalizar",
    "game.endModal.shareCta": "Compartir",
    "game.endModal.winnerLabel": "Ganador",
    "game.endModal.loserLabel": "Perdedor",
  },
};

export type TranslationKey = TranslationKeys;
