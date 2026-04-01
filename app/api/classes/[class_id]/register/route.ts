import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ class_id: string }> }
) {
  const { class_id } = await params;
  const { student_id } = await request.json();

  if (!student_id) {
    return NextResponse.json({ error: "student_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // 1. Fetch class info
  const { data: cls, error: clsError } = await supabase
    .from("classes")
    .select("*")
    .eq("id", class_id)
    .single();

  if (clsError || !cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  // 2. Check capacity
  const { count: enrolled } = await supabase
    .from("class_registrations")
    .select("id", { count: "exact", head: true })
    .eq("class_id", class_id);

  if ((enrolled ?? 0) >= cls.max_students) {
    return NextResponse.json({ error: "Class is full" }, { status: 400 });
  }

  // 3. Check time conflict: student already in a class on same day_of_week + same time_slot
  const { data: studentClasses } = await supabase
    .from("class_registrations")
    .select("class:classes!inner(day_of_week, time_slot)")
    .eq("student_id", student_id);

  const hasConflict = studentClasses?.some((r) => {
    const c = r.class as unknown as { day_of_week: string; time_slot: string };
    return c.day_of_week === cls.day_of_week && c.time_slot === cls.time_slot;
  });

  if (hasConflict) {
    return NextResponse.json(
      { error: `Student already has a class on ${cls.day_of_week} at ${cls.time_slot}` },
      { status: 400 }
    );
  }

  // 4. Check active subscription with remaining sessions
  const today = new Date().toISOString().split("T")[0];
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("student_id", student_id)
    .gte("end_date", today)
    .order("end_date", { ascending: true });

  const validSub = activeSubs?.find((s) => s.used_sessions < s.total_sessions);

  if (!validSub) {
    return NextResponse.json(
      { error: "Student has no active subscription with remaining sessions" },
      { status: 400 }
    );
  }

  // 5. Create registration
  const { data: registration, error: regError } = await supabase
    .from("class_registrations")
    .insert({ class_id, student_id })
    .select()
    .single();

  if (regError) {
    if (regError.code === "23505") {
      return NextResponse.json({ error: "Student is already registered in this class" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }

  // 6. Increment used_sessions on subscription
  await supabase
    .from("subscriptions")
    .update({ used_sessions: validSub.used_sessions + 1 })
    .eq("id", validSub.id);

  return NextResponse.json(registration, { status: 201 });
}
