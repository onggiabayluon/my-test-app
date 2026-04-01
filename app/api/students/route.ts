import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { StudentInsert } from "@/lib/types/lms";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, parent:parents(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: StudentInsert = await request.json();

  if (!body.name || body.name.trim() === "") {
    return NextResponse.json({ error: "Student name is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      name: body.name,
      dob: body.dob ?? null,
      gender: body.gender ?? null,
      current_grade: body.current_grade ?? null,
      parent_id: body.parent_id ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
