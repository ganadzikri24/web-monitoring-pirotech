"use client";

import { useEffect, useState } from "react";
import { listenToNotifications, NotificationData } from "@/lib/firebaseUtils";
import { Info, AlertTriangle, CheckCircle, Flame, Loader2, Bell, Trash2, Search, Filter } from "lucide-react";
import { useRole } from "@/lib/useRole";
import { ref, update } from "firebase/database";
import { db } from "@/lib/firebase";

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

function formatDate(ms: number) {
  const d = new Date(ms);
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAdmin, loading: roleLoading } = useRole();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter States for Admin
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (roleLoading || user === undefined) return;
    
    // Fetch up to 50 latest notifications for normal users, but 500 for admins to allow good filtering
    const limit = isAdmin ? 500 : 50;
    const unsubscribe = listenToNotifications(limit, user?.uid, user?.email, !!isAdmin, (data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, isAdmin, roleLoading]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "critical": return <Flame className="w-5 h-5 text-red-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-brand-green" />;
      default: return <Info className="w-5 h-5 text-brand-sage" />;
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLogs(filteredNotifications.map(n => n.id!));
    } else {
      setSelectedLogs([]);
    }
  };

  const toggleSelectLog = (id: string) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!isAdmin) return;
    if (!confirm(`Hapus ${selectedLogs.length} notifikasi terpilih?`)) return;

    setIsDeleting(true);
    try {
      const updates: Record<string, null> = {};
      selectedLogs.forEach(id => {
        updates[`notifications/${id}`] = null;
      });
      await update(ref(db), updates);
      setSelectedLogs([]);
    } catch (error) {
      console.error("Error deleting logs:", error);
      alert("Terjadi kesalahan saat menghapus notifikasi.");
    } finally {
      setIsDeleting(false);
      setIsSelectionMode(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (!isAdmin) return true;

    // Filter Type
    if (filterType !== "all" && notif.type !== filterType) return false;

    // Filter Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title?.toLowerCase().includes(q) || false;
      const matchMsg = notif.message?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchMsg) return false;
    }

    // Filter Date
    if (filterDate !== "all") {
      const now = new Date();
      const notifDate = new Date(notif.timestamp);
      
      if (filterDate === "today") {
        if (notifDate.toDateString() !== now.toDateString()) return false;
      } else if (filterDate === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (notifDate.toDateString() !== yesterday.toDateString()) return false;
      } else if (filterDate === "7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (notifDate < sevenDaysAgo) return false;
      } else if (filterDate === "30days") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (notifDate < thirtyDaysAgo) return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Riwayat Aktivitas</h1>
        <p className="text-brand-sage leading-relaxed">
          Pantau seluruh log notifikasi dan aktivitas yang terjadi di sistem.
        </p>
      </div>

      <div className="bg-card-bg rounded-2xl shadow-sm border border-card-border overflow-hidden flex flex-col">
        <div className="p-6 border-b border-card-border bg-input-bg/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-bold text-lg text-brand-green700 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Daftar Notifikasi
          </h2>
          
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors text-sm shadow-sm justify-center ${showFilters ? 'bg-brand-green text-white' : 'bg-input-bg hover:bg-input-border text-brand-sage'}`}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
              </button>
              
              {isSelectionMode ? (
                <>
                  <button 
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedLogs([]);
                    }}
                    className="flex items-center gap-2 bg-input-bg hover:bg-input-border text-brand-sage px-4 py-2 rounded-xl font-medium transition-colors text-sm shadow-sm justify-center"
                  >
                    Batal
                  </button>
                  {selectedLogs.length > 0 && (
                    <button 
                      onClick={handleDeleteSelected}
                      disabled={isDeleting}
                      className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2 rounded-xl font-medium transition-colors text-sm shadow-sm justify-center disabled:opacity-70"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? "Menghapus..." : `Hapus (${selectedLogs.length})`}
                    </button>
                  )}
                </>
              ) : (
                <button 
                  onClick={() => setIsSelectionMode(true)}
                  className="flex items-center gap-2 bg-input-bg hover:bg-input-border text-brand-sage px-4 py-2 rounded-xl font-medium transition-colors text-sm shadow-sm justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Log
                </button>
              )}
            </div>
          )}
        </div>

        {isAdmin && showFilters && (
          <div className="px-6 py-5 border-b border-card-border bg-card-bg flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-brand-sage mb-2 uppercase tracking-wider">Cari Akun / Aktivitas</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
                <input 
                  type="text" 
                  placeholder="Ketik email akun, jenis aktivitas..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-input-bg border border-input-border focus:border-brand-green rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="w-full md:w-56 shrink-0">
              <label className="block text-xs font-semibold text-brand-sage mb-2 uppercase tracking-wider">Jenis Log</label>
              <div className="relative">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-input-bg border border-input-border focus:border-brand-green rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Semua Jenis Log</option>
                  <option value="info">Info / Aktivitas (Biru)</option>
                  <option value="success">Sukses / Selesai (Hijau)</option>
                  <option value="warning">Peringatan / Warning (Kuning)</option>
                  <option value="critical">Kritis / Critical (Merah)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-brand-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-56 shrink-0">
              <label className="block text-xs font-semibold text-brand-sage mb-2 uppercase tracking-wider">Filter Waktu</label>
              <div className="relative">
                <select 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-input-bg border border-input-border focus:border-brand-green rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Semua Waktu</option>
                  <option value="today">Hari Ini</option>
                  <option value="yesterday">Kemarin</option>
                  <option value="7days">7 Hari Terakhir</option>
                  <option value="30days">30 Hari Terakhir</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-brand-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdmin && isSelectionMode && filteredNotifications.length > 0 && (
          <div className="px-6 py-3 border-b border-card-border bg-brand-green50/30 flex items-center gap-3">
            <input 
              type="checkbox" 
              onChange={handleSelectAll}
              checked={selectedLogs.length > 0 && selectedLogs.length === filteredNotifications.length}
              className="rounded border-input-border text-brand-green focus:ring-brand-green/20 w-4 h-4"
            />
            <span className="text-sm font-semibold text-brand-green700">Pilih Semua ({filteredNotifications.length} Data)</span>
          </div>
        )}

        <div className="divide-y divide-card-border flex-1">
          {loading || roleLoading ? (
            <div className="p-16 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelectLog(notif.id!);
                  } else if (notif.title === "Pembakaran Selesai") {
                    window.location.href = "/log-activity";
                  }
                }}
                className={`p-6 transition-colors flex gap-4 ${isSelectionMode || notif.title === "Pembakaran Selesai" ? "cursor-pointer" : ""} ${notif.title === "Pembakaran Selesai" && !isSelectionMode ? "hover:opacity-80" : ""} ${getNotifStyle(notif.type)}`}
              >
                {isAdmin && isSelectionMode && (
                  <div className="shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      checked={selectedLogs.includes(notif.id!)}
                      onChange={() => toggleSelectLog(notif.id!)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-input-border text-brand-green focus:ring-brand-green/20 w-4 h-4"
                    />
                  </div>
                )}
                <div className="shrink-0 mt-1">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-bold text-base ${getNotifColor(notif.type)}`}>
                      {notif.title}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-brand-sage bg-input-bg px-2.5 py-1 rounded-full border border-card-border">
                        {timeSince(notif.timestamp)}
                      </span>
                      <p className="text-[10px] text-brand-sage/60 mt-1.5">{formatDate(notif.timestamp)}</p>
                    </div>
                  </div>
                  <p className={`text-sm mt-1.5 leading-relaxed ${notif.type === 'warning' || notif.type === 'critical' ? 'text-foreground font-medium' : 'text-foreground'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-input-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-card-border">
                <Filter className="w-8 h-8 text-brand-sage/60" />
              </div>
              <h3 className="font-bold text-lg text-brand-green700 mb-1">Pencarian Tidak Ditemukan</h3>
              <p className="text-sm text-brand-sage">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              {(filterType !== 'all' || filterDate !== 'all' || searchQuery !== '') && (
                <button 
                  onClick={() => {
                    setFilterType('all');
                    setFilterDate('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-brand-green50 text-brand-green700 font-semibold rounded-xl text-sm hover:bg-brand-green100 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
