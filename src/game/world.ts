import { World, Platform } from "./types";
import {
  GAME_W, GAME_H, PLATFORM_W, PLATFORM_H,
  PLATFORM_MIN_ON_SCREEN, GAP_Y_MIN, GAP_Y_MAX, SIDE_MARGIN
} from "./constants";

const uid = () => Math.random().toString(36).slice(2, 9);

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function randomPlatformType(score = 0): "base" | "jump" | "broken" {
  // Scala la difficoltà con il punteggio
  // base: dal 70% al 40%, jump: dal 15% al 25%, broken: dal 15% al 35%
  const t = Math.min(score / 2000, 1); // t va da 0 a 1
  const baseProb = 0.7 - 0.3 * t;
  const jumpProb = 0.15 + 0.1 * t;
  const brokenProb = 1 - baseProb - jumpProb;
  const r = Math.random();
  if (r < baseProb) return "base";
  if (r < baseProb + jumpProb) return "jump";
  return "broken";
}


export function makePlatform(y: number, prevX?: number, score = 0): Platform {
  const xRandom = randInt(SIDE_MARGIN, GAME_W - PLATFORM_W - SIDE_MARGIN);
  const x =
    prevX === undefined
      ? xRandom
      : clamp(xRandom, prevX - 140, prevX + 140);
  const type = randomPlatformType(score);
  return {
    id: uid(),
    pos: { x, y },
    w: PLATFORM_W,
    h: PLATFORM_H,
    type,
    used: false,
  };
}

export function createWorld(): World {
  const platforms: Platform[] = [];

  //piatytaforma di partenza
  const startY = GAME_H - 80;
  const startX = GAME_W / 2 - PLATFORM_W / 2;
  platforms.push({
    id: uid(),
    pos: { x: startX, y: startY },
    w: PLATFORM_W,
    h: PLATFORM_H,
    type: "base",
  });

  // rempiimento schermo iniziale
  let y = startY;
  let prevX = startX;
  while (y > 0) {
    y -= randInt(GAP_Y_MIN, GAP_Y_MAX);
    const p = makePlatform(y, prevX);
    prevX = p.pos.x;
    platforms.push(p);
  }

  return {
    state: "playing",
    width: GAME_W,
    height: GAME_H,
    player: {
      pos: { x: GAME_W / 2 - 36, y: GAME_H - 216 },
      vel: { x: 0, y: 0 },
      w: 72, 
      h: 72,
    },
    platforms,
    score: 0,
    time: 0,
  };
}
