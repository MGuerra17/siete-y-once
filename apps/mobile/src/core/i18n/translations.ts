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
  | "game.rollDiceCta";

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
    "game.rollDiceCta": "Roll dices",
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
    "game.rollDiceCta": "Lanzar dados",
  },
};

export type TranslationKey = TranslationKeys;

