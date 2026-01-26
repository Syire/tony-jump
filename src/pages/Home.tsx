// @ts-ignore
import { Link } from "react-router-dom";
import "./css/HomeTony.css";
import { useEffect, useState, useContext } from "react";
import { MusicContext } from "../app/App";
import { getPlayerName, setPlayerName, generateRandomName } from "../utils/playerName";


const MOTIVATIONAL_QUOTES = [
    "Non è il salto, è lo stile!",
    "Solo chi osa Pitony, vola alto!",
    "Con la cravatta si salta meglio!",
    "Rayban e via verso il successo!",
    "Un salto elegante vale doppio!",
    "Sorridi e salta, Pitony!",
    "La classe non è acqua, è salto!",
    "Più in alto, più Pitony!"
];



export default function Home() {
    const [name, setName] = useState("");
    const [quote, setQuote] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [effectsOn, setEffectsOn] = useState(true);
    const context = useContext(MusicContext);
    const musicOn = context.musicOn;
    const setMusicOn = context.setMusicOn as (v: boolean) => void;

    useEffect(() => {
        setName(getPlayerName());
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, []);

    function handleSave() {
        if (name.trim().length > 0) {
            setPlayerName(name.trim());
            alert("Nome salvato!");
        }
    }

    function handleRandomName() {
        const newName = generateRandomName();
        setName(newName);
    }

    const tonyImgUrl = new URL('../assets/tony.png', import.meta.url).href;
    return (
        <div className="home tony-theme">
            {/* Icona impostazioni sotto la barra musica, centrata */}
            <div className="tony-settings-bar">
                <button className="tony-settings-btn tony-settings-bar-btn" onClick={() => setShowSettings(true)} title="Impostazioni" aria-label="Impostazioni">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b97a56" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3.5" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
				</svg>
            </button>
            </div>

            <img src={tonyImgUrl} alt="Tony Pitony" className="tony-img" />
            <h1 className="title tony-title tony-animated">Tony Jump</h1>
            <p className="subtitle tony-sub">Il salto più pitony della storia!</p>
            <p className="tony-quote">{quote}</p>
            <div className="card tony-card">
                <div className="actions tony-actions">
                    <Link to="/game" className="btn tony-btn">
                        GIOCA ORA
                    </Link>
                    <Link to="/leaderboard" className="btn tony-btn-secondary">
                        CLASSIFICA
                    </Link>
                </div>
            </div>
            {/* Modal impostazioni */}
            {showSettings && (
                <div className="tony-modal-bg" onClick={() => setShowSettings(false)}>
                    <div className="tony-modal" onClick={e => e.stopPropagation()}>
                        <h2>Impostazioni</h2>
                        <div className="tony-modal-section">
                            <label>Nome giocatore</label>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button onClick={handleRandomName} title="Genera nome pitony" className="tony-btn-gen">🎲</button>
                            </div>
                            <button onClick={handleSave} className="tony-btn-save" style={{ marginTop: 8 }}>Salva Nome</button>
                        </div>
                        <div className="tony-modal-section">
                            <label>
                                <input type="checkbox" checked={effectsOn} onChange={e => setEffectsOn(e.target.checked)} /> Effetti sonori
                            </label>
                        </div>
                        <div className="tony-modal-section">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={musicOn}
                                    onChange={e => {
                                        const checked = (e.target as HTMLInputElement).checked;
                                        setMusicOn(checked);
                                    }}
                                /> Musica Tony
                            </label>
                        </div>
                        <div className="tony-modal-section" style={{ fontSize: '0.95em', opacity: 0.7 }}>
                            <em>Prossimamente: playlist Tony Pitony!</em>
                        </div>
                        <button className="tony-btn-close" onClick={() => setShowSettings(false)}>Chiudi</button>
                    </div>
                </div>
            )}
            <footer className="tony-footer">Made with react &amp; Culo</footer>
        </div>
    );
}
