"use client";

import { Bell, Search, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="h-16 bg-card-bg border-b border-card-border flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-full bg-input-bg border border-transparent focus:border-card-border focus:bg-card-bg rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="relative text-brand-sage hover:text-brand-green700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card-bg" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-card-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-brand-green700">
              Admin PiRoTech
            </p>
            <p className="text-xs text-brand-sage">admin@pirotech.id</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-green50 flex items-center justify-center text-brand-green border border-brand-green/20">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
