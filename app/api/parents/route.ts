import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { ParentInsert } from "@/lib/types/lms";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch parents" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: ParentInsert = await request.json();

  if (!body.name || body.name.trim() === "") {
    return NextResponse.json({ error: "Parent name is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parents")
    .insert({ name: body.name, phone: body.phone ?? null, email: body.email ?? null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create parent" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
