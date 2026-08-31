"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/useRole";

export default function Topbar({ onMenuClick = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAdmin } = useRole();
  const router = useRouter();

  const menuItems = [
    { label: "Overview", href: "/overview" },
    { label: "Dashboard Monitoring", href: "/dashboard" },
    { label: "Log Activity", href: "/log-activity" },
    { label: "Pengaturan", href: "/pengaturan" },
  ];

  const filteredMenus = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-card-bg border-b border-card-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      
      {/* Mobile Hamburger & Search Bar Container */}
      <div className="flex flex-1 items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-brand-sage hover:text-brand-green700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
          <input
            type="text"
            placeholder="Cari menu tujuan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full bg-input-bg border border-transparent focus:border-card-border focus:bg-card-bg rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Dropdown Results */}
        {showResults && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden z-50">
            {filteredMenus.length > 0 ? (
              <ul className="py-2">
                {filteredMenus.map((menu) => (
                  <li key={menu.href}>
                    <button
                      onClick={() => {
                        router.push(menu.href);
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-sage hover:bg-brand-green50 hover:text-brand-green700 transition-colors"
                    >
                      {menu.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-brand-sage text-center">
                Menu tidak ditemukan
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="relative text-brand-sage hover:text-brand-green700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card-bg" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-card-border hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-brand-green700">
                {user?.displayName || "Pengguna PiRoTech"}
              </p>
              <p className="text-xs text-brand-sage">{user?.email || "Memuat..."}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-green50 flex items-center justify-center text-brand-green border border-brand-green/20">
              <User className="w-4 h-4" />
            </div>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    router.push("/profil");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-brand-sage hover:bg-brand-green50 hover:text-brand-green700 transition-colors"
                >
                  Profil Saya
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      router.push("/profil?tab=pengguna");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-brand-sage hover:bg-brand-green50 hover:text-brand-green700 transition-colors"
                  >
                    Kelola Pengguna
                  </button>
                )}
                <div className="h-px bg-card-border my-1" />
                <button
                  onClick={async () => {
                    const { auth } = await import("@/lib/firebase");
                    const { signOut } = await import("firebase/auth");
                    try {
                      await signOut(auth);
                      window.location.href = "/";
                    } catch (error) {
                      console.error("Gagal logout:", error);
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
