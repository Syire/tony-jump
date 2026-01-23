const BASE_URL = "http://localhost:3001";

export type ScoreItem = {
    id?: number;
    name: string;
    score: number;
    createdAt: string;
};

export async function getTopScores(limit = 10): Promise<ScoreItem[]> {
    const res = await fetch(`${BASE_URL}/scores`);
    if (!res.ok) throw new Error("Errore nel caricamento leaderboard");

    const data: ScoreItem[] = await res.json();

    return data
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}


export async function postScore(item: Omit<ScoreItem, "id">): Promise<ScoreItem> {
    const res = await fetch(`${BASE_URL}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Errore nel salvataggio punteggio");
    return res.json();
}
