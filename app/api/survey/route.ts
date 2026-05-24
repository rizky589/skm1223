import { NextResponse } from "next/server";
import { surveySchema } from "@/lib/survey-schema";
import { createServiceSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = surveySchema.parse(body);
    const supabase = createServiceSupabase();

    const { error } = await supabase.from("survey_responses").insert({
      ...payload,
      nama: payload.nama || null,
      saran: payload.saran || null
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Payload tidak valid" },
      { status: 400 }
    );
  }
}
