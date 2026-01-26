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
                setScores(data);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f5f7fa, #e4e7eb)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat, Arial, sans-serif',
        }}>
            <div style={{
                background: 'white',
                borderRadius: 20,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                padding: '36px 32px 32px 32px',
                maxWidth: 440,
                width: '92%',
                margin: '0 auto',
                textAlign: 'center',
                border: '3px solid #b97a56',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#b97a56',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 22,
                    padding: '8px 32px',
                    borderRadius: 32,
                    boxShadow: '0 2px 8px #b97a5677',
                    letterSpacing: 2,
                    border: '2px solid #fff',
                }}>
                    Tony Pitony Leaderboard
                </div>
                <h2 style={{
                    color: '#b97a56',
                    marginBottom: 12,
                    marginTop: 24,
                    fontWeight: 800,
                    fontSize: '2em',
                    letterSpacing: 1,
                }}>
                    La pista da ballo dei campioni!
                </h2>
                <div style={{ fontSize: 16, color: '#333', marginBottom: 18, fontWeight: 500, fontStyle: 'italic' }}>
                    “Spacca tutto, Pitony style!”
                </div>
                {loading && <p style={{ color: '#b97a56', fontWeight: 700 }}>Caricamento...</p>}
                {error && <p style={{ color: 'crimson', fontWeight: 700 }}>{error}</p>}
                {!loading && !error && (
                    <ol style={{
                        padding: 0,
                        margin: 0,
                        listStyle: 'decimal inside',
                        textAlign: 'left',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#222',
                    }}>
                        {scores.map((s, i) => (
                            <li key={s.id} style={{
                                margin: '12px 0',
                                fontWeight: i === 0 ? 900 : 700,
                                fontSize: i === 0 ? '1.3em' : '1em',
                                color: i === 0 ? '#b97a56' : '#333',
                                background: i === 0 ? 'rgba(185,122,86,0.08)' : 'none',
                                borderRadius: 12,
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}>
                                <span style={{ fontSize: 22 }}>{i === 0 ? '👑' : '🎵'}</span>
                                <b>{s.name}</b> <span style={{ color: '#b97a56', fontWeight: 600 }}>— {s.score}</span>
                            </li>
                        ))}
                    </ol>
                )}
                <div style={{ fontSize: 15, color: '#b97a56', marginTop: 18, fontWeight: 600, fontStyle: 'italic' }}>
                    “La leaderboard è la mia pista da ballo!”
                </div>
                <Link to="/" style={{
                    display: 'inline-block',
                    marginTop: 28,
                    textDecoration: 'none',
                    padding: '12px 32px',
                    borderRadius: 999,
                    border: '2px solid #b97a56',
                    color: '#b97a56',
                    fontWeight: 800,
                    background: 'transparent',
                    letterSpacing: 1,
                    fontSize: 18,
                    transition: 'all 0.2s',
                }}>Home</Link>
            </div>
        </div>
    );
}
