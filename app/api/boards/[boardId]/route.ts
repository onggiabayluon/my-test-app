import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { BoardUpdate } from "@/lib/types/database";

// TASK-003 — GET /api/boards/[boardId]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> },
) {
  const { boardId } = await params;
  const supabase = await createClient();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .single();

  if (boardError) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (tasksError) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ...board, tasks });
}

// TASK-005 — PUT /api/boards/[boardId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> },
) {
  const { boardId } = await params;
  const body: BoardUpdate = await request.json();

  if (body.name !== undefined && body.name.trim() === "") {
    return NextResponse.json(
      { error: "Board name cannot be empty" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("boards")
    .update(body)
    .eq("id", boardId)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Board not found or update failed" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}
