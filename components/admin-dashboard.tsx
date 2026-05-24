"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, LogOut, Pencil, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ratingKeys } from "@/lib/questions";
import { createBrowserSupabase } from "@/lib/supabase";
import type { SurveyResponse } from "@/lib/types";

export function AdminDashboard() {
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [editing, setEditing] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadResponses() {
      try {
        const supabase = createBrowserSupabase();
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          router.replace("/login");
          return;
        }

        const result = await axios.get<{ responses: SurveyResponse[] }>("/api/responses", {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });

        setResponses(result.data.responses);
      } catch (error) {
        toast.error("Gagal memuat dashboard admin.");
      } finally {
        setLoading(false);
      }
    }

    loadResponses();
  }, [router]);

  const totalAverage = useMemo(() => {
    if (responses.length === 0) return "0.0";
    const total = responses.reduce((sum, response) => {
      return sum + ratingKeys.reduce((rowSum, key) => rowSum + response[key], 0) / ratingKeys.length;
    }, 0);

    return (total / responses.length).toFixed(1);
  }, [responses]);

  const handleLogout = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    toast.success("Anda telah logout.");
    router.push("/");
  };

  const getAuthHeaders = async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.replace("/login");
      throw new Error("Sesi admin berakhir.");
    }

    return { Authorization: `Bearer ${data.session.access_token}` };
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editing) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      nama: String(formData.get("nama") || "") || null,
      email: String(formData.get("email") || ""),
      no_hp: String(formData.get("no_hp") || ""),
      pekerjaan: String(formData.get("pekerjaan") || ""),
      jenis_layanan: String(formData.get("jenis_layanan") || ""),
      saran: String(formData.get("saran") || "") || null
    };

    try {
      setSaving(true);
      const result = await axios.patch<{ response: SurveyResponse }>(`/api/responses/${editing.id}`, payload, {
        headers: await getAuthHeaders()
      });
      setResponses((items) => items.map((item) => (item.id === editing.id ? result.data.response : item)));
      setEditing(null);
      toast.success("Data responden berhasil diperbarui.");
    } catch (error) {
      toast.error("Gagal memperbarui data responden.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (response: SurveyResponse) => {
    const confirmed = window.confirm(`Hapus data ${response.nama || "Anonim"}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`/api/responses/${response.id}`, {
        headers: await getAuthHeaders()
      });
      setResponses((items) => items.filter((item) => item.id !== response.id));
      toast.success("Data responden berhasil dihapus.");
    } catch (error) {
      toast.error("Gagal menghapus data responden.");
    }
  };

  const exportCsv = () => {
    const header = ["Tanggal", "Nama", "Email", "No HP", "Pekerjaan", "Layanan", "Rata-rata", "Saran"];
    const rows = responses.map((response) => [
      response.created_at,
      response.nama ?? "Anonim",
      response.email,
      response.no_hp,
      response.pekerjaan,
      response.jenis_layanan,
      averageScore(response),
      response.saran ?? ""
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "respon-skm.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="outline" className="mb-4 w-fit">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Beranda
            </Link>
          </Button>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300"></p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Dashboard Admin SKM</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={exportCsv} disabled={!responses.length}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button type="button" variant="secure" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total Responden" value={String(responses.length)} />
        <Metric label="Rata-rata Nilai" value={totalAverage} />
        <Metric label="Status Sistem" value={loading ? "Loading" : "Aktif"} />
      </div>

      <div className="glass overflow-hidden rounded-[2rem]">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-sm font-bold text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Data responden hanya tersedia untuk admin terautentikasi
        </div>
        <div className="grid gap-3 p-3 md:hidden">
          {loading ? (
            <p className="px-3 py-8 text-center text-sm font-bold text-slate-500">Memuat data...</p>
          ) : responses.length ? (
            responses.map((response) => (
                <article key={response.id} className="premium-card-hover rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-slate-950">{response.nama || "Anonim"}</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">{response.pekerjaan}</p>
                  </div>
                  <span className="shrink-0 rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-700">
                    {averageScore(response)}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-600">{response.jenis_layanan}</p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-500">{response.saran || "-"}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditing(response)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleDelete(response)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="px-3 py-8 text-center text-sm font-bold text-slate-500">Belum ada data kuesioner.</p>
          )}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Tanggal</th>
                <th className="px-5 py-4">Nama / Pekerjaan</th>
                <th className="px-5 py-4">Layanan</th>
                <th className="px-5 py-4">Rata-rata</th>
                <th className="px-5 py-4">Saran</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-bold text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : responses.length ? (
                responses.map((response) => (
                  <tr key={response.id} className="border-t border-slate-200 transition hover:bg-sky-50/70">
                    <td className="px-5 py-4 font-semibold text-slate-600">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(response.created_at))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-950">{response.nama || "Anonim"}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">{response.pekerjaan}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{response.jenis_layanan}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-2xl bg-emerald-100 px-3 py-2 font-black text-emerald-700">
                        {averageScore(response)} / 10
                      </span>
                    </td>
                    <td className="max-w-sm px-5 py-4 font-medium text-slate-600">
                      <span className="line-clamp-2">{response.saran || "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setEditing(response)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(response)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-bold text-slate-500">
                    Belum ada data kuesioner.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[80] flex items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
          <motion.form
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleUpdate}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Edit responden</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Perbarui Data SKM</h2>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setEditing(null)} aria-label="Tutup edit">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EditField label="Nama" name="nama" defaultValue={editing.nama ?? ""} />
              <EditField label="Email" name="email" type="email" defaultValue={editing.email} />
              <EditField label="No HP" name="no_hp" defaultValue={editing.no_hp} />
              <EditField label="Pekerjaan" name="pekerjaan" defaultValue={editing.pekerjaan} />
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-800" htmlFor="jenis_layanan">Jenis Layanan</label>
                <input
                  id="jenis_layanan"
                  name="jenis_layanan"
                  defaultValue={editing.jenis_layanan}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/20"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-800" htmlFor="saran">Saran</label>
                <textarea
                  id="saran"
                  name="saran"
                  defaultValue={editing.saran ?? ""}
                  rows={4}
                  className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/20"
                />
              </div>
            </div>

            <div className="sticky bottom-0 mt-6 flex flex-col gap-3 bg-white/95 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </motion.form>
        </div>
      ) : null}
    </motion.section>
  );
}

function EditField({
  label,
  name,
  defaultValue,
  type = "text"
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-800" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/20"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass premium-card-hover rounded-[1.75rem] p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function averageScore(response: SurveyResponse) {
  const score = ratingKeys.reduce((total, key) => total + response[key], 0) / ratingKeys.length;
  return score.toFixed(1);
}
