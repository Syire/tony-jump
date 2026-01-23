const STORAGE_KEY = "doodle_player_name";

const ADJECTIVES = [
  "Crazy", "Flying", "Happy", "Sleepy", "Ninja", "Lucky", "Fast"
];

const NOUNS = [
  "Frog", "Jumper", "Alien", "Cat", "Blob", "Duck", "Hero"
];

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomName() {
  return `${randomItem(ADJECTIVES)}${randomItem(NOUNS)}${Math.floor(
    Math.random() * 100
  )}`;
}

export function getPlayerName(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const randomName = generateRandomName();
  localStorage.setItem(STORAGE_KEY, randomName);
  return randomName;
}

export function setPlayerName(name: string) {
  localStorage.setItem(STORAGE_KEY, name);
}
