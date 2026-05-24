"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/survey", label: "Isi Survei" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const open = useUiStore((state) => state.mobileMenuOpen);
  const setOpen = useUiStore((state) => state.setMobileMenuOpen);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/25 bg-white/72 pt-[env(safe-area-inset-top)] shadow-sm shadow-slate-950/10 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-15 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-0">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center">
            <Image
              src="/bps.png"
              alt="Logo BPS"
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="leading-tight -translate-x-2">
            <span className="block text-xs font-black text-[#0b2a5b] sm:text-xs"> <i> Badan Pusat Statistik </i></span>
            <span className="block text-xs font-black text-[#0b2a5b] sm:text-xs"> <i> Kabupaten Labuhanbatu Utara </i></span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="rounded-xl">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button asChild variant="outline" className="ml-2">
            <Link href="/login">
              <LockKeyhole className="h-4 w-4" />
              Login Admin
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Buka menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-slate-200/70 bg-white/90 shadow-xl backdrop-blur-2xl md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className="flex rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/login"
                className="mt-2 flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                Login Admin
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
