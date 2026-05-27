import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorld } from "../game/world";
import { createInput, bindKeyboard } from "../game/input";
import { update } from "../game/loop";
import { render } from "../game/render";
import { GAME_W, GAME_H } from "../game/constants";
import { postScore } from "../services/scoresApi";
import { getPlayerIdentity } from "../utils/playerName";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef(createWorld());
  const [gameOver, setGameOver] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: GAME_W, height: GAME_H });
  const navigate = useNavigate();

  // Responsive resize
  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      const parentW = containerRef.current.offsetWidth;
      const parentH = containerRef.current.offsetHeight;
      // Mantieni rapporto 360:640
      let width = parentW;
      let height = (width * GAME_H) / GAME_W;
      if (height > parentH) {
        height = parentH;
        width = (height * GAME_W) / GAME_H;
      }
      setCanvasSize({ width, height });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_W;
    canvas.height = GAME_H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const input = createInput();
    const unbind = bindKeyboard(input);

    let scoreSaved = false;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      const world = worldRef.current;

      if (world.state !== "gameover") {
        update(world, input, dt);
      }

      if (world.state === "gameover") {
        setGameOver(true);

        if (!scoreSaved) {
          scoreSaved = true;
          const player = getPlayerIdentity();
          postScore({
            playerId: player.id,
            name: player.name,
            score: Math.floor(world.score),
            createdAt: new Date().toISOString(),
          }).catch(console.error);
        }
      }

      render(ctx, world);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unbind();
    };
  }, []);

  // restart
  function handleRestart() {
    worldRef.current = createWorld();
    setGameOver(false);
  }

  return (
    <div ref={containerRef} className="game-canvas-wrap">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
      />

      {gameOver && (
        <div className="gameover-buttons">
          <button onClick={handleRestart}>Riprova</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      )}
    </div>
  );
}
