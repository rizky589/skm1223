export type SurveyStats = {
  avg_prosedur: string;
  avg_waktu: string;
  avg_sarana: string;
  avg_total: string;
  total_responden: number;
};

export type SurveyResponse = {
  id: string;
  created_at: string;
  nama: string | null;
  email: string;
  no_hp: string;
  jenis_kelamin: string;
  pendidikan: string;
  pekerjaan: string;
  jenis_layanan: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  saran: string | null;
};
