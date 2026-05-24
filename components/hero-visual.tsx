"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

export function HeroVisual() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".pulse-line", {
        opacity: 0.45,
        yoyo: true,
        repeat: -1,
        duration: 1.8,
        stagger: 0.2,
        ease: "sine.inOut"
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="relative mt-6 h-48 overflow-hidden rounded-[2rem] border border-white/16 bg-slate-950/35 p-4 soft-glow sm:h-60 lg:mt-0">
      <Image
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"
        alt="Latar kantor pelayanan"
        fill
        sizes="(min-width: 1024px) 48vw, 100vw"
        className="object-cover opacity-20 blur-[2px]"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative grid h-full grid-cols-3 gap-3">
        {[88, 74, 94].map((value, index) => (
          <div key={value} className="flex flex-col justify-end rounded-3xl bg-white/10 p-3">
            <div className="pulse-line rounded-2xl bg-gradient-to-t from-emerald-400 to-sky-300" style={{ height: `${value}%` }} />
            <div className="mt-3 text-center text-xs font-black text-white/80">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
