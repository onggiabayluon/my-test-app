import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch registration
  const { data: registration, error: fetchError } = await supabase
    .from("class_registrations")
    .select("*, class:classes(*)")
    .eq("id", id)
    .single();

  if (fetchError || !registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  // Determine if cancellation is > 24h before (use registered_at as proxy for class time)
  const registeredAt = new Date(registration.registered_at);
  const hoursSinceRegistration = (Date.now() - registeredAt.getTime()) / (1000 * 60 * 60);
  const shouldRefund = hoursSinceRegistration < 24;

  // Delete the registration
  const { error: deleteError } = await supabase
    .from("class_registrations")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to cancel registration" }, { status: 500 });
  }

  // Refund 1 session if cancelled within 24h of registration
  if (shouldRefund) {
    const today = new Date().toISOString().split("T")[0];
    const { data: activeSubs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("student_id", registration.student_id)
      .gte("end_date", today)
      .gt("used_sessions", 0)
      .order("end_date", { ascending: true })
      .limit(1);

    if (activeSubs && activeSubs.length > 0) {
      const sub = activeSubs[0];
      await supabase
        .from("subscriptions")
        .update({ used_sessions: sub.used_sessions - 1 })
        .eq("id", sub.id);
    }
  }

  return NextResponse.json({
    message: shouldRefund
      ? "Registration cancelled and 1 session refunded"
      : "Registration cancelled (no refund — cancelled after 24h)",
  });
}
