"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function ThresholdConfig() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [minTemp, setMinTemp] = useState(20);
  const [maxTemp, setMaxTemp] = useState(450);
  const [buzzerMax, setBuzzerMax] = useState(400);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-card-bg p-6 lg:p-8 rounded-2xl shadow-sm border border-card-border h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-green50 text-brand-green flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-green700">Ambang Batas Suhu</h2>
          <p className="text-xs text-brand-sage">Atur batas suhu aman operasional.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 flex-1 flex flex-col">
        <div className="space-y-5">
          <h3 className="font-bold text-sm text-brand-green700 border-b border-card-border pb-2">Batas Suhu Normal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-sage">Suhu Min (°C)</label>
              <input 
                type="number" 
                value={minTemp}
                onChange={(e) => setMinTemp(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-sage">Suhu Maks (°C)</label>
              <input 
                type="number" 
                value={maxTemp}
                onChange={(e) => setMaxTemp(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 flex-1">
          <h3 className="font-bold text-sm text-brand-green700 border-b border-card-border pb-2">Peringatan Alarm (Buzzer)</h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-sage">Nyalakan alarm jika suhu &gt; ... °C</label>
            <input 
              type="number" 
              value={buzzerMax}
              onChange={(e) => setBuzzerMax(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" 
            />
            <p className="text-xs text-brand-sage/70 leading-relaxed mt-1">
              Buzzer akan berbunyi secara otomatis saat suhu melewati batas ini.
            </p>
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
            disabled={loading}
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
