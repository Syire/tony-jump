import { supabase } from "./supabaseClient";

export type ScoreItem = {
  id?: string;
  playerId?: string;
  name: string;
  score: number;
  createdAt: string;
};

type SupabaseScoreRow = {
  id: string;
  player_id: string | null;
  player_name: string;
  score: number;
  created_at: string;
};

export async function getTopScores(limit?: number): Promise<ScoreItem[]> {
  let query = supabase
    .from("scores")
    .select("id, player_id, player_name, score, created_at")
    .order("score", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Errore nel caricamento leaderboard");
  }

  return ((data ?? []) as SupabaseScoreRow[]).map((item) => ({
    id: item.id,
    playerId: item.player_id ?? undefined,
    name: item.player_name,
    score: item.score,
    createdAt: item.created_at,
  }));
}

export async function getTakenPlayerNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("player_name");

  if (error) {
    console.error(error);
    throw new Error("Errore nel caricamento dei nomi giocatore");
  }

  return Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.player_name)
        .filter(Boolean)
    )
  );
}

export async function postScore(item: Omit<ScoreItem, "id">): Promise<void> {
  const cleanName = item.name.trim().slice(0, 20);
  const cleanScore = Math.floor(item.score);

  if (!item.playerId) {
    throw new Error("Player ID mancante");
  }

  if (!cleanName) {
    throw new Error("Nome giocatore non valido");
  }

  const { data: existingScore, error: readError } = await supabase
    .from("scores")
    .select("id, score")
    .eq("player_id", item.playerId)
    .maybeSingle();

  if (readError) {
    console.error(readError);
    throw new Error("Errore nel controllo del punteggio esistente");
  }

  if (existingScore) {
    if (cleanScore <= existingScore.score) {
      return;
    }

    const { error } = await supabase
      .from("scores")
      .update({
        player_name: cleanName,
        score: cleanScore,
        created_at: item.createdAt,
      })
      .eq("id", existingScore.id);

    if (error) {
      console.error(error);
      throw new Error("Errore nell'aggiornamento del punteggio");
    }

    return;
  }

  const { error } = await supabase.from("scores").insert({
    player_id: item.playerId,
    player_name: cleanName,
    score: cleanScore,
    created_at: item.createdAt,
  });

  if (error) {
    console.error(error);
    throw new Error("Errore nel salvataggio del punteggio");
  }
}