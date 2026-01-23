export type Vec2 = { x: number; y: number };

export type Player = {
  pos: Vec2;
  vel: Vec2;
  w: number;
  h: number;
};

export type Platform = {
  id: string;
  pos: Vec2;
  w: number;
  h: number;
};

export type GameState = "menu" | "playing" | "gameover";

export type World = {
  state: GameState;
  width: number;
  height: number;
  player: Player;
  platforms: Platform[];
  score: number;
  time: number;
};
