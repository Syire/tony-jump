import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTopScores, ScoreItem } from "../services/scoresApi";
import "./css/LeaderBoard.css";

const podiumIcons = ["👑", "🥈", "🥉"];

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopScores(10)
      .then((data) => {
        setScores(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="leaderboard-page">
      <section className="leaderboard-shell" aria-labelledby="leaderboard-title">
        <div className="leaderboard-card">
          <header className="leaderboard-header">
            <div className="leaderboard-badge">Tony Pitony Leaderboard</div>

            <h1 id="leaderboard-title" className="leaderboard-title">
              Classifica
            </h1>

            <p className="leaderboard-subtitle">
              La pista da ballo dei campioni: chi salta più in alto conquista il
              podio Pitony.
            </p>
          </header>

          <div className="leaderboard-content">
            {loading && (
              <p className="leaderboard-state">Caricamento classifica...</p>
            )}

            {error && (
              <p className="leaderboard-state leaderboard-state--error">
                {error}
              </p>
            )}

            {!loading && !error && scores.length === 0 && (
              <p className="leaderboard-empty">
                Ancora nessun punteggio. Fai il primo salto leggendario!
              </p>
            )}

            {!loading && !error && scores.length > 0 && (
              <ol className="leaderboard-list" aria-label="Top 10 giocatori">
                {scores.map((score, index) => {
                  const rank = index + 1;
                  const isPodium = rank <= 3;

                  return (
                    <li
                      key={score.id ?? `${score.name}-${score.score}-${index}`}
                      className={`leaderboard-row${
                        isPodium ? " leaderboard-row--podium" : ""
                      }`}
                    >
                      <span className="leaderboard-rank">
                        {podiumIcons[index] ?? rank}
                      </span>

                      <div className="leaderboard-player">
                        <span className="leaderboard-name">{score.name}</span>
                        <span className="leaderboard-label">
                          Posizione #{rank}
                        </span>
                      </div>

                      <div className="leaderboard-score">
                        <strong>{score.score}</strong>
                        <span>punti</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <footer className="leaderboard-footer">
            <p className="leaderboard-quote">
              “La leaderboard è la mia pista da ballo!”
            </p>

            <Link to="/" className="leaderboard-home-link">
              Torna alla Home
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}