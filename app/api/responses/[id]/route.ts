import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase";

const responseUpdateSchema = z.object({
  nama: z.string().trim().max(100).nullable().optional(),
  email: z.string().trim().email().optional(),
  no_hp: z.string().trim().min(8).max(20).optional(),
  pekerjaan: z.string().trim().min(1).optional(),
  jenis_layanan: z.string().trim().min(1).optional(),
  saran: z.string().trim().max(1200).nullable().optional()
});

async function authorize(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return false;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  return !error && Boolean(data.user);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = responseUpdateSchema.parse(await request.json());
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("survey_responses")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ response: data });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Payload tidak valid" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceSupabase();
  const { error } = await supabase.from("survey_responses").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
