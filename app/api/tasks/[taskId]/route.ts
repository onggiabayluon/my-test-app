import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { TaskUpdate } from "@/lib/types/database";

// TASK-007 — PUT /api/tasks/[taskId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const body: TaskUpdate = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(body)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Task not found or update failed" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

// TASK-008 — DELETE /api/tasks/[taskId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const supabase = await createClient();

  // Check if task exists first
  const { data: existing, error: findError } = await supabase
    .from("tasks")
    .select("id")
    .eq("id", taskId)
    .single();

  if (findError || !existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
