import { ratingKeys } from "@/lib/questions";
import { createServiceSupabase, hasSupabaseConfig } from "@/lib/supabase";
import type { SurveyResponse, SurveyStats } from "@/lib/types";

export const emptyStats: SurveyStats = {
  avg_prosedur: "0.00",
  avg_waktu: "0.00",
  avg_sarana: "0.00",
  avg_total: "0.00",
  total_responden: 0
};

export function calculateStats(responses: SurveyResponse[]): SurveyStats {
  const count = responses.length;

  if (count === 0) {
    return emptyStats;
  }

  const average = (key: keyof SurveyResponse) =>
    responses.reduce((total, response) => total + Number(response[key] ?? 0), 0) / count;

  const sumAll = responses.reduce((total, response) => {
    return total + ratingKeys.reduce((rowTotal, key) => rowTotal + Number(response[key]), 0);
  }, 0);

  return {
    avg_prosedur: average("q2").toFixed(2),
    avg_waktu: average("q3").toFixed(2),
    avg_sarana: average("q6").toFixed(2),
    avg_total: (sumAll / (count * ratingKeys.length)).toFixed(2),
    total_responden: count
  };
}

export async function getSurveyResponses() {
  if (!hasSupabaseConfig()) {
    return [] as SurveyResponse[];
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SurveyResponse[];
}

export async function getSurveyStats() {
  try {
    const responses = await getSurveyResponses();
    return calculateStats(responses);
  } catch {
    return emptyStats;
  }
}
