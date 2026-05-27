import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getTopScores, ScoreItem } from "../services/scoresApi";
import { getPlayerIdentity } from "../utils/playerName";
import "./css/LeaderBoard.css";

const SCORES_PER_PAGE = 5;

function getRankClassName(rank: number) {
    if (rank === 1) return "leaderboard-rank--first";
    if (rank === 2) return "leaderboard-rank--second";
    if (rank === 3) return "leaderboard-rank--third";

    return "leaderboard-rank--default";
}
function getRowRankClassName(rank: number) {
    if (rank === 1) return "leaderboard-row--first-place";
    if (rank === 2) return "leaderboard-row--second-place";
    if (rank === 3) return "leaderboard-row--third-place";

    return "leaderboard-row--default-place";
}

export default function Leaderboard() {
    const [scores, setScores] = useState<ScoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const [currentPlayer] = useState(() => getPlayerIdentity());

    useEffect(() => {
        getTopScores()
            .then((data) => {
                setScores(data);
                setCurrentPage(0);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const totalPages = Math.max(1, Math.ceil(scores.length / SCORES_PER_PAGE));

    const currentScores = useMemo(() => {
        const start = currentPage * SCORES_PER_PAGE;
        const end = start + SCORES_PER_PAGE;

        return scores.slice(start, end);
    }, [scores, currentPage]);

    const currentPlayerPosition = useMemo(() => {
        const playerIndex = scores.findIndex((score) => {
            const hasSamePlayerId = score.playerId === currentPlayer.id;
            const hasSameNameWithoutPlayerId =
                !score.playerId && score.name === currentPlayer.name;

            return hasSamePlayerId || hasSameNameWithoutPlayerId;
        });

        if (playerIndex === -1) {
            return null;
        }

        return playerIndex + 1;
    }, [scores, currentPlayer]);

    const canGoBack = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(0, page - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
    };

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
                            Sfoglia il libro dei campioni: ogni pagina mostra i migliori
                            salti della pista Pitony.
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
                            <div className="leaderboard-book">
                                <div className="leaderboard-book-cover">
                                    <div className="leaderboard-book-page">
                                        <div className="leaderboard-page-top">
                                            <span>Pagina {currentPage + 1}</span>
                                            <span>
                                                Posizioni {currentPage * SCORES_PER_PAGE + 1}
                                                {" - "}
                                                {currentPage * SCORES_PER_PAGE + currentScores.length}
                                            </span>
                                        </div>

                                        <ol
                                            className="leaderboard-list"
                                            aria-label="Classifica giocatori"
                                        >
                                            {currentScores.map((score, index) => {
                                                const globalIndex =
                                                    currentPage * SCORES_PER_PAGE + index;
                                                const rank = globalIndex + 1;
                                                const isPodium = rank <= 3;
                                                const isCurrentPlayer =
                                                    score.playerId === currentPlayer.id ||
                                                    (!score.playerId && score.name === currentPlayer.name);

                                                return (
                                                    <li
                                                        key={
                                                            score.id ?? `${score.name}-${score.score}-${rank}`
                                                        }
                                                        className={`leaderboard-row ${getRowRankClassName(rank)}${isPodium ? " leaderboard-row--podium" : ""
                                                            }${isCurrentPlayer
                                                                ? " leaderboard-row--current-player"
                                                                : ""
                                                            }`}
                                                    >
                                                        <span
                                                            className={`leaderboard-rank ${getRankClassName(rank)}`.trim()}
                                                        >
                                                            {rank}
                                                        </span>

                                                        <div className="leaderboard-player">
                                                            <span className="leaderboard-name">
                                                                {score.name}
                                                            </span>

                                                            <span className="leaderboard-label">
                                                                {isCurrentPlayer
                                                                    ? `Sei tu · Posizione #${rank}`
                                                                    : `Posizione #${rank}`}
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

                                        <div className="leaderboard-page-bottom">
                                            <span>
                                                {scores.length} giocatori nella classifica caricata
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="leaderboard-book-controls">
                                    <button
                                        type="button"
                                        className="leaderboard-page-button"
                                        onClick={goToPreviousPage}
                                        disabled={!canGoBack}
                                    >
                                        ← Pagina prima
                                    </button>

                                    <span className="leaderboard-page-counter">
                                        {currentPage + 1} / {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        className="leaderboard-page-button"
                                        onClick={goToNextPage}
                                        disabled={!canGoNext}
                                    >
                                        Pagina dopo →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="leaderboard-footer">
                        <p className="leaderboard-quote">
                            {currentPlayerPosition ? (
                                <>
                                    “Ogni pagina ha il suo campione e tu sei il numero{" "}
                                    <strong>#{currentPlayerPosition}</strong>.”
                                </>
                            ) : (
                                <>
                                    “Ogni pagina ha il suo campione. Gioca una partita per entrare
                                    in classifica.”
                                </>
                            )}
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