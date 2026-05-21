import { supabase } from "./supabaseClient";

export type ScoreItem = {
  id?: string;
  name: string;
  score: number;
  createdAt: string;
};

type SupabaseScoreRow = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};

export async function getTopScores(limit = 10): Promise<ScoreItem[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("id, player_name, score, created_at")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    throw new Error("Errore nel caricamento della leaderboard");
  }

  return (data as SupabaseScoreRow[]).map((item) => ({
    id: item.id,
    name: item.player_name,
    score: item.score,
    createdAt: item.created_at,
  }));
}

export async function postScore(item: Omit<ScoreItem, "id">): Promise<void> {
  const cleanName = item.name.trim().slice(0, 20);
  const cleanScore = Math.floor(item.score);

  if (!cleanName) {
    throw new Error("Nome giocatore non valido");
  }

  const { error } = await supabase.from("scores").insert({
    player_name: cleanName,
    score: cleanScore,
    created_at: item.createdAt,
  });

  if (error) {
    console.error(error);
    throw new Error("Errore nel salvataggio del punteggio");
  }
}