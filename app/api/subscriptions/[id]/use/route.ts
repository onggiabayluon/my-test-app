import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sub, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !sub) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  if (sub.used_sessions >= sub.total_sessions) {
    return NextResponse.json({ error: "No sessions remaining" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  if (sub.end_date < today) {
    return NextResponse.json({ error: "Subscription has expired" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ used_sessions: sub.used_sessions + 1 })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to use session" }, { status: 500 });
  }

  return NextResponse.json({
    ...data,
    remaining_sessions: data.total_sessions - data.used_sessions,
  });
}
