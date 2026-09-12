"use client";

import { Bell, Search, User, Menu, Info, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/useRole";
import { listenToNotifications, NotificationData } from "@/lib/firebaseUtils";

// Fungsi format waktu yang lalu
function timeSince(date: number) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun yang lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan yang lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari yang lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam yang lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit yang lalu";
  return Math.floor(seconds) + " detik yang lalu";
}

export default function Topbar({ onMenuClick = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { user, username, isAdmin } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // wait until auth state is loaded
    
    // Ambil 3 notifikasi terakhir, filter sesuai role
    const unsubscribe = listenToNotifications(3, user?.uid, !!isAdmin, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const menuItems = [
    { label: "Overview", href: "/overview" },
    { label: "Dashboard Monitoring", href: "/dashboard" },
    { label: "Log Activity", href: "/log-activity" },
    { label: "Pengaturan", href: "/pengaturan" },
    { label: "Notifikasi", href: "/notifikasi" },
  ];

  const filteredMenus = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "critical": return <Flame className="w-4 h-4 text-red-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-brand-green" />;
      default: return <Info className="w-4 h-4 text-brand-sage" />;
    }
  };

  const getNotifColor = (type: string) => {
    switch (type) {
      case "info": return "text-blue-600";
      case "warning": return "text-amber-700";
      case "critical": return "text-red-700";
      case "success": return "text-brand-green";
      default: return "text-brand-sage";
    }
  };

  const getNotifStyle = (type: string) => {
    switch (type) {
      case "warning": return "bg-amber-50/80 hover:bg-amber-100/80";
      case "critical": return "bg-red-50/80 hover:bg-red-100/80";
      default: return "hover:bg-brand-green50/50";
    }
  };

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

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-brand-sage hover:text-brand-green700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card-bg" />
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-card-border bg-input-bg/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-brand-green700">Notifikasi Terbaru</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 border-b border-card-border/50 transition-colors ${getNotifStyle(notif.type)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {getNotifIcon(notif.type)}
                        <p className={`text-xs font-bold ${getNotifColor(notif.type)}`}>{notif.title}</p>
                      </div>
                      <p className={`text-xs leading-relaxed ml-6 ${notif.type === 'warning' || notif.type === 'critical' ? 'text-foreground font-medium' : 'text-brand-sage'}`}>{notif.message}</p>
                      <p className={`text-[10px] mt-1 ml-6 ${notif.type === 'warning' || notif.type === 'critical' ? 'text-foreground/70' : 'text-brand-sage/70'}`}>{timeSince(notif.timestamp)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs text-brand-sage">Belum ada notifikasi.</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-card-border bg-input-bg/30 text-center">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    router.push('/notifikasi');
                  }}
                  className="text-xs font-semibold text-brand-green hover:text-brand-green700 transition-colors w-full p-2"
                >
                  Lihat Semua Aktivitas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-card-border hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-brand-green700">
                {username || (user?.email ? user.email.split('@')[0] : null) || `User_${user?.uid?.substring(0, 4) || '1234'}`}
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
