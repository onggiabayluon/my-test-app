import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { BoardInsert } from "@/lib/types/database";

// TASK-004 — POST /api/boards
export async function POST(request: NextRequest) {
  const body: BoardInsert = await request.json();

  if (!body.name || body.name.trim() === "") {
    return NextResponse.json(
      { error: "Board name is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .insert({ name: body.name, description: body.description ?? null })
    .select()
    .single();

  if (boardError) {
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 },
    );
  }

  // Seed 4 default tasks using the database function
  const { error: seedError } = await supabase.rpc("seed_default_tasks", {
    board_id: board.id,
  });

  if (seedError) {
    return NextResponse.json(
      { error: "Board created but failed to seed default tasks" },
      { status: 500 },
    );
  }

  return NextResponse.json({ boardId: board.id }, { status: 201 });
}
