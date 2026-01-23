import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopScores, ScoreItem } from "../services/scoresApi";

export default function Leaderboard() {
    const [scores, setScores] = useState<ScoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTopScores(10)
            .then((data) => {
                console.log("scores:", data);
                setScores(data);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);


    return (
        <div style={{ padding: 24, maxWidth: 520, margin: "0 auto", color: "#fff" }}>
            <h1>Leaderboard</h1>

            {loading && <p>Caricamento...</p>}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {!loading && !error && (
                <ol>
                    {scores.map((s) => (
                        <li key={s.id}>
                            <b>{s.name}</b> — {s.score}
                        </li>
                    ))}
                </ol>
            )}

            <Link to="/">Home</Link>
        </div>
    );

}
