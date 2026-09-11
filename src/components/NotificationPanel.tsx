"use client";

import { BellRing, Smartphone, Mail, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listenToConfig, updateConfig, ConfigData } from "@/lib/firebaseUtils";

export default function NotificationPanel() {
  const [fcm, setFcm] = useState(true);
  const [email, setEmail] = useState(false);
  const [warningPercent, setWarningPercent] = useState(90);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToConfig((config: ConfigData | null) => {
      if (config) {
        setWarningPercent(config.warning_percent || 90);
        setFcm(config.push_enabled ?? true);
      }
      setInitialLoad(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    const success = await updateConfig({ 
      warning_percent: warningPercent,
      push_enabled: fcm 
    });
    
    setLoading(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-card-bg p-6 lg:p-8 rounded-2xl shadow-sm border border-card-border h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-green50 text-brand-green flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-green700">Notifikasi & Peringatan</h2>
          <p className="text-xs text-brand-sage">Atur preferensi penerimaan alarm dari sistem.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 flex-1 flex flex-col">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-brand-green700 border-b border-card-border pb-2">Metode Pengiriman</h3>
          
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-input-bg transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-brand-sage" />
              <div>
                <p className="font-semibold text-brand-green700 text-sm">Notifikasi Push (Perangkat)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" disabled={initialLoad} className="sr-only peer" checked={fcm} onChange={() => setFcm(!fcm)} />
              <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-input-bg transition-colors opacity-50 cursor-not-allowed" title="Fitur Email belum tersedia">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-sage" />
              <div>
                <p className="font-semibold text-brand-green700 text-sm">Notifikasi Email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-not-allowed">
              <input type="checkbox" disabled className="sr-only peer" checked={email} onChange={() => setEmail(!email)} />
              <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <h3 className="font-bold text-sm text-brand-green700 border-b border-card-border pb-2">Sensitivitas Peringatan</h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-sage">Kirim peringatan "Warning" saat suhu mencapai ... % batas maks</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                disabled={initialLoad}
                value={warningPercent}
                onChange={(e) => setWarningPercent(Number(e.target.value))}
                className="w-24 px-4 py-3 rounded-xl border border-input-border bg-input-bg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all disabled:opacity-50"
              />
              <span className="text-lg font-bold text-brand-green700">%</span>
            </div>
            <p className="text-xs text-brand-sage/70">Peringatan awal sebelum suhu mencapai level kritis (Critical).</p>
          </div>

          <div className="mt-6 pt-4 border-t border-card-border space-y-3">
            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-500">Level: Warning</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-500/80">Suhu mendekati batas aman</p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 flex items-start gap-3">
              <BellRing className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-500">Level: Critical</p>
                <p className="text-xs text-red-600/80 dark:text-red-500/80">Suhu melewati batas aman — buzzer & notifikasi dikirim otomatis.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-card-border">
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-brand-green font-semibold bg-brand-green50 py-3 px-4 rounded-xl text-center mb-4"
            >
              Pengaturan berhasil disimpan.
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading || initialLoad}
            className="w-full bg-brand-green hover:bg-brand-green700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan…
              </>
            ) : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
