import { createClient } from "@supabase/supabase-js";

// Workaround for TypeScript error: Property 'env' does not exist on type 'ImportMeta'
// Cast import.meta to any to access Vite env variables without additional type declarations
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variabili Supabase mancanti");
}

export const supabase = createClient(supabaseUrl, supabaseKey);