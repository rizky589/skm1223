"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabase } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error("Login gagal. Periksa email dan password admin.");
        return;
      }

      toast.success("Login admin berhasil.");
      router.push("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Konfigurasi Supabase belum siap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center"
    >
      <Button asChild variant="outline" className="mb-5 w-fit">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Beranda
        </Link>
      </Button>

      <div className="glowing-login-box">
        <div className="glowing-login-inner p-6 sm:p-8">
          <div className="relative mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300"></p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.12em] text-white">
                Login <span className="text-sky-300 drop-shadow-[0_0_14px_rgba(56,189,248,0.75)]">Admin</span>
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/85">Email Admin</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bps.go.id"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border-white/35 bg-white/10 text-white placeholder:text-white/45 focus:border-sky-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/85">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-white/35 bg-white/10 text-white placeholder:text-white/45 focus:border-sky-300"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-3xl shadow-sky-400/20 hover:shadow-sky-300/40" disabled={loading}>
              <LockKeyhole className="h-5 w-5" />
              {loading ? "Memverifikasi..." : "Masuk Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
