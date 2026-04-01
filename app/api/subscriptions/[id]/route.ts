import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, student:students(name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    remaining_sessions: data.total_sessions - data.used_sessions,
    is_active: data.end_date >= new Date().toISOString().split("T")[0],
  });
}
