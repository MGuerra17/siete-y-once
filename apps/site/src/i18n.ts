export type Lang = "es" | "en";
export type PageId = "home" | "privacy" | "support";

export const routes: Record<Lang, Record<PageId, string>> = {
  es: { home: "/", privacy: "/privacidad", support: "/soporte" },
  en: { home: "/en", privacy: "/en/privacy", support: "/en/support" },
};

const es = {
  "meta.description":
    "Siete y Once: el duelo de dados de dos jugadores de la Costa Caribe colombiana. En el mismo teléfono o en línea.",
  "nav.privacy": "Privacidad",
  "nav.support": "Soporte",
  "nav.switchLang": "English",
  "home.title": "Siete y Once: Duelo de Dados",
  "home.eyebrow": "El juego de dados de la Costa",
  "home.lead":
    "El duelo de dados de dos jugadores que se juega en la Costa Caribe colombiana. En el mismo teléfono o en línea.",
  "home.store.appStore.small": "Descárgalo en el",
  "home.store.googlePlay.small": "Disponible en",
  "home.store.soon": "Próximamente",
  "home.throw.title": "Todo se decide en el primer tiro",
  "home.throw.body":
    "Un jugador tira los dados y el otro apuesta en su contra. El que tira lanza los dos dados y la suma decide la ronda.",
  "home.throw.natural.title": "Gana el que tira",
  "home.throw.natural.body": "Le cobra la apuesta al otro jugador.",
  "home.throw.craps.title": "Gana el que apuesta",
  "home.throw.craps.body": "El que tira paga la apuesta.",
  "home.throw.point.title": "Queda un punto",
  "home.throw.point.body": "Sigue tirando: si repite el punto gana; si saca 7 pierde.",
  "home.fact.balance": "para empezar",
  "home.fact.turn": "por turno",
  "home.fact.noAccounts": "Sin cuentas",
  "home.fact.noAds": "ni anuncios",
  "privacy.title": "Política de privacidad",
  "privacy.effective": "Vigente desde el",
  "support.title": "Soporte",
  "support.subtitle": "Ayuda para",
  "support.contact.title": "¿Algo no funciona?",
  "support.contact.body": "Cuéntanos tu modelo de teléfono y qué pasó. Escríbenos a",
  "footer.madeIn": "Hecho en la Costa",
};

type Strings = typeof es;

const en: Strings = {
  "meta.description":
    "Siete y Once: the two-player dice duel from Colombia's Caribbean coast. On one phone or online.",
  "nav.privacy": "Privacy",
  "nav.support": "Support",
  "nav.switchLang": "Español",
  "home.title": "Siete y Once: Dice Duel",
  "home.eyebrow": "The dice game from the Coast",
  "home.lead":
    "The two-player dice duel played on Colombia's Caribbean coast. On one phone or online.",
  "home.store.appStore.small": "Download on the",
  "home.store.googlePlay.small": "Get it on",
  "home.store.soon": "Coming soon",
  "home.throw.title": "It all comes down to the first roll",
  "home.throw.body":
    "One player rolls and the other bets against them. The shooter throws two dice and the total decides the round.",
  "home.throw.natural.title": "The shooter wins",
  "home.throw.natural.body": "The other player pays the bet.",
  "home.throw.craps.title": "The bettor wins",
  "home.throw.craps.body": "The shooter pays the bet.",
  "home.throw.point.title": "A point is set",
  "home.throw.point.body": "Keep rolling: hit the point again to win; roll a 7 and you lose.",
  "home.fact.balance": "to start",
  "home.fact.turn": "per turn",
  "home.fact.noAccounts": "No accounts",
  "home.fact.noAds": "and no ads",
  "privacy.title": "Privacy policy",
  "privacy.effective": "Effective",
  "support.title": "Support",
  "support.subtitle": "Help for",
  "support.contact.title": "Something not working?",
  "support.contact.body": "Tell us your phone model and what happened. Write to",
  "footer.madeIn": "Made on the Coast",
};

const strings: Record<Lang, Strings> = { es, en };

export const t = (lang: Lang) => (key: keyof Strings) => strings[lang][key];

export const formatDate = (lang: Lang, iso: string) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
