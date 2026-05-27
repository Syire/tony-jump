const PLAYER_ID_STORAGE_KEY = "tony_player_id";
const PLAYER_NAME_STORAGE_KEY = "tony_player_name";

const MAX_NAME_LENGTH = 20;

export type PlayerIdentity = {
  id: string;
  name: string;
};

const ADJECTIVES = [
  "Elegante",
  "Sborone",
  "Spaccone",
  "Figo",
  "Sfrontato",
  "Chic",
  "Tamarro",
  "Carismatico",
  "Irriverente",
  "Sorridente",
  "Abbronzato",
  "Sicuro",
  "Esagerato",
  "Pitony",
  "Mitico",
];

const NOUNS = [
  "Rayban",
  "Cravatta",
  "Giacca",
  "Tony",
  "Occhiale",
  "Scarpa",
  "Selfie",
  "Meme",
  "Boss",
  "Catenone",
  "Sorrisone",
  "Briatore",
  "Salto",
  "Campione",
  "Pitony",
];

function randomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createPlayerId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizePlayerName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function generateRandomName(takenNames: string[] = []) {
  const takenNameSet = new Set(takenNames.map(normalizePlayerName));

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const candidate = normalizePlayerName(
      `${randomItem(ADJECTIVES)}${randomItem(NOUNS)}${suffix}`
    );

    if (candidate.length <= MAX_NAME_LENGTH && !takenNameSet.has(candidate)) {
      return candidate;
    }
  }

  return `Pitony${Date.now().toString().slice(-6)}`;
}

export function getPlayerId() {
  const savedId = localStorage.getItem(PLAYER_ID_STORAGE_KEY);

  if (savedId) {
    return savedId;
  }

  const newId = createPlayerId();
  localStorage.setItem(PLAYER_ID_STORAGE_KEY, newId);

  return newId;
}

export function getPlayerName(takenNames: string[] = []) {
  const savedName = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);

  if (savedName) {
    return normalizePlayerName(savedName);
  }

  const randomName = generateRandomName(takenNames);
  localStorage.setItem(PLAYER_NAME_STORAGE_KEY, randomName);

  return randomName;
}

export function getPlayerIdentity(takenNames: string[] = []): PlayerIdentity {
  return {
    id: getPlayerId(),
    name: getPlayerName(takenNames),
  };
}

export function setPlayerName(name: string) {
  const cleanName = normalizePlayerName(name);

  if (!cleanName) {
    throw new Error("Nome giocatore non valido");
  }

  localStorage.setItem(PLAYER_NAME_STORAGE_KEY, cleanName);

  return cleanName;
}