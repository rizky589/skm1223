"use client";

import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Controller, type Control, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveyQuestions } from "@/lib/questions";
import { surveySchema, type SurveyPayload } from "@/lib/survey-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const selectOptions = {
  pendidikan: ["SD Kebawah", "SLTP / Sederajat", "SLTA / Sederajat", "D1 - D3", "S1", "S2", "S3"],
  pekerjaan: ["PNS / TNI / POLRI", "Pegawai Swasta", "Wiraswasta / Pengusaha", "Pelajar / Mahasiswa", "Lainnya"],
  layanan: [
    "Perpustakaan / Konsultasi Statistik",
    "Penjualan Publikasi / Data Mikro",
    "Rekomendasi Kegiatan Statistik"
  ]
};

export function SurveyForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SurveyPayload>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      nama: "",
      email: "",
      no_hp: "",
      saran: ""
    }
  });

  const onSubmit = async (values: SurveyPayload) => {
    try {
      await axios.post("/api/survey", values);
      toast.success("Terimakasih jawaban anda telah tersimpan.");
      reset();
    } catch (error) {
      toast.error("Survei belum terkirim. Periksa koneksi atau konfigurasi Supabase.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl"
    >
      <Button asChild variant="outline" className="mb-5">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </Button>

      <div className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600"></p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Kuesioner SKM</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              Nilai setiap unsur pelayanan dari 1 sampai 10. Data digunakan untuk peningkatan mutu layanan.
            </p>
          </div>
          
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/55 p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-black text-slate-950">Data Responden</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nama Lengkap" error={errors.nama?.message}>
                <Input placeholder="Masukkan nama Anda" {...register("nama")} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" placeholder="nama@email.com" {...register("email")} />
              </Field>
              <Field label="No. Handphone / WhatsApp" error={errors.no_hp?.message}>
                <Input placeholder="081234567890" {...register("no_hp")} />
              </Field>
              <Field label="Jenis Kelamin" error={errors.jenis_kelamin?.message}>
                <Controller
                  control={control}
                  name="jenis_kelamin"
                  render={({ field }) => (
                    <RadioGroup className="grid grid-cols-2 gap-3" onValueChange={field.onChange} value={field.value}>
                      {["Laki-laki", "Perempuan"].map((value) => (
                        <Label key={value} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 shadow-sm">
                          <RadioGroupItem value={value} />
                          {value}
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </Field>
              <SelectField name="pendidikan" label="Pendidikan Terakhir" options={selectOptions.pendidikan} control={control} error={errors.pendidikan?.message} />
              <SelectField name="pekerjaan" label="Pekerjaan Utama" options={selectOptions.pekerjaan} control={control} error={errors.pekerjaan?.message} />
              <div className="md:col-span-2">
                <SelectField name="jenis_layanan" label="Jenis Layanan yang Diterima" options={selectOptions.layanan} control={control} error={errors.jenis_layanan?.message} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/55 p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-black text-slate-950">Penilaian Kualitas Pelayanan</h2>
            <div className="mt-6 space-y-5">
              {surveyQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.025, 0.25) }}
                  className="premium-card-hover rounded-[1.5rem] border border-slate-200 bg-white/75 p-4 shadow-sm"
                >
                  <Label className="leading-6">{index + 1}. {question.text}</Label>
                  <Controller
                    control={control}
                    name={question.id}
                    render={({ field }) => (
                      <RadioGroup
                        className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10"
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : undefined}
                      >
                        {Array.from({ length: 10 }, (_, ratingIndex) => {
                          const value = String(ratingIndex + 1);
                          return (
                            <Label key={value} className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black shadow-sm transition hover:bg-sky-50 has-[[data-state=checked]]:border-sky-300 has-[[data-state=checked]]:bg-sky-300 has-[[data-state=checked]]:text-slate-950">
                              <RadioGroupItem value={value} className="sr-only" />
                              {value}
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    )}
                  />
                  {errors[question.id]?.message ? <p className="mt-2 text-xs font-bold text-red-200">Wajib pilih nilai 1-10</p> : null}
                </motion.div>
              ))}
            </div>
          </div>

          <Field label="Saran dan Masukan (Opsional)" error={errors.saran?.message}>
            <Textarea placeholder="Tuliskan saran Anda di sini..." {...register("saran")} />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" size="lg" variant="secure" disabled={isSubmitting} className="w-full rounded-3xl sm:w-auto">
              <Send className="h-5 w-5" />
              {isSubmitting ? "Mengirim..." : "Kirim Survei"}
            </Button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-bold text-red-200">{error}</p> : null}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  control,
  error
}: {
  name: "pendidikan" | "pekerjaan" | "jenis_layanan";
  label: string;
  options: string[];
  control: Control<SurveyPayload>;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}
