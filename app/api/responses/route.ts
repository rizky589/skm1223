import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase";
import { getSurveyResponses } from "@/lib/survey-service";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const responses = await getSurveyResponses();
    return NextResponse.json({ responses });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Gagal membaca data" },
      { status: 500 }
    );
  }
}
