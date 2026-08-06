// TODO: pastikan pakai file logo final dari saya
// Komponen Logo terpusat — dipakai di Navbar, Footer, Sidebar, Login, Preloader
"use client";

import Image from "next/image";
import { clsx } from "clsx";

interface LogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-3xl" },
};

export default function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={clsx("flex items-center gap-2.5 shrink-0", className)}>
      {/* Logo image — fallback ke placeholder hijau kalau file belum ada */}
      <div
        className="relative rounded-lg overflow-hidden bg-brand-green flex items-center justify-center"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/pirotechlogo.png"
          alt="PiRoTech Logo"
          width={s.icon}
          height={s.icon}
          className="object-contain dark:brightness-110"
          // Jika file belum ada, Image akan error — fallback di bawah
          onError={(e) => {
            // Hide broken image, show fallback text
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback letter jika gambar belum ada */}
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm pointer-events-none">
          P
        </span>
      </div>

      {variant === "full" && (
        <span className={clsx("font-bold tracking-tight text-brand-green700", s.text)}>
          PiRoTech
        </span>
      )}
    </div>
  );
}
