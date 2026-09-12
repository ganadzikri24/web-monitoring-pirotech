"use client";

import { useEffect, useState } from "react";
import { listenToNotifications, NotificationData } from "@/lib/firebaseUtils";
import { Info, AlertTriangle, CheckCircle, Flame, Loader2, Bell } from "lucide-react";

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

  useEffect(() => {
    // Fetch up to 50 latest notifications for the history page
    const unsubscribe = listenToNotifications(50, (data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      case "warning": return "text-amber-600";
      case "critical": return "text-red-600";
      case "success": return "text-brand-green";
      default: return "text-brand-sage";
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
        <div className="p-6 border-b border-card-border bg-input-bg/30">
          <h2 className="font-bold text-lg text-brand-green700">Daftar Notifikasi</h2>
        </div>

        <div className="divide-y divide-card-border">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="p-6 hover:bg-brand-green50/30 transition-colors flex gap-4">
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
                  <p className="text-sm text-foreground mt-1.5 leading-relaxed">
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
