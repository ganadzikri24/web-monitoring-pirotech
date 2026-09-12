"use client";

import { useEffect, useState } from "react";
import { listenToNotifications, NotificationData } from "@/lib/firebaseUtils";
import { Info, AlertTriangle, CheckCircle, Flame, Loader2, Bell, Trash2 } from "lucide-react";
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

  useEffect(() => {
    if (roleLoading || user === undefined) return;
    
    // Fetch up to 50 latest notifications for the history page
    const unsubscribe = listenToNotifications(50, user?.uid, !!isAdmin, (data) => {
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
      setSelectedLogs(notifications.map(n => n.id!));
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Riwayat Aktivitas</h1>
        <p className="text-brand-sage leading-relaxed">
          Pantau seluruh log notifikasi dan aktivitas yang terjadi di sistem.
        </p>
      </div>

      <div className="bg-card-bg rounded-2xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-6 border-b border-card-border bg-input-bg/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-bold text-lg text-brand-green700">Daftar Notifikasi</h2>
          
          {isAdmin && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
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

        {isAdmin && isSelectionMode && notifications.length > 0 && (
          <div className="px-6 py-3 border-b border-card-border bg-input-bg flex items-center gap-3">
            <input 
              type="checkbox" 
              onChange={handleSelectAll}
              checked={selectedLogs.length > 0 && selectedLogs.length === notifications.length}
              className="rounded border-input-border text-brand-green focus:ring-brand-green/20 w-4 h-4"
            />
            <span className="text-sm font-semibold text-brand-sage">Pilih Semua</span>
          </div>
        )}

        <div className="divide-y divide-card-border">
          {loading || roleLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
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
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-input-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-card-border">
                <Bell className="w-8 h-8 text-brand-sage" />
              </div>
              <h3 className="font-bold text-lg text-brand-green700 mb-1">Belum Ada Aktivitas</h3>
              <p className="text-sm text-brand-sage">Sistem akan mencatat aktivitas secara otomatis di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
