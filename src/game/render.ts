import { World } from "./types";

// Caricamento immagine compatibile con Vite/React
let playerImg: HTMLImageElement | null = null;
function getPlayerImg(): HTMLImageElement {
  if (!playerImg) {
    playerImg = new window.Image();
    // Usa import.meta.url per risolvere il path statico
    playerImg.src = new URL('../assets/tony.png', import.meta.url).href;
  }
  return playerImg;
}

export function render(ctx: CanvasRenderingContext2D, world: World) {
  const { width, height } = world;

  // SFONDO 
  ctx.fillStyle = "#f4f7fb";
  ctx.fillRect(0, 0, width, height);


  // Caricamento immagini piattaforme
  let platformBaseImg: HTMLImageElement | null = null;
  let platformJumpImg: HTMLImageElement | null = null;
  let platformBrokenImg: HTMLImageElement | null = null;
  function getPlatformImg(type: string): HTMLImageElement {
    if (type === "jump") {
      if (!platformJumpImg) {
        platformJumpImg = new window.Image();
        platformJumpImg.src = new URL('../assets/platform_jump.png', import.meta.url).href;
      }
      return platformJumpImg;
    } else if (type === "broken") {
      if (!platformBrokenImg) {
        platformBrokenImg = new window.Image();
        platformBrokenImg.src = new URL('../assets/platform_broken.png', import.meta.url).href;
      }
      return platformBrokenImg;
    } else {
      if (!platformBaseImg) {
        platformBaseImg = new window.Image();
        platformBaseImg.src = new URL('../assets/platforn_base.png', import.meta.url).href;
      }
      return platformBaseImg;
    }
  }

  // PIATTAFORME
  for (const plat of world.platforms) {
    const type = (typeof (plat as any).type === "string" ? (plat as any).type : "base");
    const img = getPlatformImg(type);
    if (img.complete) {
      ctx.drawImage(img, plat.pos.x, plat.pos.y, plat.w, plat.h);
    } else {
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(plat.pos.x, plat.pos.y, plat.w, plat.h);
    }
  }


  // PLAYER
  const p = world.player;
  const img = getPlayerImg();
  if (img.complete) {
    ctx.drawImage(img, p.pos.x, p.pos.y, p.w, p.h);
  } else {
    // fallback: draw rect if image not loaded
    ctx.fillStyle = "#ff5722";
    ctx.fillRect(p.pos.x, p.pos.y, p.w, p.h);
  }

  // HUD 
  ctx.fillStyle = "#222";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${world.score}`, 12, 24);

  // GAME OVER 
  if (world.state === "gameover") {
    // Overlay sfumato
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, width, height);

    // Box centrale
    const boxW = Math.min(340, width * 0.8);
    const boxH = 220;
    const boxX = width / 2 - boxW / 2;
    const boxY = height / 2 - boxH / 2;
    ctx.save();
    ctx.globalAlpha = 0.98;
    ctx.fillStyle = "#fffbe6";
    ctx.strokeStyle = "#b97a56";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Testo GAME OVER
    ctx.save();
    ctx.font = "bold 2.2rem 'Comic Sans MS', cursive";
    ctx.fillStyle = "#b97a56";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ffb347";
    ctx.shadowBlur = 12;
    ctx.fillText("GAME OVER", width / 2, boxY + 54);
    ctx.restore();

    // Punteggio
    ctx.save();
    ctx.font = "1.3rem 'Arial', sans-serif";
    ctx.fillStyle = "#7a4a17";
    ctx.textAlign = "center";
    ctx.fillText(`Punteggio: ${world.score}`, width / 2, boxY + 98);
    ctx.restore();

    // Istruzioni
    ctx.save();
    ctx.font = "1.1rem 'Arial', sans-serif";
    ctx.fillStyle = "#b97a56";
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.7;
    ctx.fillText("Tocca Riprova o Home", width / 2, boxY + 132);
    ctx.restore();

    // (I bottoni veri sono gestiti da React, qui solo grafica)
  }
}
