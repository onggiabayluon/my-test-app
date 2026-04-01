import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// TASK-006 — POST /api/tasks
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.board_id) {
    return NextResponse.json(
      { error: "board_id is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      board_id: body.board_id,
      name: body.name ?? "New Task",
      icon: body.icon ?? "📝",
      status: "todo",
      description: body.description ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
