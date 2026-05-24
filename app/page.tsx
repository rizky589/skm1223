import Link from "next/link";
import { ArrowRight, Building2, Clock3, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { AnimatedShell } from "@/components/animated-shell";
import { Button } from "@/components/ui/button";
import { getSurveyStats } from "@/lib/survey-service";

const statCards = [
  { key: "avg_total", label: "Rata-rata Keseluruhan", icon: ShieldCheck },
  { key: "avg_prosedur", label: "Prosedur Pelayanan", icon: FileCheck2 },
  { key: "avg_waktu", label: "Waktu Penyelesaian", icon: Clock3 },
  { key: "avg_sarana", label: "Sarana & Prasarana", icon: Building2 }
] as const;

export default async function HomePage() {
  const stats = await getSurveyStats();

  return (
    <AnimatedShell>
      <section className="flex justify-center py-4 text-center lg:py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center space-y-7">
          <div className="space-y-5">
            <h1 className="max-w-full bg-gradient-to-r from-white via-sky-100 to-orange-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-sm sm:text-5xl lg:whitespace-nowrap lg:text-6xl xl:text-7xl">
              Survei Kepuasan Masyarakat
            </h1>
            <p className="mx-auto max-w-3xl text-base font-semibold leading-8 text-sky-50/82 sm:text-lg">
              Klik Mulai untuk mengisi Survei Kepuasan Masyarakat terhadap Layanan BPS Kabupaten Labuhanbatu Utara.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-3xl">
              <Link href="/survey">
                Mulai Survei
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Ringkasan kepuasan publik</h2>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/25 bg-white/14 px-4 py-3 text-sm font-bold text-white shadow-sm backdrop-blur">
            <UsersRound className="h-5 w-5 text-emerald-500" />
            {stats.total_responden} responden
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="glass premium-card-hover rounded-[2rem] p-5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-sky-100 text-[#0b2a5b]">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-600">{item.label}</p>
                <p className="mt-2 text-4xl font-black text-slate-950">{stats[item.key]}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">dari 10.00</p>
              </div>
            );
          })}
        </div>
      </section>
    </AnimatedShell>
  );
}
