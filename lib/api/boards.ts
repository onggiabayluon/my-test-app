import { createClient } from "@/lib/supabase/client";
import type { Board, BoardInsert, BoardUpdate } from "@/lib/types/database";

const supabase = createClient();

export async function getBoards(): Promise<Board[]> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBoard(id: string): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBoard(board: BoardInsert): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert(board)
    .select()
    .single();

  if (error) throw error;

  // Seed default tasks for the new board
  const { error: seedError } = await supabase.rpc("seed_default_tasks", {
    board_id: data.id,
  });

  if (seedError) throw seedError;

  return data;
}

export async function updateBoard(
  id: string,
  updates: BoardUpdate,
): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBoard(id: string): Promise<void> {
  const { error } = await supabase.from("boards").delete().eq("id", id);

  if (error) throw error;
}
