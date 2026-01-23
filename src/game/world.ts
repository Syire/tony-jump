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

function makePlatform(y: number, prevX?: number): Platform {
  const xRandom = randInt(SIDE_MARGIN, GAME_W - PLATFORM_W - SIDE_MARGIN);

  const x =
    prevX === undefined
      ? xRandom
      : clamp(xRandom, prevX - 140, prevX + 140);

  return {
    id: uid(),
    pos: { x, y },
    w: PLATFORM_W,
    h: PLATFORM_H,
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
  });

  // riempimento iniziale piattaforme
  let y = startY;
  let prevX = startX;

  while (platforms.length < PLATFORM_MIN_ON_SCREEN) {
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
      pos: { x: GAME_W / 2 - 14, y: GAME_H - 140 },
      vel: { x: 0, y: 0 },
      w: 28,
      h: 28,
    },
    platforms,
    score: 0,
    time: 0,
  };
}
