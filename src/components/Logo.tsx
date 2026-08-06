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
  sm: { width: 100, height: 40 },
  md: { width: 160, height: 60 },
  lg: { width: 240, height: 80 },
};

export default function Logo({ size = "md", className }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={clsx("flex items-center shrink-0", className)}>
      {/* Logo image */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: s.width, height: s.height }}
      >
        <Image
          src="/pirotechlogo.png"
          alt="PiRoTech Logo"
          fill
          className="object-contain dark:brightness-110"
        />
      </div>
    </div>
  );
}
