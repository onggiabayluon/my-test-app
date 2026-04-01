import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { ClassInsert } from "@/lib/types/lms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");

  const supabase = await createClient();
  let query = supabase.from("classes").select("*").order("time_slot");

  if (day) {
    query = query.eq("day_of_week", day);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: ClassInsert = await request.json();

  if (!body.name || !body.subject || !body.day_of_week || !body.time_slot || !body.teacher_name) {
    return NextResponse.json({ error: "name, subject, day_of_week, time_slot, and teacher_name are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .insert({
      name: body.name,
      subject: body.subject,
      day_of_week: body.day_of_week,
      time_slot: body.time_slot,
      teacher_name: body.teacher_name,
      max_students: body.max_students ?? 20,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
