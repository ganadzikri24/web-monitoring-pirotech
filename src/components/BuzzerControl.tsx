"use client";

import { Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BuzzerControl() {
  const [buzzer, setBuzzer] = useState(false);

  return (
    <div className="bg-card-bg p-6 lg:p-8 rounded-2xl shadow-sm border border-card-border h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green50 text-brand-green flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-green700">Kontrol Buzzer Manual</h2>
            <p className="text-xs text-brand-sage">Nyalakan/matikan alarm darurat.</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center py-6">
        <motion.button 
          onClick={() => setBuzzer(!buzzer)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer ${
            buzzer 
              ? 'bg-red-500 text-white shadow-red-500/30' 
              : 'bg-input-bg border-4 border-card-border text-brand-sage hover:text-foreground'
          }`}
        >
          {buzzer && (
            <span className="absolute inset-0 rounded-full animate-ping border-4 border-red-500 opacity-20"></span>
          )}
          {buzzer ? <Volume2 className="w-12 h-12 mb-1" /> : <VolumeX className="w-12 h-12 mb-1" />}
          <span className="font-bold text-xl">{buzzer ? 'ON' : 'OFF'}</span>
        </motion.button>

        <div className="mt-8 text-center px-4">
          {buzzer ? (
            <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Buzzer sedang berbunyi!
            </p>
          ) : (
            <p className="text-sm font-medium text-brand-sage">
              Tekan tombol untuk membunyikan alarm manual.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
