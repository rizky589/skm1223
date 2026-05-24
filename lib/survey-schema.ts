import { z } from "zod";

const score = z.number().int().min(1).max(10);

export const surveySchema = z.object({
  nama: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Email tidak valid"),
  no_hp: z.string().trim().min(8, "Nomor handphone terlalu pendek").max(20),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    error: "Pilih jenis kelamin"
  }),
  pendidikan: z.string().min(1, "Pilih pendidikan terakhir"),
  pekerjaan: z.string().min(1, "Pilih pekerjaan utama"),
  jenis_layanan: z.string().min(1, "Pilih jenis layanan"),
  q1: score,
  q2: score,
  q3: score,
  q4: score,
  q5: score,
  q6: score,
  q7: score,
  q8: score,
  q9: score,
  q10: score,
  q11: score,
  q12: score,
  q13: score,
  q14: score,
  q15: score,
  saran: z.string().trim().max(1200).optional().or(z.literal(""))
});

export type SurveyPayload = z.infer<typeof surveySchema>;
