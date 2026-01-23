import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorld } from "../game/world";
import { createInput, bindKeyboard } from "../game/input";
import { update } from "../game/loop";
import { render } from "../game/render";
import { GAME_W, GAME_H } from "../game/constants";
import { postScore } from "../services/scoresApi";
import { getPlayerName } from "../utils/playerName";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef(createWorld());
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

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
          postScore({
            name: getPlayerName(),
            score: world.score,
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

  // 🔁 restart
  function handleRestart() {
    worldRef.current = createWorld();
    setGameOver(false);
  }

  return (
    <div style={{ position: "relative", width: GAME_W }}>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #ccc",
          width: GAME_W,
          height: GAME_H,
          display: "block",
        }}
      />

      {gameOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "white",
          }}
        >
          <h2>Game Over</h2>

          <button onClick={handleRestart}>Restart</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      )}
    </div>
  );
}
