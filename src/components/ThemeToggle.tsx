"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-xl bg-card-bg border border-card-border flex items-center justify-center" aria-label="Toggle theme">
        <Sun className="w-4 h-4 text-brand-sage" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-xl bg-card-bg border border-card-border flex items-center justify-center hover:bg-brand-green50 hover:border-brand-green/30 transition-all duration-200 cursor-pointer group"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-brand-sage group-hover:text-brand-green transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-brand-sage group-hover:text-brand-green transition-colors" />
      )}
    </button>
  );
}
