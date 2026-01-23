// @ts-ignore
import { Link } from "react-router-dom";
import "./css/Home.css";
import { useEffect, useState } from "react";
import { getPlayerName, setPlayerName } from "../utils/playerName";

export default function Home() {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(getPlayerName());
    }, []);

    function handleSave() {
        if (name.trim().length > 0) {
            setPlayerName(name.trim());
            alert("Nome salvato!");
        }
    }

    return (
        <div className="home">
            <h1 className="title">Jump Higher</h1>
            <p className="subtitle">Un gioco di piattaforme infinito</p>
            <div className="card">
                <div className="actions">
                    <Link to="/game" className="btn primary">
                        Gioca
                    </Link>
                    <Link to="/leaderboard" className="btn secondary">
                        Leaderboard
                    </Link>
                </div>
            </div>
            <div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Inserisci il tuo nome"
                />
                <button onClick={handleSave}>Salva Nome</button>
            </div>
        </div>
        
    );
}
