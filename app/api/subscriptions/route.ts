import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { SubscriptionInsert } from "@/lib/types/lms";

export async function POST(request: NextRequest) {
  const body: SubscriptionInsert = await request.json();

  if (!body.student_id || !body.package_name || !body.start_date || !body.end_date || !body.total_sessions) {
    return NextResponse.json(
      { error: "student_id, package_name, start_date, end_date, and total_sessions are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      student_id: body.student_id,
      package_name: body.package_name,
      start_date: body.start_date,
      end_date: body.end_date,
      total_sessions: body.total_sessions,
      used_sessions: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
