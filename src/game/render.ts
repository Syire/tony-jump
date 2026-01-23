import { World } from "./types";

export function render(ctx: CanvasRenderingContext2D, world: World) {
  const { width, height } = world;

  // SFONDO 
  ctx.fillStyle = "#f4f7fb";
  ctx.fillRect(0, 0, width, height);

  // PIATTAFORME
  ctx.fillStyle = "#4caf50";
  for (const plat of world.platforms) {
    ctx.fillRect(plat.pos.x, plat.pos.y, plat.w, plat.h);
  }

  // PLAYER 
  const p = world.player;
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(p.pos.x, p.pos.y, p.w, p.h);

  // HUD 
  ctx.fillStyle = "#222";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${world.score}`, 12, 24);

  // GAME OVER 
  if (world.state === "gameover") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, width, height);
  }
}
